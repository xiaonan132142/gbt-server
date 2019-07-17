const schedule = require('node-schedule');
const { logger } = require('../middleware/logFactory');
const { write, read } = require('../utils/cacheUtil');
const settings = require('../../config/settings');
const RankModel = require('../models').Rank;
const PredictModel = require('../models').Predict;
const AwardModel = require('../models').Award;
const request = require('request');
const randomstring = require('randomstring');
const { asyncForEach } = require('../utils/helpers');
const moment = require('moment');
const { createU3 } = require('u3.js');

let asyncFunc = async () => {
  return new Promise((resolve, reject) => {
    request('https://www.huobi.co/-/x/pro/market/overview5?r=' + randomstring.generate(6), function(error, response, body) {
      if (response && response.statusCode === 200) {
        let dataArr = JSON.parse(body).data;
        let targets = dataArr.filter(d => {
          return d.symbol === 'btcusdt';
        });
        if (targets.length) {
          let btcusdt = targets[0];
          resolve(btcusdt);
        }
      } else {
        reject(500);
      }
    });
  });
};

async function rankStatistic() {
  var rule = new schedule.RecurrenceRule();
  rule.minute = new schedule.Range(0, 59, 1);
  schedule.scheduleJob(rule, async () => {

    const statistics = await PredictModel.aggregate([
      //{ '$match': { 'isFinished': true } },
      {
        '$group': {
          _id: { userId: '$userId' },
          predictTimes: { $sum: 1 },
          winTimes: {
            $sum: { '$cond': [{ '$eq': ['$isWin', true] }, 1, 0] },
          },
        },
      },
      {
        '$project': {
          'predictTimes': '$predictTimes',
          'winTimes': '$winTimes',
          'winRatio': { '$divide': ['$winTimes', '$predictTimes'] },
        },
      },
      //{ '$sort': { 'predictTimes': -1 } },
    ]);

    await asyncForEach(statistics, async s => {
      let userId = s._id.userId;
      const rank = {
        userId,
        predictTimes: s.predictTimes,
        winTimes: s.winTimes,
        winRatio: s.winRatio,
      };

      await RankModel.findOneAndUpdate({ userId }, { $set: rank }, { upsert: true });
    });
  });
}

/**
 * 每一分钟获取一下最新交易数据
 * 并缓存起来
 * @returns {Promise<void>}
 */
async function btcIndexQuery() {
  var rule = new schedule.RecurrenceRule();
  rule.second = [0, 30];
  schedule.scheduleJob(rule, async () => {

    let a = await asyncFunc();
    //console.log(a);
    let ratio = ((a.close - a.open) / a.open) * 100;
    if (ratio > 0) {
      ratio = '+' + ratio.toFixed(2) + '%';
    } else {
      ratio = ratio.toFixed(2) + '%';
    }
    let data = {
      price: a.close + '',
      ratio,
    };

    //1分钟
    await write(settings.redis_key_btc_index, data, 60);
    console.log('redis: [' + settings.redis_key_btc_index + '] was cached in redis successfully');

  });
}

/**
 * 每天凌晨0：00取出最新指标数据
 * 判断出昨天的涨跌
 * 批量更新当天所有预言
 * @returns {Promise<void>}
 */
async function batchUpdateResult() {
  schedule.scheduleJob({ hour: 0, minute: 0, second: 0 }, async () => {
    let btcIndex = await read(settings.redis_key_btc_index);
    if (btcIndex) {
      let actualResult = btcIndex.ratio.startsWith('+') ? 1 : -1;
      let yesterday = moment().add('-1', 'days').format('YYYY-MM-DD');

      //取出昨天奖池的总额
      const u3 = createU3(settings.u3Config);
      const balance = await u3.getCurrencyBalance({
        code: settings.pointAccount,
        account: settings.poolAccount,
        symbol: 'UPOINT',
      });
      let totalPool = balance.length > 0 ? balance[0].split(' ')[0] * 1 : 0;
      //取出昨天预言成功的人
      const totalUsers = await PredictModel.countDocuments({
        predictResult: actualResult,
        date: yesterday,
      });

      //算出每个人的平均收益
      let actualValue = totalUsers > 0 ? parseInt(totalPool / totalUsers) : 0;

      logger.info('batch update result for ' + yesterday);

      let winObj = {
        actualResult: actualResult,
        actualValue: actualValue,
        isWin: true,
        isFinished: true,
      };
      await PredictModel.updateMany({
        predictResult: actualResult,
        date: yesterday,
      }, { '$set': winObj }, { 'multi': true });


      let lostObj = {
        actualResult: actualResult,
        actualValue: 0,
        isWin: false,
        isFinished: true,
      };
      await PredictModel.updateMany({
        predictResult: -actualResult,
        date: yesterday,
      }, { '$set': lostObj }, { 'multi': true });
    }
  });

}


/**
 * 每天凌晨0：15将奖池瓜分给预言成功用户
 * 从收益账户划拨一定比例奖励给某些用户
 * @returns {Promise<void>}
 */
async function settlement() {

  schedule.scheduleJob({ hour: 0, minute: 15, second: 0 }, async () => {

    let yesterday = moment().add('-1', 'days').format('YYYY-MM-DD');

    logger.info('settlement for ' + yesterday);

    //查询奖池总额与获奖总人数，瓜分奖池
    let winObj = {
      isWin: true,
      isFinished: true,
      date: yesterday,
    };
    let winList = await PredictModel.find(winObj);

    const u3 = await createU3(settings.u3Config);
    await asyncForEach(winList, async w => {
      console.log('为获胜者userId:' + w.userId + ',accountName:' + w.accountName + ',发送奖励' + w.actualValue);

      const c = await u3.contract(settings.pointAccount);
      await c.transfer(settings.poolAccount, w.accountName, w.actualValue + ' UPOINT', 'gbt settlement for ' + w.accountName + ':' + moment().format('YYYY-MM-DD HH:MM:SS'), { keyProvider: settings.poolAccountPk });
    });


    //80%的收益总额分配给前10个获奖用户
    const gainBalance = await u3.getCurrencyBalance({
      code: settings.pointAccount,
      account: settings.gainAccount,
      symbol: 'UPOINT',
    });
    const totalGain = gainBalance[0] ? gainBalance[0].split(' ')[0] * 1 : 0;
    logger.info(yesterday + ' 个人收益账户总收益为' + totalGain);

    const totalGainWillAward = totalGain * settings.percentageForAward; //set 80% reward
    const eachGainWillAward = parseInt(totalGainWillAward / settings.topUserForAward); //set top 10 users reward

    if (eachGainWillAward > 0) {

      logger.info('为前' + settings.topUserForAward + '个人发送额外奖励' + eachGainWillAward);
      let rewardList = await PredictModel.find(winObj).sort({
        createdAt: -1,
      }).skip(0).limit(settings.topUserForAward);

      await asyncForEach(rewardList, async w => {

        logger.info('为用户userId:' + w.userId + ',accountName:' + w.accountName + ',发送额外奖励' + eachGainWillAward);

        const c = await u3.contract(settings.pointAccount);
        await c.transfer(settings.gainAccount, w.accountName, eachGainWillAward + ' UPOINT', 'gbt award for ' + w.accountName + ':' + moment().format('YYYY-MM-DD HH:MM:SS'), { keyProvider: settings.gainAccountPk });

        const awardObj = {
          userId: w.userId,
          username: w.username,
          avatar: w.avatar,

          accountName: w.accountName,
          date: yesterday,
          result: eachGainWillAward,
        };
        const newAward = new AwardModel(awardObj);
        await newAward.save();
      });


      //将剩下的20%收益转到产品作者账户
      const gainRemainBalance = await u3.getCurrencyBalance({
        code: settings.pointAccount,
        account: settings.gainAccount,
        symbol: 'UPOINT',
      });
      console.log(gainRemainBalance);
      const totalRemain = gainRemainBalance[0] ? gainRemainBalance[0].split(' ')[0] * 1 : 0;
      if (totalRemain > 0) {
        logger.info('将剩下的20%转到个人账户' + totalRemain);
        const c = await u3.contract(settings.pointAccount);
        await c.transfer(settings.gainAccount, settings.personalAccount, gainRemainBalance[0], 'gbt owner gain for ' + moment().format('YYYY-MM-DD HH:MM:SS'), { keyProvider: settings.gainAccountPk });
      }
    }

  });
}


module.exports = {
  rankStatistic,
  btcIndexQuery,
  batchUpdateResult,
  settlement,

};
