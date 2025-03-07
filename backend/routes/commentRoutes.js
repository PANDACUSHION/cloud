const express = require('express');
const { createComment, removeComment, getPostComments } = require('../controllers/commentController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Route to create a comment for a specific post
router.post('/comment',authenticate, createComment);

// Route to remove a comment from a specific post
router.delete('/comment',authenticate, removeComment);

// Route to get all comments for a specific post
router.get('/post/:postId/comments', getPostComments);

module.exports = router;
