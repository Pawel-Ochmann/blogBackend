var express = require('express');
var router = express.Router();
const appController = require('../controllers/appController');
const adminController = require('../controllers/adminController');
const passport = require('passport');
const protected = passport.authenticate('jwt', { session: false });

router.get('/admin/sign_in', adminController.sign_in_get);
router.post('/admin/sign_in', adminController.sign_in_post);
router.post(
  '/admin/comments/:postId',
  protected,
  adminController.comment_post
);
router.put(
  '/admin/comments/:commentId',
  protected,
  adminController.comment_put
);
router.delete(
  '/admin/comments/:commentId',
  protected,
  adminController.comment_delete
);
router.get('/admin/posts/new', protected, adminController.post_new_get);
router.post('/admin/posts/new', protected, adminController.post_new_post);
router.get('/admin/posts/:id', protected, adminController.post_detail_get);
router.post('/admin/posts/:id', protected, adminController.post_detail_post);
router.delete(
  '/admin/posts/:id',
  protected,
  adminController.post_detail_delete
);
router.get('/admin', protected, adminController.main_get);

router.get('/:postId', appController.post_detail_get);
router.post('/:postId', appController.post_detail_post);
router.get('/', appController.main_get);

module.exports = router;
