

const express = require('express');
const router = express.Router();
const { getAllExercises } = require('../controllers/weeklyPlanController');

router.get('/all-exercises', getAllExercises);

module.exports = router;
