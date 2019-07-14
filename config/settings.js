const path = require('path');
const logPath = path.join(__dirname, '../logs');
const isProd = process.env.NODE_ENV === 'production';
const mongoHost = isProd ? '127.0.0.1' : '101.37.245.79';
const redisHost = isProd ? '127.0.0.1' : '101.37.245.79';
const pass = 'Ultrain721';
const dbname = 'gbt';

module.exports = {
  serverPort: 8082,

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
  u3Config: {
    httpEndpoint:"http://pioneer.natapp1.cc",
    httpEndpointHistory:"http://pioneer-history.natapp1.cc",
    chainId:"20c35b993c10b5ea1007014857bb2b8832fb8ae22e9dcfdc61dacf336af4450f",
    //logger: undefined
  },
  pointAccount:"ultrainpoint",
  poolAccount:"guessbtc",
  poolAccountPk:"5HwVm37N47bXiWoEP2ZMBL6HCDWuPWmoyvgZAmokvXH5u1Q7Mfo",
  gainAccount:"guessbtcgain",
  gainAccountPk:"5Ke8RSvYJmN96tArJP5enS3a3kVtojCTT5gf3UUg7EAMnpeWToh",
  personalAccount:"cona2",
  percentageForAward:0.8,
  topUserForAward:1,

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
