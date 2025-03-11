const express = require('express');
const { createMood, getUserMoods, getAllMoods} = require('../controllers/moodController');
const { authenticate , authorizeAdmin} = require('../middlewares/auth'); // Import authentication middleware

const router = express.Router();

// Route to create a mood for a user
router.post('/mood', authenticate, createMood);

// Route to get all moods for a specific user
router.get('/user/:userId/moods', authenticate, getUserMoods);

router.get('/user/moods', authenticate,authorizeAdmin, getUserMoods);

module.exports = router;
