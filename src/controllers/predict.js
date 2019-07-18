const _ = require('lodash');
const settings = require('../../config/settings');
const PredictModel = require('../models').Predict;
const { getUserBasicInfo } = require('../utils/dataAsync');
const moment = require('moment');
const { read } = require('../utils/cacheUtil');

class Predict {
  constructor() {
    // super()
  }

  async getAll(req, res, next) {
    try {
      let current = req.query.current || 1;
      let pageSize = req.query.pageSize || 10;

      const predicts = await PredictModel.find({}, {
        'userId': 1,
        'date': 1,
        'predictResult': 1,
        'actualResult': 1,
        'predictValue': 1,
        'actualValue': 1,
        'isWin': 1,
        'isFinished': 1,
      }).sort({
        createdAt: -1,
      }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize)).populate([
        {
          path: 'userId',
          select: 'username avatar accountName phoneNum',
        }]).exec();

      const totalItems = await PredictModel.countDocuments();

      res.send({
        state: 'success',
        data: predicts,
        pagination: {
          totalItems,
          current: Number(current) || 1,
          pageSize: Number(pageSize) || 10,
        },
      });
    } catch (err) {
      res.status(500);
      res.send({
        state: 'error',
        stack: err && err.stack,
        message: '获取adminUsers失败',
      });
    }
  }

  async getAllByUserId(req, res, next) {
    try {
      let userId = req.query.userId;
      let current = req.query.current || 1;
      let pageSize = req.query.pageSize || 10;

      if (!userId || userId == 'undefined') {
        res.send({
          state: 'error',
          message: 'userId 不能为空',
        });
        return;
      }

      const predicts = await PredictModel.find({ userId }, {
        userId: 1,
        date: 1,
        predictResult: 1,
        actualResult: 1,
        predictValue: 1,
        actualValue: 1,
        isWin: 1,
        isFinished: 1,
      }).sort({
        createdAt: -1,
      }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize)).populate([
        {
          path: 'userId',
          select: 'username avatar accountName phoneNum',
        }]).exec();

      const totalItems = await PredictModel.countDocuments();

      res.send({
        state: 'success',
        data: predicts,
        pagination: {
          totalItems,
          current: Number(current) || 1,
          pageSize: Number(pageSize) || 10,
        },
      });
    } catch (err) {
      res.status(500);
      res.send({
        state: 'error',
        stack: err && err.stack,
        message: '获取个人预言记录失败',
      });
    }
  }

  async getLatestByUserId(req, res, next) {
    try {
      let userId = req.query.userId;

      if (!userId || userId == 'undefined') {
        res.send({
          state: 'error',
          message: 'userId 不能为空',
        });
        return;
      }

      let latestPredict = null;
      let latestPredicts = await PredictModel.find({ userId }, {
        userId: 1,
        date: 1,
        predictResult: 1,
        actualResult: 1,
        predictValue: 1,
        actualValue: 1,
        isWin: 1,
        isFinished: 1,
        hasRead: 1,
      }).sort({
        createdAt: -1,
      }).skip(0).limit(1);

      if (latestPredicts.length) {
        latestPredict = latestPredicts[0];
      }
      res.send({
        state: 'success',
        data: latestPredict,
      });
    } catch (err) {
      res.status(500);
      res.send({
        state: 'error',
        stack: err && err.stack,
        message: '获取个人最新一条预言记录失败',
      });
    }
  }

  async addOne(req, res, next) {

    let today = moment().format('YYYY-MM-DD');

    let sDateStr = today + ' 00:30:00';
    let eDateStr = today + ' 22:30:00';
    let sDate = moment(sDateStr, 'YYYY-MM-DD hh:mm:ss');
    let eDate = moment(eDateStr, 'YYYY-MM-DD hh:mm:ss');

    if (moment() < sDate || moment() > eDate) {
      res.status(500);
      res.send({
        state: 'error',
        message: '当前时间段不能预言',
      });
      return;
    }

    const userId = req.body.userId;
    const predictResult = req.body.predictResult;
    const predictValue = req.body.predictValue;

    if (!userId) {
      res.status(500);
      res.send({
        state: 'error',
        message: 'userId 不能为空',
      });
      return;
    }
    try {
      const predictObj = {
        userId,
        predictResult,
        predictValue,
      };
      let existed = await PredictModel.findOne({ userId, date: moment().format('YYYY-MM-DD') });
      if (!_.isEmpty(existed)) {
        res.status(500);
        res.send({
          state: 'error',
          message: '今天已经预言过！',
        });
      } else {
        const newPredict = new PredictModel(predictObj);
        await newPredict.save();
        res.send({
          state: 'success',
          id: newPredict._id,
        });
      }
    } catch (err) {
      res.status(500);
      res.send({
        state: 'error',
        stack: err && err.stack,
        message: '保存数据失败:',
      });
    }
  }

  async updateOne(req, res, next) {
    const _id = req.body.id;

    if (!_id) {
      res.status(500);
      res.send({
        state: 'error',
        message: 'id 不能为空',
      });
      return;
    }

    try {
      const predict = {
        hasRead: true,
      };
      await PredictModel.findOneAndUpdate({ _id }, predict, { upsert: true });
      res.send({
        state: 'success',
        message: '',
      });

    } catch (err) {
      res.status(500);
      res.send({
        state: 'error',
        stack: err && err.stack,
        message: '保存数据失败:',
      });
    }
  }

  async getLatestIndex(req, res, next) {
    try {
      const data = await read(settings.redis_key_btc_index);

      const totalUp = await PredictModel.countDocuments({
        date: moment().format('YYYY-MM-DD'),
        predictResult: 1,
      });
      const totalDown = await PredictModel.countDocuments({
        date: moment().format('YYYY-MM-DD'),
        predictResult: -1,
      });
      var proportion = 0.5;
      if (totalDown > 0 || totalUp > 0) {
        proportion = (totalUp / (totalUp + totalDown)).toFixed(1);
      }
      const result = Object.assign({}, data, {
        proportion,
      });

      res.send({
        state: 'success',
        data: result,
      });
    } catch (err) {
      res.status(500);
      res.send({
        state: 'error',
        stack: err && err.stack,
        message: '获取交易所数据失败',
      });
    }
  }
}

module.exports = new Predict();
