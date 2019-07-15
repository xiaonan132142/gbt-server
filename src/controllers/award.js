const _ = require('lodash');
const settings = require('../../config/settings');
const AwardModel = require('../models').Award;
const { getUserBasicInfo } = require('../utils/dataAsync');
const moment = require('moment');

class Award {
  constructor() {
    // super()
  }

  async getAllByUserId(req, res, next) {
    try {
      let current = req.query.current || 1;
      let pageSize = req.query.pageSize || 10;
      let userId = req.query.userId;

      if (!userId || userId == 'undefined') {
        res.send({
          state: 'error',
          message: 'userId 不能为空',
        });
        return;
      }

      const awards = await AwardModel.find({ userId }, {
        'userId': 1,
        'username': 1,
        'avatar': 1,
        'date': 1,
        'result': 1,
      }).sort({
        createdAt: -1,
      }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize));

      const totalItems = await AwardModel.countDocuments({ userId });

      res.send({
        state: 'success',
        data: awards,
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
        message: '获取奖励列表失败',
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

      const latestAward = await AwardModel.find({ userId }, {
        '_id': 1,
        'userId': 1,
        'username': 1,
        'avatar': 1,
        'date': 1,
        'result': 1,
        'hasRead': 1,
      }).sort({
        createdAt: -1,
      }).skip(0).limit(1);

      res.send({
        state: 'success',
        data: latestAward,
      });
    } catch (err) {
      res.status(500);
      res.send({
        state: 'error',
        stack: err && err.stack,
        message: '获取个人最新一条奖励记录失败',
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
      const award = {
        hasRead: true,
      };
      await AwardModel.findOneAndUpdate({ _id }, award, { upsert: true });
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

}

module.exports = new Award();
