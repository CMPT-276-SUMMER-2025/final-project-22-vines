const express = require('express');
const router = express.Router();

const { getAllExercises } = require('../controllers/weeklyPlanController');

/**
 * @route GET /api/weeklyplan/exercises
 * @desc Retrieves enriched exercises across all categories from Wger API
 * @returns {Array} List of enriched exercise objects with description and/or image
 */
router.get('/exercises', getAllExercises);

// Export the router for use in the main app
module.exports = router;
