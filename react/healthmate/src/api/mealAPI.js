// const BASE_URL = 'https://final-project-22-vines.onrender.com/api/edamam'; // or localhost for testing
const BASE_URL = "http://localhost:4000/api/edamam";

export const analyzeMeal = async (mealText) => {
  const ingredients = mealText
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  const payload = {
    title: "User Meal",
    ingr: ingredients
  };

  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

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
