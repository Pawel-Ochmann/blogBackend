const Admin = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const asyncHandler = require('express-async-handler');
const passport = require('../passport-config');
const { body, validationResult } = require('express-validator');

exports.sign_in_post = asyncHandler(async (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: 'There is no such user!' });
    }

    const token = jwt.sign({ sub: user._id }, secretKey); 

    res.json({ token });
  })(req, res, next);
});

exports.sign_in_get = asyncHandler(async (req, res, next) => {
  res.send('post request to sign in');
});

exports.comment_post = asyncHandler(async (req, res, next) => {
  res.send('allows editing comments');
});

exports.comment_delete = asyncHandler(async (req, res, next) => {
  res.send('allows admin to delete a comment');
});

exports.post_new_get = asyncHandler(async (req, res, next) => {
  res.send('displaying page that allows to write new post');
});

exports.post_new_post = asyncHandler(async (req, res, next) => {
  res.send('allows to save new post');
});

exports.post_detail_get = asyncHandler(async (req, res, next) => {
  res.send('getting details of particular post');
});

exports.post_detail_post = asyncHandler(async (req, res, next) => {
  res.send('allows editing a post');
});

exports.post_detail_delete = asyncHandler(async (req, res, next) => {
  res.send('delete  a post');
});

exports.main_get = asyncHandler(async (req, res, next) => {
  res.send('getting a list of all posts');
});
