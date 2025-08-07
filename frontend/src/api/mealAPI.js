// Base URL for Edamam-related API calls
const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/edamam`;

/**
 * @function analyzeMeal
 * @desc Sends a meal input string to the backend for Edamam nutrition analysis
 * @param {string} mealText - Comma-separated list of ingredients (e.g. "2 eggs, 1 toast")
 * @returns {Object} JSON response with nutritional breakdown
 */
export const analyzeMeal = async (mealText) => {
  const ingredients = mealText
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  const payload = {
    title: 'User Meal',
    ingr: ingredients,
  };

  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Unknown error from API');
  return data;
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
