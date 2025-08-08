// mealAPI.js
const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/edamam`;
/**
 * analyzeMeal
 * Sends user-provided meal text to the backend endpoint for analysis via Edamam API.
 *
 * @param {string} mealText - A comma-separated string of ingredients (e.g., "2 eggs, 1 toast")
 *
 * @returns {Promise<Object>} A JSON object representing the nutrient breakdown from the backend
 * @throws {Error} If the request fails or input is invalid
 */
export const analyzeMeal = async (mealText) => {
  // Split and clean up the ingredient input into an array of strings
  const ingredients = mealText
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);
  const payload = {
    title: 'User Meal',
    ingr: ingredients,
  };
  try {
    /**
     * Send a POST request to the backend /analyze endpoint.
     * If the request fails (e.g., network error), return null to avoid unhandled rejection.
     */
    const res = await fetch(`${BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => null);
    // Handle complete network failure (e.g., no server response)
    if (!res) {
      throw new Error('Network error. Please try again.');
    }
    // Attempt to parse the response body as JSON; fallback to empty object on failure
    const data = await res.json().catch(() => ({}));
    // If the response is not OK (e.g., 400/429/500), throw a controlled error message
    if (!res.ok) {
      throw new Error(data.error || 'An unexpected error occurred.');
    }
    return data;
  } catch (err) {
    // Let the calling component handle the error appropriately (with alert, etc.)
    throw err;
  }
};
/**
 * getLatestMeal
 * Fetches the most recently analyzed meal log from the backend Firestore database.
 *
 * @returns {Promise<Object>} A JSON object representing the most recent meal log
 */
export const getLatestMeal = async () => {
  const res = await fetch(`${BASE_URL}/logs`);
  return await res.json();
};
