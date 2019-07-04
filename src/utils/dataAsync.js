const { write, deleteExpired } = require('./cacheUtil');
const settings = require('../../config/settings');
const { get, post } = require('../utils/ajaxUtil');
const { logger } = require('../middleware/logFactory');
const _ = require('lodash');

async function writeUgasPriceToRedis() {
  let result = {
    usd: 0,
    cny: 0,
  };

  const response = await get('https://api.qb.com/api/v1/market/tickers');
  if (response.data.status === 'ok') {
    const ugas2usdt = _.find(response.data.result.data, { symbol: 'ugas_usdt' });
    let price = ugas2usdt.last;
    // 1usd -> cny
    const { data: usd2cnyData } = await get('http://www.currencydo.com/index/api/hljs/hbd/USD_CNY.json');
    const USD2CNY = (usd2cnyData && usd2cnyData.split('#')[4]) || 6.8;
    result = {
      usd: price,
      cny: price * USD2CNY,
    };
  }
  //60分钟
  await write(settings.redis_key_ugas_price, result, 60 * 60);
  console.log('redis: [' + settings.redis_key_ugas_price + '] was cached in redis successfully');
}

async function getAccessToken() {
  try {
    let token = await post('http://benyasin.s1.natapp.cc/api/dapp/getAccessToken', {
      ultrainId: settings.ultrainId,
      secretId: settings.secretId,
    });
    return token;
  } catch (e) {
    logger.error(e);
  }
  return null;
}

async function getUserBasicInfo(phoneNum) {
  let result = await getAccessToken();
  try {
    if (result && result.data && result.data.token) {
      return await get('http://benyasin.s1.natapp.cc/api/user/getUserBasicInfo?phoneNum=' + phoneNum , null,{
        'x-access-token': result.data.token,
      });
    }
  } catch (e) {
    logger.error(e);
  }
}

async function deleteExpiredSessionInRedis() {

  await deleteExpired('sess*', () => {
    //console.log("done");
  });
  console.log('redis: expired session was deleted in redis successfully');
}

module.exports = {
  writeUgasPriceToRedis,
  deleteExpiredSessionInRedis,
  getUserBasicInfo,
};
