const express = require('express');
const router = express.Router();

const {
  searchExercises,
  getExerciseCategories,
  getMuscles,
  getEquipment,
} = require('../controllers/wgerController');

/**
 * @route GET /api/wger/exercises
 * @desc Search for exercises based on optional filters: category, equipment, muscles
 * @query {string} category
 * @query {string} equipment
 * @query {string} muscles
 * @returns {Array} List of enriched exercise objects
 */
router.get('/exercises', searchExercises);

/**
 * @route GET /api/wger/categories
 * @desc Retrieve all exercise categories from Wger
 * @returns {Array} List of category objects
 */
router.get('/categories', getExerciseCategories);

/**
 * @route GET /api/wger/muscles
 * @desc Retrieve all muscle groups from Wger
 * @returns {Array} List of muscle objects
 */
router.get('/muscles', getMuscles);

/**
 * @route GET /api/wger/equipment
 * @desc Retrieve all exercise equipment types from Wger
 * @returns {Array} List of equipment objects
 */
router.get('/equipment', getEquipment);

// Export the router for use in the main app
module.exports = router;
