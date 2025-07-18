const express = require('express');
const router = express.Router();

const { analyzeMealController } = require('../controllers/mealController.js');

router.post('/analyze', analyzeMealController);

module.exports = router;
