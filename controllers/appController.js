const Admin = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

const bcrypt = require('bcryptjs');
const passport = require('../passport-config');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.main_get = asyncHandler(async (req, res, next) => {
  const postsPublished = await Post.find({published:true})
  res.json(postsPublished);
});

exports.post_detail_post = asyncHandler(async (req, res, next) => {
  res.send('details of one post');
});

exports.post_detail_get = asyncHandler(async (req, res, next) => {
  res.send('this is a path to leave a comment');
});