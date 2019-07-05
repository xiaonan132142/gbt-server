const schedule = require('node-schedule');
const { logger } = require('../middleware/logFactory');
const { write } = require('../utils/cacheUtil');
const settings = require('../../config/settings');
const RankModel = require('../models').Rank;
const PredictModel = require('../models').Predict;
const request = require('request');
const randomstring = require('randomstring');
const { asyncForEach } = require('../utils/helpers');
const moment = require('moment');

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
      { '$match': { 'isFinished': true } },
      {
        '$group': {
          _id: { userId: '$userId', username: '$username', avatar: '$avatar' },
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
      let username = s._id.username;
      let avatar = s._id.avatar;
      const rank = {
        userId,
        username,
        avatar,
        predictTimes:s.predictTimes,
        winTimes:s.winTimes,
        winRatio:s.winRatio,
      }

      await RankModel.findOneAndUpdate({ userId }, rank, { upsert: true });
    });
  });
}

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
      ratio = '-' + ratio.toFixed(2) + '%';
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

async function settlement() {
  var rule = new schedule.RecurrenceRule();
  rule.minute = new schedule.Range(0, 59, 1);

  //判断今天的涨跌结果，假定是涨，1
  let actualResult = -1;
  let actualValue = 7;//TODO total/猜1的人数
  let today = moment().format('YYYY-MM-DD');

  schedule.scheduleJob(rule, async () => {
    logger.info('settlement for ' + today);
    let winObj = {
      actualResult: actualResult,
      actualValue: actualValue,
      isFinished: true,
    };
    await PredictModel.updateMany({
      predictResult: actualResult,
      date: today,
    }, { '$set': winObj }, { 'multi': true });


    let lostObj = {
      actualResult: -actualResult,
      actualValue: 0,
      isFinished: true,
    };
    await PredictModel.updateMany({
      predictResult: -actualResult,
      date: today,
    }, { '$set': lostObj }, { 'multi': true });

  });
}

module.exports = {
  rankStatistic,
  btcIndexQuery,
  settlement,
};
