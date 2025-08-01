import React, { useState } from 'react';
import { analyzeMeal, getLatestMeal } from '../api/mealAPI';
import { DIET_LABELS, checkDietCompatibility } from '../utils/dietLabels';
import { generateNutritionTips } from '../utils/nutritionTips';

// Nutrient codes and their display metadata
const TARGET_NUTRIENTS = {
  "SUGAR.added": { label: "Added sugar", unit: "g" },
  CA: { label: "Calcium, Ca", unit: "mg" },
  "CHOCDF.net": { label: "Carbohydrate (net)", unit: "g" },
  CHOCDF: { label: "Carbohydrate, by difference", unit: "g" },
  CHOLE: { label: "Cholesterol", unit: "mg" },
  ENERC_KCAL: { label: "Energy", unit: "kcal" },
  FAMS: { label: "Fatty acids, total monounsaturated", unit: "g" },
  FAPU: { label: "Fatty acids, total polyunsaturated", unit: "g" },
  FASAT: { label: "Fatty acids, total saturated", unit: "g" },
  FATRN: { label: "Fatty acids, total trans", unit: "g" },
  FIBTG: { label: "Fiber, total dietary", unit: "g" },
  FOLDFE: { label: "Folate, DFE", unit: "µg" },
  FOLFD: { label: "Folate, food", unit: "µg" },
  FOLAC: { label: "Folic acid", unit: "µg" },
  FE: { label: "Iron, Fe", unit: "mg" },
  MG: { label: "Magnesium", unit: "mg" },
  NIA: { label: "Niacin", unit: "mg" },
  P: { label: "Phosphorus, P", unit: "mg" },
  K: { label: "Potassium, K", unit: "mg" },
  PROCNT: { label: "Protein", unit: "g" },
  RIBF: { label: "Riboflavin", unit: "mg" },
  NA: { label: "Sodium, Na", unit: "mg" },
  "Sugar.alcohol": { label: "Sugar alcohols", unit: "g" },
  SUGAR: { label: "Sugars, total", unit: "g" },
  THIA: { label: "Thiamin", unit: "mg" },
  FAT: { label: "Total lipid (fat)", unit: "g" },
  VITA_RAE: { label: "Vitamin A, RAE", unit: "µg" },
  VITB12: { label: "Vitamin B-12", unit: "µg" },
  VITB6A: { label: "Vitamin B-6", unit: "mg" },
  VITC: { label: "Vitamin C, total ascorbic acid", unit: "mg" },
  VITD: { label: "Vitamin D (D2 + D3)", unit: "µg" },
  TOCPHA: { label: "Vitamin E (alpha-tocopherol)", unit: "mg" },
  VITK1: { label: "Vitamin K (phylloquinone)", unit: "µg" },
  WATER: { label: "Water", unit: "g" },
  ZN: { label: "Zinc, Zn", unit: "mg" }
};

export default function MealAnalyzer() {
  const [mealInput, setMealInput] = useState('');
  const [nutrients, setNutrients] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [tips, setTips] = useState([]);

  /**
   * Aggregates nutrients from the ingredient data returned by Edamam.
   * Initializes totals to zero and sums nutrient values by code.
   *
   * @param {Array} ingredients - Edamam ingredient list
   * @returns {Object} totals - Aggregated nutrients
   */
  const aggregateNutrients = (ingredients) => {
    const totals = {};
    for (const code of Object.keys(TARGET_NUTRIENTS)) {
      totals[code] = 0;
    }

    // Loop over each ingredient and sum up its nutrients
    ingredients.forEach((ing) => {
      const parsed = ing?.parsed?.[0]?.nutrients || {};
      for (const code of Object.keys(TARGET_NUTRIENTS)) {
        if (parsed[code]) {
          totals[code] += parsed[code].quantity;
        }
      }
    });

    return totals;
  };

  /**
   * Handles meal analysis:
   * Sends input to backend (Edamam)
   * Fetches analyzed result
   * Aggregates nutrients for display
   */
  const handleAnalyze = async () => {
    await analyzeMeal(mealInput);
    const latest = await getLatestMeal();

    if (!latest || !Array.isArray(latest.ingredients)) {
      alert('Something went wrong analyzing the meal. Please try again.');
      return;
    }

    const totals = aggregateNutrients(latest.ingredients);
    setNutrients(totals);
    setCompatibilityResult(null);
    setTips([]);
  };

  /**
   * Handles diet compatibility check using selected diet label
   */
  const handleCheckCompatibility = () => {
    if (!selectedLabel || !nutrients) return;
    const result = checkDietCompatibility(selectedLabel, nutrients);
    setCompatibilityResult(result);
  };

  /**
   * Generates personalized nutrition tips from current nutrient profile
   */
  const handleGenerateTips = () => {
    if (!nutrients) return;
    const newTips = generateNutritionTips(nutrients);
    setTips(newTips);
  };

  return (
    <div>
      <h2>Enter Your Meal</h2>

      {/* Textarea for user to input meal/ingredients */}
      <textarea
        value={mealInput}
        onChange={(e) => setMealInput(e.target.value)}
        placeholder="e.g. 2 eggs, 1 toast, 1 banana"
        rows={4}
        cols={40}
      />
      <br />
      <button onClick={handleAnalyze}>Analyze Meal</button>

      {/* Display nutrients and tools if a meal has been analyzed */}
      {nutrients && (
        <div style={{ marginTop: '30px' }}>
          {/* Nutrition Summary */}
          <h3>Nutrition Summary</h3>
          <p><strong>Calories:</strong> {nutrients.ENERC_KCAL?.toFixed(0) || '0'}</p>

          {/* Table of nutrients */}
          <table border="1" cellPadding="8" style={{ marginTop: '10px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Nutrient</th>
                <th>Label</th>
                <th>Quantity</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(TARGET_NUTRIENTS).map(([code, meta]) => (
                <tr key={code}>
                  <td>{code}</td>
                  <td>{meta.label}</td>
                  <td>{nutrients[code]?.toFixed(2) || '0.00'}</td>
                  <td>{meta.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Section: Diet Compatibility Checker */}
          <div style={{ marginTop: '30px' }}>
            <h3>Check Meal Compatibility</h3>

            {/* Dropdown for selecting a diet label */}
            <select
              value={selectedLabel}
              onChange={(e) => {
                setSelectedLabel(e.target.value);
                setCompatibilityResult(null); // Reset result on change
              }}
            >
              <option value="">Select a diet</option>
              {DIET_LABELS.map((label) => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>

            {/* Button to check compatibility */}
            <button onClick={handleCheckCompatibility} style={{ marginLeft: '10px' }}>
              Check
            </button>

            {/* Display result of compatibility check */}
            {compatibilityResult !== null && (
              <p style={{ marginTop: '10px' }}>
                This meal is {compatibilityResult ? '✔' : '❌'}{' '}
                <strong>{compatibilityResult ? 'Compatible' : 'Not Compatible'}</strong> with{' '}
                <strong>{selectedLabel}</strong> diet.
              </p>
            )}
          </div>

          {/* Section: Nutrition Tips */}
          <div style={{ marginTop: '30px' }}>
            <h3>Nutrition Tips</h3>
            <button onClick={handleGenerateTips}>Get Nutrition Tips</button>

            {/* List of generated tips */}
            <ul>
              {tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
