const express = require('express');
const { createComment, removeComment, getPostComments } = require('../controllers/commentController');

const router = express.Router();

// Route to create a comment for a specific post
router.post('/comment', createComment);

// Route to remove a comment from a specific post
router.delete('/comment', removeComment);

// Route to get all comments for a specific post
router.get('/post/:postId/comments', getPostComments);

module.exports = router;
