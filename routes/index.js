var express = require('express');
var router = express.Router();
const appController = require('../controllers/appController');
const adminController = require('../controllers/adminController');

/* GET home page. */

const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');

router.get('/admin/sign_in', adminController.sign_in_get);
router.post('/admin/sign_in', adminController.sign_in_post);
router.post('/admin/comments/:comment_id', adminController.comment_post);
router.delete('/admin/comments/:comment_id', adminController.comment_delete);
router.get('/admin/posts/new', adminController.post_new_get);
router.post('/admin/posts/new', adminController.post_new_post);
router.get('/admin/posts/:id', adminController.post_detail_get);
router.post('/admin/posts/:id', adminController.post_detail_post);
router.delete('/admin/posts/:id', adminController.post_detail_delete);
router.get('/admin', adminController.main_get);

router.get('/:id', apiKeyMiddleware,  appController.post_detail_get);
router.post('/:id', apiKeyMiddleware, appController.post_detail_post);
router.get('/', apiKeyMiddleware, appController.main_get);

module.exports = router;
