const Admin = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

const bcrypt = require('bcryptjs');
const passport = require('../passport-config');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.main_get = asyncHandler(async (req, res, next) => {
  const postsPublished = await Post.find({published:true});
  
    const postsWithComments = await Promise.all(
      postsPublished.map(async (postPublished) => {
        const comments = await Comment.find({ post: postPublished._id });
        return { ...postPublished.toObject(), comments };
      })
    );
    res.json(postsWithComments);

});

exports.post_detail_get = asyncHandler(async (req, res, next) => {
  const [post, comments] = await Promise.all([Post.findById(req.params.postId), Comment.find({post:req.params.postId})]);
  console.log({post, comments})
  res.json(post);
});

exports.post_detail_post = asyncHandler(async (req, res, next) => {
  res.send('this is a path to leave a comment');
});