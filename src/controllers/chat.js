const _ = require('lodash');
const settings = require('../../config/settings');
const ChatModel = require('../models').Chat;

class Chat {
  constructor() {
    // super()
  }

  async getAll(req, res, next) {
    try {
      let current = req.query.current || 1;
      let pageSize = req.query.pageSize || 10;

      const chats = await ChatModel.find({}, {
        content: 1,
        createdAt: 1,
        userId: 1,
      }).sort({
        createdAt: -1,
      }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize)).populate([
        {
          path: 'user',
          select: 'username avatar accountName phoneNum',
        }]).exec();

      const totalItems = await ChatModel.countDocuments();

      res.send({
        state: 'success',
        data: chats,
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
        message: '获取聊天列表失败',
      });
    }
  }

  async addOne(req, res, next) {
    const userId = req.body.userId;
    const content = req.body.content;

    if (!userId) {
      res.status(500);
      res.send({
        state: 'error',
        message: 'userId 不能为空',
      });
      return;
    }
    try {
      const chatObj = {
        userId,
        content,
      };
      const newChat = new ChatModel(chatObj);
      await newChat.save();

      res.send({
        state: 'success',
        id: newChat._id,
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

module.exports = new Chat();
