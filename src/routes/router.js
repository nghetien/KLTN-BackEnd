const express = require('express');

const router = express.Router();

router.use('/auth', require('./auth.route'));
router.use('/user', require('./user.route'));
router.use('/post', require('./post.route'));
router.use('/tag', require('./tag.route'));
router.use('/comment', require('./comment.route'));
router.use('/bookmark', require('./bookmark.route'));
router.use('/like', require('./like.route'));
router.use('/follow', require('./follow.route'));
router.use('/problem', require('./problem.route'));
router.use('/message', require('./message.route'));
router.use('/conversation', require('./conversation.route'));
router.use('/notification', require('./notification.route'));
router.use('/notification-message', require('./notification_message.route'));
router.use('/search', require('./search.route'));
router.use('/upload', require('./upload.route'));
router.use('/ai-search', require('./ai_search.route'))

module.exports = router;
