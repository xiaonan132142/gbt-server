const _ = require('lodash');
const RankModel = require('../models').Rank;

class Rank {
  constructor() {
    // super()
  }

  async getAllByActive(req, res, next) {
    try {
      let current = req.query.current || 1;
      let pageSize = req.query.pageSize || 10;

      const ranks = await RankModel.find({}).sort({
        predictTimes: -1,
      }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize));

      const totalItems = await RankModel.countDocuments();

      res.send({
        state: 'success',
        data: ranks,
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
        message: '获取预言成功列表失败',
      });
    }
  }

  async getAllByWin(req, res, next) {
    try {
      let current = req.query.current || 1;
      let pageSize = req.query.pageSize || 10;

      const ranks = await RankModel.find({}).sort({
        winRatio: -1,
      }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize));

      const totalItems = await RankModel.countDocuments();

      res.send({
        state: 'success',
        data: ranks,
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
        message: '获取预言成功列表失败',
      });
    }
  }

  async getOneByUserId(req, res, next) {
    try {
      let userId = req.query.userId;

      if (!userId || userId == "undefined") {
        res.send({
          state: 'error',
          message: 'userId 不能为空',
        });
        return;
      }

      const winUserIds = await RankModel.find({}, { userId: 1 }).sort({
        winRatio: -1,
      });

      const predictUserIds = await RankModel.find({}, { userId: 1 }).sort({
        predictTimes: -1,
      });

      let winRank = _.findIndex(winUserIds, ['userId', userId]);
      let predictRank = _.findIndex(predictUserIds, ['userId', userId]);

      const rank = await RankModel.findOne({ userId }, {
        userId: 1,
        username: 1,
        avatar: 1,
        winTimes: 1,
        predictTimes: 1,
        winRatio: 1,
      });

      let result = Object.assign({}, rank._doc, {
        winRank: winRank + 1,
        predictRank: predictRank + 1,
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
        message: '获取个人统计信息失败',
      });
    }
  }

}

module.exports = new Rank();
