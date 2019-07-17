var mongoose = require('mongoose');
var shortid = require('shortid');
var User = require('./user');
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
    _id: {
      type: String,
      'default': shortid.generate,
    },
    userId: String,
    content: String,
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
  {
    timestamps: true,
  });

ChatSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: 'userId',
  justOne: true, // for many-to-1 relationships
});

var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;

