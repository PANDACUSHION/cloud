const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');


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
        const posts = await prisma.forumPost.findMany({
            orderBy: {
                timestamp: "desc", // Sorts posts by newest first
            },
        });
        res.status(200).json(posts);
        console.log(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch forum posts', details: error.message });
    }
};

const getResources = async (req, res) => {
    try {
        const resources = await prisma.forumPost.findMany({
            where: {
                category: {
                    not: 'TEXT' // Filter directly in the database query
                }
            }
        });
        res.status(200).json(resources);
        console.log(resources);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch resources', details: error.message });
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
// Delete a forum post by ID
const deleteForumPost = async (req, res) => {
    const { postId } = req.params;
    console.log(postId);
    try {
        const post = await prisma.forumPost.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Delete the post from the database
        await prisma.forumPost.delete({
            where: { id: postId },
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to delete resource', details: error.message });
    }
};


// Download a resource by post ID
const downloadResource = async (req, res) => {
    const { postId } = req.params;

    try {
        // Find the post with the given ID
        const post = await prisma.forumPost.findUnique({
            where: { id: postId },
        });

        // If no post exists or it doesn't have a file
        if (!post) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        if (!post.fileDest) {
            return res.status(400).json({ error: 'No file associated with this resource' });
        }

        // Get the file path
        const filePath = post.fileDest;

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found on server' });
        }

        // Get filename from path
        const fileName = path.basename(filePath);

        // Set appropriate headers based on file type
        if (post.category === 'IMAGE') {
            // For images, you might want to display them in browser
            const contentType = getContentTypeFromFilename(fileName);
            res.setHeader('Content-Type', contentType);
        } else {
            // For other files like ZIP, set download headers
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        }

        // Stream the file to response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

    } catch (error) {
        res.status(500).json({
            error: 'Failed to download resource',
            details: error.message
        });
    }
};

// Helper function to determine content type from filename
function getContentTypeFromFilename(filename) {
    const ext = path.extname(filename).toLowerCase();

    const contentTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.zip': 'application/zip',
        '.pdf': 'application/pdf',
        // Add more as needed
    };

    return contentTypes[ext] || 'application/octet-stream'; // Default to binary stream
}


module.exports = {
    createForumPost,
    getForumPosts,
    getForumPostById,
    getResources,
    deleteForumPost,
    downloadResource
};
