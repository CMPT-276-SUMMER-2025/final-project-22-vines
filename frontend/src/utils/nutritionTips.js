/**
 generateNutritionTips: Generates dietary suggestions based on the analyzed nutrient values.
 
 INPUT:
 nutrients (object): Map of nutrient codes to their quantities (e.g. { FAT: 40, PROCNT: 8 })
 
 OUTPUT:
 tips (string[]): An array of human-readable tips or warnings about the meal's nutritional balance
 */
export function generateNutritionTips(nutrients) {
  const tips = [];

  // If no nutrient data is available, return an empty array
  if (!nutrients) return tips;

  // Warn if sugar is too high
  if (nutrients.SUGAR && nutrients.SUGAR > 30) {
    tips.push("⚠️ This meal is high in sugar. Consider reducing sugary drinks or sweets.");
  }

  // Warn if total fat is too high
  if (nutrients.FAT && nutrients.FAT > 35) {
    tips.push("⚠️ High total fat. Choose lean meats or cook with less oil.");
  }

  // Warn if saturated fat is above healthy range
  if (nutrients.FASAT && nutrients.FASAT > 10) {
    tips.push("⚠️ High saturated fat. Try swapping in unsaturated fats like olive oil.");
  }

  // Suggest more fiber if it's too low
  if (nutrients.FIBTG && nutrients.FIBTG < 10) {
    tips.push("💡 Low in fiber. Add fruits, vegetables, or whole grains.");
  }

  // Suggest more protein for low-protein meals
  if (nutrients.PROCNT && nutrients.PROCNT < 10) {
    tips.push("💡 Low protein. Consider adding eggs, legumes, or lean meats.");
  }

  // Warn if sodium exceeds recommended daily limit
  if (nutrients.NA && nutrients.NA > 2300) {
    tips.push("⚠️ High sodium content. Try using less salt or processed sauces.");
  }

  // Suggest more Vitamin C if it's too low
  if (nutrients.VITC && nutrients.VITC < 20) {
    tips.push("💡 Low in Vitamin C. Include citrus fruits or bell peppers.");
  }

  // Suggest increasing Vitamin D for better bone health
  if (nutrients.VITD && nutrients.VITD < 5) {
    tips.push("💡 Low in Vitamin D. Include fortified dairy or spend more time in sunlight.");
  }

  // Suggest adding more iron-rich foods
  if (nutrients.IRON && nutrients.IRON < 8) {
    tips.push("💡 Iron is low. Add spinach, red meat, or iron-rich cereals.");
  }

  // If no warnings or suggestions were triggered, encourage the user
  if (tips.length === 0) {
    tips.push("✅ This meal looks balanced. Great job!");
  }

  return tips;
}
