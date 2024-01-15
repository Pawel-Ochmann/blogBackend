const Post = require('../models/post');
const Comment = require('../models/comment');
const mongoose = require('mongoose');
require('dotenv').config();

const asyncHandler = require('express-async-handler');

exports.main_get = asyncHandler(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.error('Database connection is not established.');
    return res.status(500).json({ error: 'Failed connection to mongoDB' });
  }

  const postsPublished = await Post.find({ published: true }).sort({
    date: -1,
  });

  const postsWithComments = await Promise.all(
    postsPublished.map(async (postPublished) => {
      const comments = await Comment.find({ post: postPublished._id });
      return { ...postPublished.toObject(), comments };
    })
  );
  res.json(postsWithComments);
});

exports.post_detail_get = asyncHandler(async (req, res, next) => {
  const [post, comments] = await Promise.all([
    Post.findById(req.params.postId),
    Comment.find({ post: req.params.postId }).sort({ date: -1 }),
  ]);
  res.json({ post, comments });
});

exports.post_detail_post = asyncHandler(async (req, res, next) => {
  const { author, content } = req.body;
  const newComment = new Comment({ content, author, post: req.params.postId });
  try {
    await newComment.save();
    res
      .status(201)
      .json({ success: true, message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
