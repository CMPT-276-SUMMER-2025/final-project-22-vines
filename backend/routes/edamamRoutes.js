const express = require('express');
const router = express.Router();

// Import controller functions for handling Edamam meal analysis
const {
  analyzeMealController,
  getLatestMealController,
} = require('../controllers/mealController');

/**
 * @route POST /analyze
 * @description Analyze a user-submitted meal using the Edamam Nutrition Analysis API.
 * @body {string} title - Title of the meal
 * @body {string[]} ingr - List of ingredient strings
 * @returns {Object} JSON object with nutritional analysis
 */
router.post('/analyze', analyzeMealController);

/**
 * @route GET /logs
 * @description Retrieve the latest analyzed meal log from Firestore.
 * @returns {Object} JSON object of the latest meal log
 */
router.get('/logs', getLatestMealController);

// Export the router to be used in the main Express app
module.exports = router;
