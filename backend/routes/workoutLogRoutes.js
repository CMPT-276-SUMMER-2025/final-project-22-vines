const express = require('express');
const router = express.Router();
const { saveWorkoutLog } = require('../controllers/workoutLogController');

// POST: Save a workout log
router.post('/', saveWorkoutLog);

module.exports = router;
