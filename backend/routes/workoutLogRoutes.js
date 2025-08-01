const express = require('express');
const router = express.Router();

const { logWorkout, getWorkoutLogs } = require('../controllers/workoutLogController'); // ✅ Add getWorkoutLogs here

router.post('/', logWorkout);
router.get('/:userEmail', getWorkoutLogs);

module.exports = router;
