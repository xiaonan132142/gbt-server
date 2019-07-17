var mongoose = require('mongoose');
var shortid = require('shortid');
var moment = require('moment');
var User = require('./user');
var Schema = mongoose.Schema;

var AwardSchema = new Schema({
    _id: {
      type: String,
      'default': shortid.generate,
    },
    userId: {type: String, ref: 'User'},
    date: { type: String, default: moment().format('YYYY-MM-DD') },
    result: Number,
    hasRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  });

var Award = mongoose.model('Award', AwardSchema);
module.exports = Award;

