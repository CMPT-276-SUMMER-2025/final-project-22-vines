const express = require('express');
const router = express.Router();

const { logWorkout, getWorkoutLogs } = require('../controllers/workoutLogController');

/**
 * @route POST /api/workoutLogs
 * @desc Log a new workout for a user
 * @body {string} phone - User's phone number
 * @body {string} exerciseName - Name of the exercise
 * @body {number} sets - Number of sets
 * @body {number} reps - Number of reps
 * @body {number} weight - Weight used
 * @returns {Object} Success message
 */
router.post('/', logWorkout);

/**
 * @route GET /api/workoutLogs/:phone
 * @desc Retrieve all workout logs for a specific user by phone number
 * @param {string} phone - Phone number used to filter logs
 * @returns {Array} List of workout log entries
 */
router.get('/:phone', getWorkoutLogs);

// Export the router for use in the main app
module.exports = router;
