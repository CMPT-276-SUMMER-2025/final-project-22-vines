const express = require('express');
const router = express.Router();

const { analyzeMealController } = require('../controllers/mealController.js');

router.post('/analyze', analyzeMealController);

router.get('/logs', async (req, res) => {
  try {
    const logs = await getMealLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;