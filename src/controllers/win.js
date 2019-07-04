const _ = require('lodash');
const WinModel = require('../models').Win;

class Win {
  constructor() {
    // super()
  }

  async getAll(req, res, next) {
    try {
      let current = req.query.current || 1;
      let pageSize = req.query.pageSize || 10;

      const wins = await WinModel.find({}).sort({
        createdAt: -1,
      }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize));

      const totalItems = await WinModel.countDocuments();

      res.send({
        state: 'success',
        data: wins,
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

}

module.exports = new Win();
