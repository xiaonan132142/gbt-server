var mongoose = require('mongoose');
var shortid = require('shortid');
var moment = require('moment');
var User = require('./user');
var Schema = mongoose.Schema;

var PredictSchema = new Schema({
    _id: {
      type: String,
      'default': shortid.generate,
    },
    userId: {type: String, ref: 'User'},
    date: { type: String, default: moment().format('YYYY-MM-DD') },
    predictResult: Number,
    actualResult: Number,
    predictValue: Number,
    actualValue: Number,

    isWin: { type: Boolean, default: false },
    isFinished: { type: Boolean, default: false },
    hasRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  });

var Predict = mongoose.model('Predict', PredictSchema);
module.exports = Predict;

