const axios = require('axios');
const { db } = require('../firebase');

/**
 * Controller: analyzeMealController
 * Sends the user's meal data to the Edamam Nutrition API for analysis,
 * then saves the response in Firestore under 'mealLogs/latestMeal'.
 * @param {Object} req - Express request object
 * @param {string} req.body.title - Title of the meal
 * @param {string[]} req.body.ingr - List of ingredient strings
 * @param {Object} res - Express response object
 * @returns {Object} JSON object with nutritional data from Edamam
 */
const analyzeMealController = async (req, res) => {
  try {
    const { title, ingr } = req.body;

    const edamamResponse = await axios.post(
      `https://api.edamam.com/api/nutrition-details?app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`,
      { title, ingr }
    );

    const result = edamamResponse.data;

    const docRef = db.collection('mealLogs').doc('latestMeal');
    await docRef.set({ ...result, timestamp: new Date().toISOString() });

    res.json(result);
  } catch (error) {
    console.error('Error analyzing meal:', error.message);

    // Handle specific Edamam errors
    if (error.response?.status === 429 || error.response?.data?.message?.includes("maximum number of requests")) {
      return res.status(429).json({ error: 'API limit reached, please try again later.' });
    }

    if (error.response?.status === 400 && error.response?.data?.message?.toLowerCase().includes("invalid")) {
      return res.status(400).json({ error: 'Invalid meal input. Please enter a valid meal with correct syntax.' });
    }

    res.status(500).json({ error: 'Invalid meal input. Please enter a valid meal with correct syntax.' });
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
    console.error('Error fetching latest meal:', error.message);
    res.status(500).json({ error: 'Failed to fetch meal.' });
  }
};

module.exports = { analyzeMealController, getLatestMealController };
