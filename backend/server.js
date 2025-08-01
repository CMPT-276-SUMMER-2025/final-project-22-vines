// Load environment variables from .env file into process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const edamamRoutes = require('./routes/edamamRoutes');
const wgerRoutes = require('./routes/wgerRoutes');
const workoutLogRoutes = require('./routes/workoutLogRoutes');
const userRoutes = require('./routes/userRoutes');
const weeklyPlanRoutes = require('./routes/weeklyPlanRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing to allow requests from frontend
app.use(cors());

// Enable parsing of JSON request bodies
app.use(express.json());

// Mount API routes
app.use('/api/users', userRoutes);
app.use('/api/edamam', edamamRoutes);
app.use('/api/wger', wgerRoutes);
app.use('/api/workoutLogs', workoutLogRoutes);
app.use('/api/workouts', workoutLogRoutes); 
app.use('/api/weekly-plan', weeklyPlanRoutes); 
// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
