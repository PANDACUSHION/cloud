const express = require('express');
const { createLike, removeLike, getPostLikes } = require('../controllers/likesController');
const { authenticate } = require('../middlewares/auth'); // Import authentication middleware

const router = express.Router();

// Route to create a like for a forum post
router.post('/like', authenticate, createLike);

// Route to remove a like for a forum post
router.delete('/like', authenticate, removeLike);

// Route to get all likes for a specific forum post
router.get('/post/:postId/likes', getPostLikes);

module.exports = router;
