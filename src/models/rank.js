var mongoose = require('mongoose');
var shortid = require('shortid');
var User = require('./user');
var Schema = mongoose.Schema;

var RankSchema = new Schema({
    _id: {
      type: String,
      'default': shortid.generate,
    },
    userId: String,
    winTimes: Number,
    winRatio: Number,
    predictTimes: Number,
  },
  {
    toObject: { virtuals: true },
    toJSON: {virtuals:true}
  },
  {
    timestamps: true,
  });

RankSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: 'userId',
  justOne: true // for many-to-1 relationships
});

RankSchema.index({
  userId: 1,
}, {
  unique: true,
});

var Rank = mongoose.model('Rank', RankSchema);
module.exports = Rank;

