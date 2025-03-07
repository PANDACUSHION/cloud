const express = require('express');
const { createMood, getUserMoods } = require('../controllers/moodController');
const { authenticate } = require('../middlewares/auth'); // Import authentication middleware

const router = express.Router();

// Route to create a mood for a user
router.post('/mood', authenticate, createMood);

// Route to get all moods for a specific user
router.get('/user/:userId/moods', authenticate, getUserMoods);

module.exports = router;
