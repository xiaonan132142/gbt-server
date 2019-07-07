const _ = require('lodash');
const settings = require('../../config/settings');
const AwardModel = require('../models').Award;
const { getUserBasicInfo } = require('../utils/dataAsync');
const moment = require('moment');

class Award {
  constructor() {
    // super()
  }

  async getOneByUserId(req, res, next) {
    try {
      let current = req.query.current || 1;
      let pageSize = req.query.pageSize || 10;
      let userId = req.query.userId;

      const awards = await AwardModel.find({ userId }, {
        'userId': 1,
        'username': 1,
        'avatar': 1,
        'date': 1,
        'result': 1,
      }).sort({
        createdAt: -1,
      }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize));

      const totalItems = await AwardModel.countDocuments({userId});

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

}

module.exports = new Award();
