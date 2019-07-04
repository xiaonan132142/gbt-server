var mongoose = require('mongoose');
var shortid = require('shortid');
var moment = require('moment');
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
    _id: {
      type: String,
      'default': shortid.generate,
    },
    userId: String,
    username: String,
    avatar: String,
    content: String,
  },
  {
    timestamps: true,
  });

var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;

