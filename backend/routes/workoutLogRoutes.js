const express = require('express');
const router = express.Router();

const { logWorkout, getWorkoutLogs } = require('../controllers/workoutLogController'); //  Add getWorkoutLogs here

router.post('/', logWorkout);
router.get('/:phone', getWorkoutLogs);

module.exports = router;
