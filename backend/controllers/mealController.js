const axios = require('axios');
const { db } = require('../firebase');

/**
 * Controller: analyzeMealController
 * Description: Analyzes a user-submitted meal using the Edamam Nutrition API
 *              and saves the result in Firestore under 'mealLogs/latestMeal'.
 *
 * Input:
 *  - req.body.title: (string) Name or description of the meal
 *  - req.body.ingr: (string[]) Array of ingredient strings
 *
 * Output:
 *  - 200 OK with Edamam API response JSON
 *  - 400 Bad Request for invalid input
 *  - 429 Too Many Requests if API limit is exceeded
 *  - 500 Internal Server Error for unexpected issues
 */
const analyzeMealController = async (req, res) => {
  try {
    const { title, ingr } = req.body;

    // Call the Edamam Nutrition API with meal details
    const edamamResponse = await axios.post(
      `https://api.edamam.com/api/nutrition-details?app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`,
      { title, ingr }
    );

    const result = edamamResponse.data;

    // Save the result to Firestore under a fixed document 'latestMeal'
    const docRef = db.collection('mealLogs').doc('latestMeal');
    await docRef.set({ ...result, timestamp: new Date().toISOString() });

    return res.json(result);
  } catch (error) {
    const status = error?.response?.status;
    const msg = error?.response?.data?.message?.toLowerCase() || '';

    // Handle known API limit exceeded case
    if (status === 429 || msg.includes("maximum number of requests")) {
      return res.status(429).json({ error: 'API limit reached, please try again later.' });
    }

    // Handle invalid meal input (bad format or gibberish)
    if (
      (status === 400 && msg.includes("invalid")) ||
      status === 555 ||
      msg.includes("cannot be interpreted")
    ) {
      return res.status(400).json({ error: 'Invalid meal input. Please enter a valid meal with correct syntax.' });
    }

    // Handle unknown/unexpected error
    console.error('Unexpected error analyzing meal:', error.message);
    return res.status(500).json({ error: 'Something went wrong while analyzing your meal. Please try again.' });
  }
};

/**
 * Controller: getLatestMealController
 * Description: Retrieves the most recent analyzed meal from Firestore.
 *
 * Input:
 *  - None (GET request)
 *
 * Output:
 *  - 200 OK with the most recent meal log
 *  - 404 Not Found if no meal exists
 *  - 500 Internal Server Error for unexpected issues
 */
const getLatestMealController = async (req, res) => {
  try {
    const docRef = db.collection('mealLogs').doc('latestMeal');
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'No meal log found.' });
    }

    return res.json(doc.data());
  } catch (error) {
    console.error('Error fetching latest meal:', error.message);
    return res.status(500).json({ error: 'Failed to fetch meal.' });
  }
};

module.exports = {
  analyzeMealController,
  getLatestMealController
};
