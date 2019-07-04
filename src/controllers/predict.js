const _ = require('lodash');
const settings = require('../../config/settings');
const requestIp = require('request-ip');
const PredictModel = require('../models').Predict;
const { getUserBasicInfo } = require('../utils/dataAsync');
const moment = require('moment');

class Predict {
  constructor() {
    // super()
  }

  async getAll(req, res, next) {
    try {
      let current = req.query.current || 1;
      let pageSize = req.query.pageSize || 10;

      const predicts = await PredictModel.find({},{
        "userId": 1,
        "username": 1,
        "avatar": 1,
        "date": 1,
        "predictResult": 1,
        "actualResult": 1,
        "predictValue": 1,
        "actualValue": 1,
        "isFinished": 1
      }).sort({
        createdAt: -1,
      }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize));

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

  async addOne(req, res, next) {
    const phoneNum = req.body.phoneNum;
    const predictResult = req.body.predictResult;
    const predictValue = req.body.predictValue;

    if (!phoneNum) {
      res.status(500);
      res.send({
        state: 'error',
        message: 'phoneNum 不能为空',
      });
      return;
    }
    try {
      let result = await getUserBasicInfo(phoneNum);
      if (!result || !result.data || result.data.state !== 'success') {
        res.status(500);
        res.send({
          state: 'error',
          message: '没有找到该手机号对应的用户',
        });
        return;
      }
      let userInfo = result.data.data;
      const predictObj = {
        userId: userInfo.id,
        username: userInfo.name,
        avatar: userInfo.logo,

        predictResult,
        predictValue,
      };
      let existed = await PredictModel.findOne({ date: moment().format('YYYY-MM-DD') });
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

}

module.exports = new Predict();
