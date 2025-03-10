const express = require('express');
const { createLike,  getPostLikes,getLikedPostsByUser } = require('../controllers/likesController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Route to create a like for a forum post
router.post('/like', authenticate, createLike);
// Route to get all likes for a specific forum post
router.get('/post/:postId/likes', getPostLikes);
router.get('/user/:userId/likes', getLikedPostsByUser);
module.exports = router;
