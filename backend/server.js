const express = require('express');

const cors = require('cors')

const app = express();

app.use(cors());

app.use(express.json());

const PORT = 5000
app.get('/', (req, res) => {
    res.send('Server is running on port 5000');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});