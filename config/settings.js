const path = require('path');
const logPath = path.join(__dirname, '../logs');
const isProd = process.env.NODE_ENV === 'production';
const mongoHost = isProd ? '127.0.0.1' : '101.37.245.79';
const redisHost = isProd ? '127.0.0.1' : '101.37.245.79';
const pass = 'Ultrain721';
const dbname = 'gbt';

module.exports = {
  serverPort: 8081,

  // 数据库配置
  DB_URL: 'mongodb://root:' + pass + '@' + mongoHost + ':27017/' + dbname,
  DB: dbname,
  HOST: mongoHost,
  PORT: 27017,
  USERNAME: 'root',
  PASSWORD: pass,

  // redis配置
  openRedis: true, //是否开启,若为true 则下面的信息必须配置正确完整
  redis_host: redisHost,
  redis_port: 6379,
  redis_psd: '',
  redis_db: 0,

  redis_key_btc_index: 'redis_key_btc_index',

  logger: {
    'directory': logPath,
    'level': 'info',
    'console': true,
    'file': true,
  },

  ultrainId: 'ultrain1Qj2zICAtXPF90S',
  secretId: 'sKsTU6AMtpvDIPUJqrVTDmN689bJPnYS',
  serverUrl: 'http://history.natapp1.cc',
  imageUrl: 'https://developer.ultrain.io',
  swaggerUrl: 'benyasin.s1.natapp.cc',
};
