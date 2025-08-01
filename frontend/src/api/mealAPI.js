// Base URL for Edamam-related API calls
const BASE_URL = 'http://localhost:5000/api/edamam';

/**
 * @function analyzeMeal
 * @desc Sends a meal input string to the backend for Edamam nutrition analysis
 * @param {string} mealText - Comma-separated list of ingredients (e.g. "2 eggs, 1 toast")
 * @returns {Object} JSON response with nutritional breakdown
 */
export const analyzeMeal = async (mealText) => {
  // Parse and clean ingredients
  const ingredients = mealText
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  const payload = {
    title: 'User Meal',
    ingr: ingredients,
  };

  // Send POST request to backend
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return await res.json();
};

/**
 * @function getLatestMeal
 * @desc Fetches the most recently analyzed meal from Firestore via backend
 * @returns {Object} JSON response of latest meal log
 */
export const getLatestMeal = async () => {
  const res = await fetch(`${BASE_URL}/logs`);
  return await res.json();
};
