const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const upload = require('../middlewares/multer'); // Import multer middleware
// Create a ForumPost
const createForumPost = async (req, res) => {
    const { title, category, text, userId } = req.body;

    try {

        let fileDest = null;

        // If category is 'IMAGE' or 'ZIP', handle file upload
        if (category === 'IMAGE' || category === 'ZIP') {
            // Multer file handling for IMAGE and ZIP types
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            fileDest = req.file.path; // Store file path in database (or you can store filename as needed)
        }

        // Create the forum post with the file (if any)
        const post = await prisma.forumPost.create({
            data: {
                title,
                category,
                text,
                fileDest, // Store file destination (path) for IMAGE or ZIP
                userId,
            }
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create forum post', details: error.message });
    }
};

// Get all Forum Posts
const getForumPosts = async (req, res) => {
    console.log("am here");
    try {
        const posts = await prisma.forumPost.findMany();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch forum posts', details: error.message });
    }
};

// Get Forum Post by ID
const getForumPostById = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await prisma.forumPost.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return res.status(404).json({ error: 'Forum post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch forum post', details: error.message });
    }
};

module.exports = {
    createForumPost,
    getForumPosts,
    getForumPostById
};
