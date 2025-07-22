const BASE_URL = 'https://final-project-22-vines.onrender.com'; // Update after deployment

export const analyzeMeal = async (mealText, userId) => {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meal: mealText, userId })
  });
  return await res.json();
};

export const getMealLogs = async (userId) => {
  const res = await fetch(`${BASE_URL}/logs/${userId}`);
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
