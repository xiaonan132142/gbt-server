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

    date: { type: String, unique: true, default: moment().format('YYYY-MM-DD') },

    predictResult: Number,
    actualResult: Number,
    predictValue: Number,
    actualValue: Number,

    isFinished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  });

var Predict = mongoose.model('Predict', PredictSchema);
module.exports = Predict;

