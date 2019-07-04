const _ = require('lodash');
const settings = require('../../config/settings');
const ChatModel = require('../models').Chat;
const { getUserBasicInfo } = require('../utils/dataAsync');
const moment = require('moment');

class Chat {
  constructor() {
    // super()
  }

  async getAll(req, res, next) {
    try {
      let current = req.query.current || 1;
      let pageSize = req.query.pageSize || 10;

      const chats = await ChatModel.find({}, {
        'userId': 1,
        'username': 1,
        'avatar': 1,
        'content': 1,
        'createdAt': 1,
      }).sort({
        createdAt: -1,
      }).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize));

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
    const phoneNum = req.body.phoneNum;
    const content = req.body.content;

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
      const chatObj = {
        userId: userInfo.id,
        username: userInfo.name,
        avatar: userInfo.logo,

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
