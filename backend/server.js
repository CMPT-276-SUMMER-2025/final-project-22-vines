// Load environment variables from .env file into process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Import route modules
const edamamRoutes = require('./routes/edamamRoutes');
const wgerRoutes = require('./routes/wgerRoutes');
const workoutLogRoutes = require('./routes/workoutLogRoutes');
const userRoutes = require('./routes/userRoutes');
const weeklyPlanRoutes = require('./routes/weeklyPlanRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS to allow requests from frontend
app.use(cors());

// Enable parsing of incoming JSON payloads
app.use(express.json());

// Mount all API routes under appropriate base paths
app.use('/api/users', userRoutes);
app.use('/api/edamam', edamamRoutes);
app.use('/api/wger', wgerRoutes);
app.use('/api/workoutLogs', workoutLogRoutes);
app.use('/api/workouts', workoutLogRoutes); // Optional alias route
app.use('/api/weeklyplan', weeklyPlanRoutes);
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
