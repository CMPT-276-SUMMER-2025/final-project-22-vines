const BASE_URL = 'https://final-project-22-vines.onrender.com/api/edamam'; // or localhost for testing

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
