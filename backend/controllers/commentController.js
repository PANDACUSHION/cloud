const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a comment for a forum post
const createComment = async (req, res) => {
    const { userId, postId, text } = req.body;

    try {
        // Create the comment
        const comment = await prisma.forumComment.create({
            data: {
                userId,
                postId,
                text,
            },
        });

        return res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong while creating comment.' });
    }
};

// Remove a comment from a forum post
const removeComment = async (req, res) => {
    const { userId, postId, commentId } = req.body;

    try {
        // Find the comment
        const comment = await prisma.forumComment.findUnique({
            where: {
                id: commentId,
            },
        });

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found.' });
        }

        // Check if the comment belongs to the user
        if (comment.userId !== userId) {
            return res.status(403).json({ error: 'You can only delete your own comments.' });
        }

        // Remove the comment
        await prisma.forumComment.delete({
            where: {
                id: commentId,
            },
        });

        return res.status(200).json({ message: 'Comment removed successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong while removing comment.' });
    }
};

// Get all comments for a specific post
const getPostComments = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await prisma.forumComment.findMany({
            where: {
                postId,
            },
            include: {
                user: true, // Include the user who made the comment
            },
        });

        return res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong while fetching comments.' });
    }
};

module.exports = { createComment, removeComment, getPostComments };
