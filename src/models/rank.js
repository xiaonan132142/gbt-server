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
    winRatio: Number,
    predictTimes: Number,
  },
  {
    timestamps: true,
  });

WinSchema.index({
  userId: 1,
}, {
  unique: true,
});

var Rank = mongoose.model('Rank', WinSchema);
module.exports = Rank;

