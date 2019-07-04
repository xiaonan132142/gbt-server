const _ = require('lodash');
const ActiveModel = require('../models').Active;

class Active {
  constructor() {
    // super()
  }

  async getAll(req, res, next) {
    try {
      let current = req.query.current || 1;
      let pageSize = req.query.pageSize || 10;

      const actives = await ActiveModel.find({}).sort({
        createdAt: -1,
      }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize));

      const totalItems = await ActiveModel.countDocuments();

      res.send({
        state: 'success',
        data: actives,
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
        message: '获取活跃用户列表失败',
      });
    }
  }
}

module.exports = new Active();
