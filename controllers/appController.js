// router.get('/:id', appController.post_detail_get);
// router.post('/:id', appController.post_detail_post);
// router.get('/', appController.main_get);

const Admin = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

const bcrypt = require('bcryptjs');
const passport = require('../passport-config');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.main_get = asyncHandler(async (req, res, next) => {
  res.send('list of all posts');
});

exports.post_detail_post = asyncHandler(async (req, res, next) => {
  res.send('details of one post');
});

exports.post_detail_get = asyncHandler(async (req, res, next) => {
  res.send('this is a path to leave a comment');
});