
// Base URL for the backend Edamam API endpoints
const BASE_URL = 'http://localhost:5000/api/edamam';

/**
analyzeMeal
Sends a POST request to analyze a user-entered meal using the Edamam API.
INPUT:
 mealText (string): A comma-separated list of ingredients, e.g., "apple, banana, milk"
  
OUTPUT:
 JSON object containing the analyzed nutritional data for the meal
 */
export const analyzeMeal = async (mealText) => {
  // Split the input string by commas, trim whitespace, and filter out empty strings
  const ingredients = mealText
    .split(',')                // Split by comma
    .map(item => item.trim())  // Remove leading/trailing whitespace from each item
    .filter(item => item.length > 0); // Remove any blank items

  // Format the payload expected by the backend API
  const payload = { title: "User Meal", ingr: ingredients };

  // Send POST request to backend /analyze endpoint
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  // Return the JSON response from the backend
  return await res.json();
};

/**
getLatestMeal
Sends a GET request to fetch the most recent analyzed meal.
INPUT: None
OUTPUT: JSON object containing the latest meal analysis data
 */
export const getLatestMeal = async () => {
  // Send GET request to backend /logs endpoint
  const res = await fetch(`${BASE_URL}/logs`);
  return await res.json();
};
