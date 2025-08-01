const axios = require('axios');
const db = require('../firebase');

const analyzeMealController = async (req, res) => {
  try {
    const { title, ingr } = req.body;

    const edamamResponse = await axios.post(
      `https://api.edamam.com/api/nutrition-details?app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`,
      { title, ingr }
    );

    const result = edamamResponse.data;
    console.log("Edamam ingredients:", result.ingredients);  // Debug log

    const docRef = db.collection('mealLogs').doc('latestMeal');
    await docRef.set({ ...result, timestamp: new Date().toISOString() });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to analyze and save meal.' });
  }
};

const getLatestMealController = async (req, res) => {
  try {
    const docRef = db.collection('mealLogs').doc('latestMeal');
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'No meal log found.' });
    }

    res.json(doc.data());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch meal.' });
  }
};

module.exports = { analyzeMealController, getLatestMealController };
