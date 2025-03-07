const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a like for a forum post
const createLike = async (req, res) => {
    const { userId, postId } = req.body;

    try {
        // Check if the like already exists
        const existingLike = await prisma.forumLike.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });

        if (existingLike) {
            return res.status(400).json({ error: 'User has already liked this post.' });
        }

        // Create the like
        const like = await prisma.forumLike.create({
            data: {
                userId,
                postId,
            },
        });

        return res.status(201).json(like);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong while creating like.' });
    }
};

// Remove a like for a forum post
const removeLike = async (req, res) => {
    const { userId, postId } = req.body;

    try {
        // Find the like
        const like = await prisma.forumLike.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });

        if (!like) {
            return res.status(404).json({ error: 'Like not found.' });
        }

        // Remove the like
        await prisma.forumLike.delete({
            where: {
                id: like.id,
            },
        });

        return res.status(200).json({ message: 'Like removed successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong while removing like.' });
    }
};

// Get all likes for a specific post
const getPostLikes = async (req, res) => {
    const { postId } = req.params;

    try {
        const likes = await prisma.forumLike.findMany({
            where: {
                postId,
            },
            include: {
                user: true, // Include the user who liked the post
            },
        });

        return res.status(200).json(likes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong while fetching likes.' });
    }
};

module.exports = { createLike, removeLike, getPostLikes };
