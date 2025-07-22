const BASE_URL = 'https://final-project-22-vines.onrender.com'; // Update after deployment

export const analyzeMeal = async (mealText) => {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meal: mealText }) // removed userId
  });
  return await res.json();
};

export const getMealLogs = async () => {
  const res = await fetch(`${BASE_URL}/logs`); // removed /:userId
  return await res.json();
};

export const checkMealCompatibility = async (mealData) => {
  const res = await fetch(`${BASE_URL}/check-compatibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mealData })
  });
  return await res.json();
};

export const getNutritionTips = async (mealData) => {
  const res = await fetch(`${BASE_URL}/nutrition-tips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mealData })
  });
  return await res.json();
};
