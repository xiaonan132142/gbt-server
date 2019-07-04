const schedule = require('node-schedule');
const { logger } = require('../middleware/logFactory');

async function init() {
  var rule = new schedule.RecurrenceRule();
  rule.minute = new schedule.Range(0, 59, 1);
  schedule.scheduleJob(rule, async () => {
    console.log('ddddddddd-----');
  });
}

module.exports = init;
