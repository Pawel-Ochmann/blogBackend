const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const CommentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

CommentSchema.virtual('date_formatted').get(function () {
  return DateTime.fromJSDate(this.date).toISODate();
});

module.exports = mongoose.model('Comment', CommentSchema);
