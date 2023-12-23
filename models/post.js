const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

postSchema.virtual('date_formatted').get(function () {
  return DateTime.fromJSDate(this.date).toISODate();
});

module.exports = mongoose.model('Post', PostSchema);
