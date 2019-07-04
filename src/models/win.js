var mongoose = require('mongoose');
var shortid = require('shortid');
var moment = require('moment');
var Schema = mongoose.Schema;

var WinSchema = new Schema({
    _id: {
      type: String,
      'default': shortid.generate,
    },
    userId: String,
    username: String,
    avatar: String,
    winTimes: Number,
    predictTimes: Number,
    winRatio: Number,
    rank: Number,
  },
  {
    timestamps: true,
  });

var Win = mongoose.model('Win', WinSchema);
module.exports = Win;

