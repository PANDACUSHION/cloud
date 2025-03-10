const express = require('express');
const cors = require('cors');
const { join } = require('path'); // Import the join function from the path module

// Import route files
const userRoutes = require('./routes/userRoutes');
const forumPostRoutes = require('./routes/forumRoutes');
const moodRoutes = require('./routes/moodRoutes');
const likeRoutes = require('./routes/likesRoutes');
const commentRoutes = require('./routes/commentRoutes');
// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.send('Server is running on port 5000');
});

// Use Routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/forum', forumPostRoutes); // Forum post routes
app.use('/api/moods', moodRoutes); // Mood routes
app.use('/api/likes', likeRoutes); // Like routes
app.use('/api/comments', commentRoutes);
// File download route
app.get('/api/download/uploads/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = join(__dirname, 'uploads', filename);

    // Send file for download
    res.download(filePath, filename, (err) => {
        if (err) {
            console.error("File download error:", err);
            res.status(500).send('Error downloading file');
        }
    });
});

// Error handling for unknown routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling for unexpected server errors
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});