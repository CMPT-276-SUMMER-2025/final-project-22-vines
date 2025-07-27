
// List of supported diet labels used in the dropdown for compatibility check
export const DIET_LABELS = [
  'Low-Carb',
  'Low-Fat',
  'Low-Sodium',
  'High-Protein',
  'High-Fiber',
  'Low-Sugar',
  'Low-Cholesterol',
  'Low-Saturated-Fat',
  'Low-Calorie'
];

/**
 checkDietCompatibility: Determines whether a meal meets the nutritional requirements for a selected diet label.
 
 INPUT:
 label (string): The selected diet label (e.g. "Low-Carb", "High-Protein")
 nutrients (object): A map of nutrient codes (e.g., 'FAT', 'PROCNT') to their aggregated values

 OUTPUT:
 boolean: true if the meal meets the label's requirement, false otherwise
 */
export function checkDietCompatibility(label, nutrients) {
  switch (label) {
    case 'Low-Carb':
      // Meal must have 50g or less of total carbohydrates
      return (nutrients['CHOCDF'] || 0) <= 50;

    case 'Low-Fat':
      // Meal must have 30g or less of total fat
      return (nutrients['FAT'] || 0) <= 30;

    case 'Low-Sodium':
      // Meal must have 1500mg or less of sodium
      return (nutrients['NA'] || 0) <= 1500;

    case 'High-Protein':
      // Meal must have at least 25g of protein
      return (nutrients['PROCNT'] || 0) >= 25;

    case 'High-Fiber':
      // Meal must have at least 25g of fiber
      return (nutrients['FIBTG'] || 0) >= 25;

    case 'Low-Sugar':
      // Meal must have 20g or less of total sugar
      return (nutrients['SUGAR'] || 0) <= 20;

    case 'Low-Cholesterol':
      // Meal must have 100mg or less of cholesterol
      return (nutrients['CHOLE'] || 0) <= 100;

    case 'Low-Saturated-Fat':
      // Meal must have 10g or less of saturated fat
      return (nutrients['FASAT'] || 0) <= 10;

    case 'Low-Calorie':
      // Meal must have 500 kcal or less of energy
      return (nutrients['ENERC_KCAL'] || 0) <= 500;

    default:
      // Return false if diet label is not recognized
      return false;
  }
}
