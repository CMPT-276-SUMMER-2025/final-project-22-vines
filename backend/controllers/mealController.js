const { saveMealLog, getMealLogs } = require('../utils/firestore');

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

    await saveMealLog('demoUser123', {
      input: recipe,
      output: { nutrition, labels, tips }
    });

    res.json({ nutrition, labels, tips });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  analyzeMealController,
};
