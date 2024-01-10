const Admin = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');

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
  const { content } = req.body;

  try {
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content,
      },
      { new: true }
    );

    if (!editedComment) {
      console.log('Comment not found');
      return res
        .status(404)
        .json({ success: false, message: 'Comment not found' });
    }
    res.status(200).json({ success: true, data: editedComment });
  } catch (error) {
    console.log('There was some issue when deleting a comment: ', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

exports.comment_delete = asyncHandler(async (req, res, next) => {
  try {
    const commentId = new mongoose.Types.ObjectId(req.params.commentId);
    console.log(commentId);
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      console.log('Comment not found');
      return res
        .status(404)
        .json({ success: false, message: 'Comment not found' });
    }

    await Comment.findById(commentId);
  } catch (error) {
    console.log('There was some issue when deleting a comment: ', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

exports.post_new_post = asyncHandler(async (req, res, next) => {
  const { title, content, published } = req.body;
  console.log(title, content, published);

  const sanitizedContent = sanitizeHtml(content, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
    allowedAttributes: {
      a: ['href'],
    },
    allowedIframeHostnames: ['www.youtube.com'],
  });

  const newPost = new Post({
    title,
    content: sanitizedContent,
    published,
  });

  try {
    await newPost.save();
    res.status(201).json(savedPost);
  } catch {
    res.send('Failed to save a post!');
  }
});

exports.post_detail_get = asyncHandler(async (req, res, next) => {
  const [post, comments] = await Promise.all([
    Post.findById(req.params.id),
    Comment.find({ post: req.params.id }).sort({ date: -1 }),
  ]);
  res.json({ post, comments });
});

exports.post_detail_put = asyncHandler(async (req, res, next) => {
  res.send('allows editing a post');
});

exports.post_detail_delete = asyncHandler(async (req, res, next) => {
  try {
    console.log(req.params.id);
    await Comment.deleteMany({ post: req.params.id });
    const deletedComment = await Post.findByIdAndDelete(req.params.id);

    if (!deletedComment) {
      console.log('Post not found');
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }
    console.log('Post deleted successfully');
    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.log('There was some issue when deleting a comment: ', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

exports.main_get = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().sort({ date: -1 });

  const postsWithComments = await Promise.all(
    posts.map(async (post) => {
      const comments = await Comment.find({ post: post._id });
      return { ...post.toObject(), comments };
    })
  );
  res.json(postsWithComments);
});
