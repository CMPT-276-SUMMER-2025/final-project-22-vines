const express = require('express');
const router = express.Router();
const {
  searchExercises,
  getExerciseCategories,
  getMuscles,
  getEquipment,
} = require('../controllers/wgerController');

// Route to search exercises
router.get('/exercises', searchExercises);

// Optional helper routes
router.get('/categories', getExerciseCategories);
router.get('/muscles', getMuscles);
router.get('/equipment', getEquipment);

module.exports = router;
