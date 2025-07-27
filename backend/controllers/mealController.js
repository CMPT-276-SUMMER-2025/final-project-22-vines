const axios = require('axios');
const db = require('../firebase');

/**
 * analyzeMealController
 * ---------------------
 * Analyzes a meal using the Edamam Nutrition Analysis API.
 * 
 * INPUT:
 * - req.body.title (string): The title of the meal
 * - req.body.ingr (string[]): Array of ingredients
 * 
 * OUTPUT:
 * - JSON response with full nutrition analysis result from Edamam
 * - Saves the result to Firestore under the 'latestMeal' document
 */
const analyzeMealController = async (req, res) => {
  try {
    const { title, ingr } = req.body;

    // Send a POST request to Edamam Nutrition Analysis API with meal title and ingredients
    const edamamResponse = await axios.post(
      `https://api.edamam.com/api/nutrition-details?app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`,
      { title, ingr }
    );

    const result = edamamResponse.data;

    // Save the API response to Firestore with a timestamp
    const docRef = db.collection('mealLogs').doc('latestMeal');
    await docRef.set({ ...result, timestamp: new Date().toISOString() });

    // Return the analysis result to the client
    res.json(result);
  } catch (error) {
    console.error(error);
    // Handle and return a server error response if the request or save fails
    res.status(500).json({ error: 'Failed to analyze and save meal.' });
  }
};

/**
 * getLatestMealController
 * -----------------------
 * Retrieves the most recently analyzed meal from Firestore.
 * 
 * INPUT:
 * - None (uses the 'latestMeal' doc in Firestore)
 * 
 * OUTPUT:
 * - JSON object containing the latest meal analysis data
 */
const getLatestMealController = async (req, res) => {
  try {
    const docRef = db.collection('mealLogs').doc('latestMeal');
    const doc = await docRef.get();

    // If the document doesn't exist, return a 404 error
    if (!doc.exists) {
      return res.status(404).json({ error: 'No meal log found.' });
    }

    // Return the latest meal log data
    res.json(doc.data());
  } catch (error) {
    console.error(error);
    // Handle and return a server error response if fetching fails
    res.status(500).json({ error: 'Failed to fetch meal.' });
  }
};

// Export controller functions for use in routes
module.exports = { analyzeMealController, getLatestMealController };
