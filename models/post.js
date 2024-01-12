const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');


const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type:String,
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
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

PostSchema.virtual('date_formatted').get(function () {
  return DateTime.fromJSDate(this.date).toISODate();
});
module.exports = mongoose.model('Post', PostSchema);
