const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a Mood for a User
const createMood = async (req, res) => {
    const { moodScore, notes, userId } = req.body;

    try {
        // Ensure the user has access to create a mood (admin or the user themselves)
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        const mood = await prisma.mood.create({
            data: {
                moodScore,
                notes,
                userId, // Ensure the userId belongs to the authenticated user
            }
        });

        res.status(201).json(mood);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create mood', details: error.message });
    }
};

// Get all Moods for a specific User
const getUserMoods = async (req, res) => {
    const { userId } = req.params;
    try {
        // Check if the user has access to view moods (either admin or the user themselves)
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        const moods = await prisma.mood.findMany({
            where: { userId }
        });
        console.log(moods);
        if (moods.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(moods);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch moods for user', details: error.message });
    }
};

const getAllMoods = async (req, res) => {
    try {
        // Check if the user has access to view all moods (admin only)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        // Fetch all moods with the associated user name
        const moods = await prisma.mood.findMany({
            include: {
                user: {
                    select: {
                        name: true, // Include the name field from the User model
                    },
                },
            },
        });

        if (moods.length === 0) {
            return res.status(200).json([]); // Return an empty array if no moods are found
        }

        // Return the moods along with user names
        res.status(200).json(moods);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch all moods', details: error.message });
    }
};

module.exports = { createMood, getUserMoods ,getAllMoods };
