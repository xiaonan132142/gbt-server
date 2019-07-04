const schedule = require('node-schedule');
const { logger } = require('../middleware/logFactory');
const request = require('request');
const randomstring = require('randomstring');

async function scheduleRunning() {
  var rule = new schedule.RecurrenceRule();
  //rule.minute = new schedule.Range(0, 59, 1);
  rule.second = [0, 20, 40];
  schedule.scheduleJob(rule, async () => {
    /*request('https://www.huobi.co/-/x/pro/market/overview5?r=' + randomstring.generate(6), function(error, response, body) {
      if (response && response.statusCode === 200) {
        let dataArr = JSON.parse(body).data;
        let targets = dataArr.filter(d => {
          return d.symbol === 'btcusdt';
        });
        if (targets.length) {
          let btcusdt = targets[0]
          console.log(btcusdt)
        }
      }
    });*/
  });
}

module.exports = scheduleRunning;
