const {
  analyzeMeal,
  filterDietLabels,
  getNutritionTips
} = require('../utils/edamam.js');

const analyzeMealController = async (req, res) => {
  try {
    const recipe = req.body;
    const nutrition = await analyzeMeal(recipe);
    const labels = filterDietLabels(nutrition);
    const tips = getNutritionTips(nutrition);
    res.json({ nutrition, labels, tips });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  analyzeMealController,
};
