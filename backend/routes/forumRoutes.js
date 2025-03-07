const express = require('express');
const { createForumPost, getForumPosts, getForumPostById } = require('../controllers/forumController');
const { authenticate } = require('../middlewares/auth');
const upload = require('../middlewares/multer'); // Multer middleware for file uploads

const router = express.Router();

// Route to create a new forum post (requires authentication and file upload for IMAGE/ZIP categories)
router.post('/forum/post', authenticate, upload.single('file'), createForumPost);

// Route to get all forum posts (no authentication required)
router.get('/forum/posts', getForumPosts);

// Route to get a specific forum post by ID (no authentication required)
router.get('/forum/post/:postId', getForumPostById);

module.exports = router;
