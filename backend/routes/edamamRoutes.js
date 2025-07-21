const express = require('express');
const router = express.Router();

const { analyzeMealController } = require('../controllers/mealController.js');

router.post('/analyze', analyzeMealController);

module.exports = router;

router.get('/logs/:userId', async (req, res) => {
  try {
    const logs = await getMealLogs(req.params.userId);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
