const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const {sign, decode} = require("jsonwebtoken");
const {compare} = require("bcrypt");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let password_hash = bcrypt.hashSync(password, 12);
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Create a new user
        const user = await prisma.user.create({
            data: { name, email, password_hash, role },
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user', details: error.message });
    }
};

// Get Users
const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
};

// Get User by ID
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user', details: error.message });
    }
};

// Update User
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password_hash, role } = req.body;

    try {
        // Check if user is allowed to update this user (admin or the user themselves)
        if (req.user.role !== 'admin' && req.user.id !== id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { name, email, password_hash, role }
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user', details: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if user is allowed to delete (admin only)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        await prisma.user.delete({ where: { id } });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user', details: error.message });
    }
};

// Get User Moods
const getUserMoods = async (req, res) => {
    const { userId } = req.params;

    try {
        // Check if user has access to their data (or admin can access any user data)
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        const moods = await prisma.mood.findMany({ where: { userId } });
        res.status(200).json(moods);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch moods for user', details: error.message });
    }
};

//validateUser
const validateUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email exists
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password with hashed password
        const isMatch = await compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = sign(
            { id: user.id, role: user.role, email: user.email, username: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log(decode(token));
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to validate user', details: error.message });
    }
};
// Get User Posts
const getUserPosts = async (req, res) => {
    const { userId } = req.params;

    try {
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        const posts = await prisma.forumPost.findMany({ where: { userId } });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts for user', details: error.message });
    }
};

// Get User Appointments
const getUserAppointments = async (req, res) => {
    const { userId } = req.params;

    try {
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        const appointments = await prisma.appointment.findMany({ where: { userId } });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments for user', details: error.message });
    }
};

// Get User Likes
const getUserLikes = async (req, res) => {
    const { userId } = req.params;

    try {
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        const likes = await prisma.forumLike.findMany({ where: { userId } });
        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch likes for user', details: error.message });
    }
};

// Get User Comments
const getUserComments = async (req, res) => {
    const { userId } = req.params;

    try {
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied" });
        }

        const comments = await prisma.forumComment.findMany({ where: { userId } });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments for user', details: error.message });
    }
};

module.exports = {
    authenticate,
    authorizeAdmin,
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserLikes,
    getUserPosts,
    getUserAppointments,
    getUserComments,
    getUserMoods,
    validateUser
};
