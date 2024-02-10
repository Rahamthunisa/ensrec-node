const express = require('express');
const dotenv = require('dotenv');
const getTextRecordHashRouter = require('./api/getTextRecordHash');

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Middleware for parsing JSON bodies

// Define routes
app.use('/api', getTextRecordHashRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
