import express from 'express';
import { analyzeMeal, filterDietLabels, getNutritionTips } from '../utils/edamam.js';

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const recipe = req.body;
    const nutrition = await analyzeMeal(recipe);
    const labels = filterDietLabels(nutrition);
    const tips = getNutritionTips(nutrition);
    res.json({ nutrition, labels, tips });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
