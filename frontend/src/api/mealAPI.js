const BASE_URL = 'http://localhost:5000/api/edamam';

export const analyzeMeal = async (mealText) => {
  const ingredients = mealText
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  const payload = { title: "User Meal", ingr: ingredients };

  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return await res.json();
};

export const getLatestMeal = async () => {
  const res = await fetch(`${BASE_URL}/logs`);
  return await res.json();
};
