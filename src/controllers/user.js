const _ = require('lodash');
const UserModel = require('../models').User;
const { getUserBasicInfo } = require('../utils/dataAsync');

class User {
  constructor() {
    // super()
  }

  async addOne(req, res, next) {
    const userId = req.body.userId;
    const phoneNum = req.body.phoneNum;
    const accountName = req.body.accountName;
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
      if (userId !== userInfo.id) {
        res.status(500);
        res.send({
          state: 'error',
          message: '传参userId与用户userId不匹配',
        });
        return;
      }

      const userObj = {
        userId: userInfo.id,
        username: userInfo.name,
        avatar: userInfo.logo,
        accountName,
      };
      await UserModel.findOneAndUpdate({ userId }, userObj, { upsert: true });

      res.send({
        state: 'success',
        data: userObj
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

module.exports = new User();
