var mongoose = require('mongoose');
var shortid = require('shortid');
var moment = require('moment');
var Schema = mongoose.Schema;

var PredictSchema = new Schema({
    _id: {
      type: String,
      'default': shortid.generate,
    },
    userId: String,
    username: String,
    avatar: String,

    accountName: String,

    date: { type: String, default: moment().format('YYYY-MM-DD') },

    predictResult: Number,
    actualResult: Number,
    predictValue: Number,
    actualValue: Number,

    isWin: { type: Boolean, default: false },
    isFinished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  });

PredictSchema.index({
  userId: 1,
  date: 1,
}, {
  unique: true,
});


var Predict = mongoose.model('Predict', PredictSchema);
module.exports = Predict;

