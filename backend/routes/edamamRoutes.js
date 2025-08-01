
const express = require('express');
const router = express.Router();

// Import controller functions for handling Edamam meal analysis
const {
  analyzeMealController,
  getLatestMealController,
} = require('../controllers/mealController');

/**
 POST /analyze
 Route to analyze a user-submitted meal.
 Expects a JSON body with 'title' (string) and 'ingr' (array of strings).
 Calls analyzeMealController to process the input using Edamam API.
 */
router.post('/analyze', analyzeMealController);

/**
GET /logs
Route to fetch the latest analyzed meal log from Firestore.
Calls getLatestMealController to return the most recent entry.
 */
router.get('/logs', getLatestMealController);

// Export the router to be used in the main Express app
module.exports = router;