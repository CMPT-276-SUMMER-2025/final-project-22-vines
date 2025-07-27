
// Load environment variables from .env file into process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const edamamRoutes = require('./routes/edamamRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing to allow requests from frontend
app.use(cors());

// Enable parsing of JSON request bodies
app.use(express.json());

// Mount Edamam-related API routes at /api/edamam
app.use('/api/edamam', edamamRoutes);

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
