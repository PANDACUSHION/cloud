const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create or remove a like for a forum post (toggle behavior)
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

        // If like already exists, remove it
        if (existingLike) {
            await prisma.forumLike.delete({
                where: {
                    id: existingLike.id,
                },
            });

            return res.status(200).json({ message: 'Like removed successfully.' });
        }

        // If like does not exist, create the like
        const like = await prisma.forumLike.create({
            data: {
                userId,
                postId,
            },
        });

        return res.status(201).json(like);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong while processing like.' });
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
const getLikedPostsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch all posts where the user has liked
        const likedPosts = await prisma.forumLike.findMany({
            where: {
                userId, // Filter by userId
            },
            include: {
                post: true, // Include the post details
            },
        });

        // Extract only the post data from the likes
        const posts = likedPosts.map(like => like.post);

        return res.status(200).json(posts); // Return the posts liked by the user
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong while fetching liked posts.' });
    }
};


module.exports = { createLike, getPostLikes ,getLikedPostsByUser};
