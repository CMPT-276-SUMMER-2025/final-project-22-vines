import React, { useState, useEffect } from 'react';
import { analyzeMeal, getLatestMeal } from '../api/mealAPI';
import { DIET_LABELS, checkDietCompatibility } from '../utils/dietLabels';
import { generateNutritionTips } from '../utils/nutritionTips';
import useUndoRedo from '../hooks';
import "../css/AnalyzeMeal.css";
import addIcon from '../assets/buttons/add.svg';
import undoIcon from '../assets/buttons/undo.svg';
import redoIcon from '../assets/buttons/redo.svg';
import clearIcon from '../assets/buttons/clear.svg';
import enterIcon from '../assets/buttons/enter.svg';
import removeIcon from '../assets/buttons/remove.svg';

// Nutrients to be shown in the table with human-readable labels and units
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
  const [activeTab, setActiveTab] = useState('');
  const [nutrients, setNutrients] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [tips, setTips] = useState([]);
  
  // Food entry box
  const [tempValues, setTempValues] = useState(['']);
  // Undo/redo
  const [formFields, setFormFieldsRaw, undo, redo, inputRef] = useUndoRedo([{ food: '' }], 10);

  useEffect(() => {
      setTempValues(formFields.map(field => field.food || ''));
  }, [formFields]);

  useEffect(() => {
      if (inputRef.current) {
          const inputs = inputRef.current.querySelectorAll('input');
          if (inputs.length > 0) {
              inputs[inputs.length - 1].focus();
          }
      }
  }, [tempValues.length]);


  const submit = (e) => {
    e.preventDefault();
    handleAnalyze(formFields);
    setActiveTab('summary'); // default tab after saving
  };

  const addFields = () => {
      const newFormFields = [...formFields, { food: '' }];
      const newTempValues = [...tempValues, ''];

      // First update formFields (pushes to undo history)
      setFormFieldsRaw(newFormFields, true);

      // Then update UI-only tempValues
      setTempValues(newTempValues);
  };

  const removeFields = (index) => {
      const updatedFields = [...formFields];
      const updatedTemps = [...tempValues];
      updatedFields.splice(index, 1);
      updatedTemps.splice(index, 1);
      setFormFieldsRaw(updatedFields, true);
      setTempValues(updatedTemps);
  }

  const handleChange = (index, value) => {
      const newTemps = [...tempValues];
      newTemps[index] = value;
      setTempValues(newTemps);
  };

  // Blur
  const handleBlur = (index) => {
      const newFields = [...formFields];
      newFields[index].food = tempValues[index];
      setFormFieldsRaw(newFields, false);
      console.log('Committed formFields:', newFields);
  };

  const clearAllFields = () => {
      if (formFields.length === 1 && formFields[0].food === '') return;

      setFormFieldsRaw([{food: ''}], true);
      setTempValues(['']);
  };

  /**
   aggregateNutrients: Aggregates the quantities of each nutrient across all ingredients.
   
   INPUT:
   ingredients (array): An array of ingredient objects from Edamam
   
   OUTPUT:
   totals (object): A map of nutrient codes to total quantities
   */
  const aggregateNutrients = (ingredients) => {
    const totals = {};

    // Initialize totals for all target nutrients to 0
    for (const code of Object.keys(TARGET_NUTRIENTS)) {
      totals[code] = 0;
    }

    // Loop through each ingredient and accumulate its nutrient values
    ingredients.forEach(ing => {
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
   handleAnalyze
   Sends the meal to the backend for analysis and updates state with the results.
   */
  const handleAnalyze = async () => {
    const combinedInput = formFields.map(f => f.food.trim()).filter(Boolean).join(', ');
    if (!combinedInput) return alert("Please enter some foods.");

    await analyzeMeal(combinedInput);
    const latest = await getLatestMeal();

    const totals = aggregateNutrients(latest.ingredients);
    setNutrients(totals);
    setCompatibilityResult(null);
    setTips([]);
  };

  /**
   handleCheckCompatibility
   Checks whether the analyzed meal matches the selected diet label.
   */
  const handleCheckCompatibility = () => {
    if (!selectedLabel || !nutrients) return;
    const result = checkDietCompatibility(selectedLabel, nutrients);
    setCompatibilityResult(result);
  };

  /**
   handleGenerateTips
   Generates nutrition tips based on the aggregated nutrients.
   */
  const handleGenerateTips = () => {
    if (!nutrients) return;
    const newTips = generateNutritionTips(nutrients);
    setTips(newTips);
  };

  return (
    <div className="analyzeMeal">
      <div className='foodEntryContainer'>
        <h2>Enter Your Meal</h2>
        {/* Input field for user to type in ingredients */}
        <div className='foodEntryBox'>
            <div className="toolbar">
              <div className="left-actions">
                <button onClick={submit}><img src={enterIcon} alt="Submit" /> Submit</button>
                <button onClick={addFields}><img src={addIcon} alt="Add" /></button>
                <button onClick={undo}><img src={undoIcon} alt="Undo" /></button>
                <button onClick={redo}><img src={redoIcon} alt="Redo" /></button>
              </div>
              <div className="right-actions">
                <button onClick={clearAllFields}><img src={clearIcon} alt="Clear" /> Clear</button>
              </div>
            </div>
            <div className='foodEntries'>
              <form onSubmit={submit} ref={inputRef}>
                {formFields.map((_, index) => (
                    <div key={index} className='foodEntry'>
                        <input
                            name="food"
                            placeholder="Enter food"
                            value={tempValues[index]}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onBlur={() => handleBlur(index)}
                        />
                        <button type="button" onClick={() => removeFields(index)} className='removeBtn'><img src={removeIcon} alt="Button Icon" className="buttonIcon"/></button>
                    </div>
                ))}
              </form>
            </div>
        </div>
      </div>

      {/* Display nutrition results if available */}
    <div className='analysisResultsContainer'>
      <h2>Meal Analysis</h2>
  
      <div className="tabSwitcher">
        <button className={activeTab === 'summary' ? 'active' : ''} onClick={() => setActiveTab('summary')}>Nutrition Summary</button>
        <button className={activeTab === 'compatibility' ? 'active' : ''} onClick={() => setActiveTab('compatibility')}>Check Meal Compatibility</button>
        <button className={activeTab === 'tips' ? 'active' : ''} onClick={() => setActiveTab('tips')}>Nutrition Tips</button>
      </div>
      
      <div className="tabContent">
        {activeTab === 'summary' && nutrients && (
          <div>
            <p><strong>Calories:</strong> {nutrients.ENERC_KCAL?.toFixed(0) || '0'}</p>

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
                {/* Loop through each nutrient and show its aggregated total */}
                {Object.entries(TARGET_NUTRIENTS).map(([code, meta]) => (
                  <tr key={code}>
                    <td>{code}</td>
                    <td>{meta.label}</td>
                    <td>{nutrients[code]?.toFixed(2) || "0.00"}</td>
                    <td>{meta.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'compatibility' && (
          <div>
            <select
              value={selectedLabel}
              onChange={(e) => {
                setSelectedLabel(e.target.value);
                setCompatibilityResult(null); // Clear result on new selection
              }}
            >
              <option value="">Select a diet</option>
              {DIET_LABELS.map(label => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
            <button onClick={handleCheckCompatibility} style={{ marginLeft: '10px' }}>Check</button>

            {compatibilityResult !== null && (
              <p style={{ marginTop: '10px' }}>
                This meal is {compatibilityResult ? '✔' : '❌'}{' '}
                <strong>{compatibilityResult ? 'Compatible' : 'Not Compatible'}</strong>{' '}
                with <strong>{selectedLabel}</strong> diet.
              </p>
            )}
          </div>
        )}

        {activeTab === 'tips' && (
          <div>
            <button onClick={handleGenerateTips}>Get Nutrition Tips</button>
            <ul>
              {tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      
    </div>

    <div className="rightSpacer"/>

    </div>
  );
}