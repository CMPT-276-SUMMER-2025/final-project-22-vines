const axios = require('axios');

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_API_KEY = process.env.EDAMAM_API_KEY;
const BASE_URL = 'https://api.edamam.com/api/nutrition-details';

// 1. Analyze full meal
async function analyzeMeal(recipe) {
  try {
    const response = await axios.post(
      `${BASE_URL}?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_API_KEY}`,
      recipe,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (err) {
    console.error('Edamam API Error:', err.response?.data || err.message);
    throw new Error(err.response?.data?.message || 'Failed to analyze meal');
  }
}

// 2. Filter labels (e.g., vegan, keto)
function filterDietLabels(nutritionData) {
  return nutritionData.dietLabels || [];
}

// 3. Generate tips based on calories/labels
function getNutritionTips(nutritionData) {
  const tips = [];

  const calories = nutritionData.calories;
  const fat = nutritionData.totalNutrients?.FAT?.quantity || 0;
  const sugar = nutritionData.totalNutrients?.SUGAR?.quantity || 0;
  const sodium = nutritionData.totalNutrients?.NA?.quantity || 0;
  const fiber = nutritionData.totalNutrients?.FIBTG?.quantity || 0;
  const protein = nutritionData.totalNutrients?.PROCNT?.quantity || 0;
  const healthLabels = nutritionData.healthLabels || [];

  // Calorie tips
  if (calories > 700) {
    tips.push('This meal is high in calories. Consider reducing portion size.');
  } else if (calories < 300) {
    tips.push('This meal is low in calories. Consider adding a source of protein or healthy fats.');
  }

  // Fat content
  if (fat > 70) {
    tips.push('Fat content is high. Consider reducing oil, butter, or fatty meats.');
  }

  // Sugar warning
  if (sugar > 25) {
    tips.push('Sugar content is high. Try cutting back on sugary sauces or sweeteners.');
  }

  // Sodium warning
  if (sodium > 2300) {
    tips.push('Sodium level is very high. Watch out for processed or salty foods.');
  }

  // Fiber encouragement
  if (fiber < 10) {
    tips.push('Fiber is low. Add whole grains, beans, or veggies for better digestion.');
  }

  // Protein praise
  if (protein > 20) {
    tips.push('Great source of protein!');
  }

  // Health labels praise
  if (healthLabels.includes('LOW_SODIUM')) {
    tips.push('Nice work keeping sodium levels low!');
  }
  if (healthLabels.includes('HIGH_FIBER')) {
    tips.push('Excellent fiber content in this meal!');
  }

  return tips;
}


//Export functions for use in controller
module.exports = {
  analyzeMeal,
  filterDietLabels,
  getNutritionTips
};
