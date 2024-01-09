const Admin = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const mongoose = require('mongoose');

const asyncHandler = require('express-async-handler');
const passport = require('../passport-config');
const { body, validationResult } = require('express-validator');

exports.sign_in_post = asyncHandler(async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    // Handle the result of authentication
    if (err) {
      return next(err);
    }

    if (!user) {
      const errorMessage =
        info && info.message ? info.message : 'Authentication failed.';
      return res.status(401).json({ message: errorMessage });
    }

    // If authentication is successful, generate a JWT token
    const token = jwt.sign({ sub: user._id }, secretKey, { expiresIn: '10m' });

    // Send the token in the response
    res.json({ token });
  })(req, res, next);
});

exports.sign_in_get = asyncHandler(async (req, res, next) => {
  res.send('logging');
});

exports.comment_post = asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  const newComment = new Comment({
    content,
    author: 'Admin',
    post: req.params.postId,
  });
  try {
    console.log(req.params.postId);
    await newComment.save();
    res
      .status(201)
      .json({ success: true, message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

exports.comment_put = asyncHandler(async (req, res, next) => {
  res.send('allows editing comments');
});

exports.comment_delete = asyncHandler(async (req, res, next) => {
  try {
    const commentId = new mongoose.Types.ObjectId(req.params.commentId);
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      console.log('Comment not found');
      return res
        .status(404)
        .json({ success: false, message: 'Comment not found' });
    }

    const comment = await Comment.findById(commentId);
    console.log(req.params.commentId, comment);
  } catch (error) {
    console.log('There was some issue when deleting a comment: ', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

exports.post_new_get = asyncHandler(async (req, res, next) => {
  res.send('displaying page that allows to write new post');
});

exports.post_new_post = asyncHandler(async (req, res, next) => {
  res.send('allows to save new post');
});

exports.post_detail_get = asyncHandler(async (req, res, next) => {
  const [post, comments] = await Promise.all([
    Post.findById(req.params.id),
    Comment.find({ post: req.params.id }).sort({ date: -1 }),
  ]);
  res.json({ post, comments });
});

exports.post_detail_post = asyncHandler(async (req, res, next) => {
  res.send('allows editing a post');
});

exports.post_detail_delete = asyncHandler(async (req, res, next) => {
  res.send('delete  a post');
});

exports.main_get = asyncHandler(async (req, res, next) => {
  const posts = await Post.find();

  const postsWithComments = await Promise.all(
    posts.map(async (post) => {
      const comments = await Comment.find({ post: post._id });
      return { ...post.toObject(), comments };
    })
  );
  res.json(postsWithComments);
});
