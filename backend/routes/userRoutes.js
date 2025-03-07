const express = require('express');
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserMoods,
    validateUser,
    getUserPosts,
    getUserAppointments,
    getUserLikes,
    getUserComments
} = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');

const router = express.Router();

// Route to create a user (admin only)
router.post('/user', authenticate, authorizeAdmin, createUser);

// Route to get all users (admin only)
router.get('/users', authenticate, authorizeAdmin, getUsers);

// Route to get a user by ID (authenticated user or admin)
router.get('/user/:id', authenticate, getUserById);

// Route to update a user (user themselves or admin)
router.put('/user/:id', authenticate, updateUser);

// Route to delete a user (admin only)
router.delete('/user/:id', authenticate, authorizeAdmin, deleteUser);

// Route to validate user (for login)
router.post('/validate', validateUser);

// Route to get a user's moods (authenticated user or admin)
router.get('/user/:userId/moods', authenticate, getUserMoods);

// Route to get a user's posts (authenticated user or admin)
router.get('/user/:userId/posts', authenticate, getUserPosts);

// Route to get a user's appointments (authenticated user or admin)
router.get('/user/:userId/appointments', authenticate, getUserAppointments);

// Route to get a user's likes (authenticated user or admin)
router.get('/user/:userId/likes', authenticate, getUserLikes);

// Route to get a user's comments (authenticated user or admin)
router.get('/user/:userId/comments', authenticate, getUserComments);

module.exports = router;
