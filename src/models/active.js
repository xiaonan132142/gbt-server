var mongoose = require('mongoose');
var shortid = require('shortid');
var moment = require('moment');
var Schema = mongoose.Schema;

var ActiveSchema = new Schema({
    _id: {
      type: String,
      'default': shortid.generate,
    },
    userId: String,
    username: String,
    avatar: String,

    times: Number,
    rank: Number,
  },
  {
    timestamps: true,
  });

var Active = mongoose.model('Active', ActiveSchema);
module.exports = Active;

