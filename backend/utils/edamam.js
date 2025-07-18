
import axios from 'axios';

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_API_KEY = process.env.EDAMAM_API_KEY;
const BASE_URL = 'https://api.edamam.com/api/nutrition-details';

// 1. Analyze full meal
export async function analyzeMeal(recipe) {
  try {
    const response = await axios.post(
      `${BASE_URL}?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_API_KEY}`,
      recipe,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (err) {
    console.error('Edamam error:', err.response?.data || err.message);
    throw new Error('Failed to analyze meal');
  }
}

// 2. Filter labels (e.g., vegan, keto)
export function filterDietLabels(nutritionData) {
  return nutritionData.dietLabels || [];
}

// 3. Generate tips based on calories/labels
export function getNutritionTips(nutritionData) {
  const tips = [];
  if (nutritionData.calories > 700) {
    tips.push('This meal is high in calories. Consider reducing portion size.');
  }
  if (nutritionData.totalNutrients?.FAT?.quantity > 70) {
    tips.push('Fat content is high. Use less oil or fatty ingredients.');
  }
  if (nutritionData.healthLabels?.includes('LOW_SODIUM')) {
    tips.push('Great job keeping sodium levels low!');
  }
  return tips;
}
