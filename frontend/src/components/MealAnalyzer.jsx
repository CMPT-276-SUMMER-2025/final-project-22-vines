import React, { useState, useEffect, useCallback } from 'react';
import { analyzeMeal, getLatestMeal } from '../api/mealAPI';
import { DIET_LABELS, checkDietCompatibility } from '../utils/dietLabels';
import { generateNutritionTips } from '../utils/nutritionTips';
import useUndoRedo from '../hooks';
import "../css/AnalyzeMeal.css";
import addIcon from '../assets/buttons/add.svg';
import clearIcon from '../assets/buttons/clear.svg';
import enterIcon from '../assets/buttons/enter.svg';
import removeIcon from '../assets/buttons/remove.svg';
// Nutrients we care about, with labels and units for display
const TARGET_NUTRIENTS = {
  "SUGAR.added": { label: "Added sugar", unit: "g" },
  CA: { label: "Calcium, Ca", unit: "mg" },
  "CHOCDF.net": { label: "Carbohydrate (net)", unit: "g" },
  CHOCDF: { label: "Carbohydrate", unit: "g" },
  CHOLE: { label: "Cholesterol", unit: "mg" },
  ENERC_KCAL: { label: "Energy", unit: "kcal" },
  FAMS: { label: "Monounsaturated fat", unit: "g" },
  FAPU: { label: "Polyunsaturated fat", unit: "g" },
  FASAT: { label: "Saturated fat", unit: "g" },
  FATRN: { label: "Trans fat", unit: "g" },
  FIBTG: { label: "Fiber", unit: "g" },
  FE: { label: "Iron", unit: "mg" },
  FAT: { label: "Total Fat", unit: "g" },
  NA: { label: "Sodium", unit: "mg" },
  PROCNT: { label: "Protein", unit: "g" },
  VITC: { label: "Vitamin C", unit: "mg" }
};
export default function MealAnalyzer() {
  const [formFields, setFormFieldsRaw, inputRef] = useUndoRedo([{ food: '' }], 10);
  const [tempValues, setTempValues] = useState(['']);
  const [nutrients, setNutrients] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [tips, setTips] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  // Sync UI-only values with stored form fields
  useEffect(() => {
    setTempValues(formFields.map(field => field.food || ''));
  }, [formFields]);
  // Automatically focus the last input
  useEffect(() => {
    if (inputRef.current) {
      const inputs = inputRef.current.querySelectorAll('input');
      if (inputs.length > 0) {
        inputs[inputs.length - 1].focus();
      }
    }
  }, [tempValues.length, inputRef]);
  const submit = (e) => {
    e.preventDefault();
    handleAnalyze();
    setActiveTab('summary');
  };
  const addFields = () => {
    setFormFieldsRaw([...formFields, { food: '' }], true);
    setTempValues([...tempValues, '']);
  };
  const removeFields = (index) => {
    const updatedFields = [...formFields];
    const updatedTemps = [...tempValues];
    updatedFields.splice(index, 1);
    updatedTemps.splice(index, 1);
    setFormFieldsRaw(updatedFields, true);
    setTempValues(updatedTemps);
  };
  const handleChange = (index, value) => {
    const newTemps = [...tempValues];
    newTemps[index] = value;
    setTempValues(newTemps);
  };
  const handleBlur = (index) => {
    const newFields = [...formFields];
    newFields[index].food = tempValues[index];
    setFormFieldsRaw(newFields, false);
  };
  const clearAllFields = () => {
    if (formFields.length === 1 && formFields[0].food === '') return;
    setFormFieldsRaw([{ food: '' }], true);
    setTempValues(['']);
  };
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const currentValue = tempValues[index].trim();
      if (currentValue !== '') {
        handleBlur(index);
        addFields();
        setTimeout(() => {
          const nextInput = inputRef.current?.querySelectorAll('input')[index + 1];
          nextInput?.focus();
        }, 0);
      }
    }
  };
  /**
   * Aggregates the total nutrient values across all parsed ingredients.
   * @param {Array} ingredients - Edamam's response ingredient array
   * @returns {Object} - Totals of each nutrient
   */
  const aggregateNutrients = (ingredients) => {
    const totals = {};
    for (const code of Object.keys(TARGET_NUTRIENTS)) {
      totals[code] = 0;
    }
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
   * Sends ingredients to backend, fetches results, updates UI and nutrient state.
   */
  const handleAnalyze = async () => {
    const combinedInput = formFields.map(f => f.food.trim()).filter(Boolean).join(', ');
    if (!combinedInput) {
      alert("Please enter some foods.");
      return;
    }
    try {
      const responseData = await analyzeMeal(combinedInput);
      if (!responseData || !Array.isArray(responseData.ingredients)) {
        setNutrients(null);
        alert('Please enter a valid meal with correct syntax.');
        return;
      }
      const latest = await getLatestMeal();
      if (!latest || !Array.isArray(latest.ingredients)) {
        alert('Could not retrieve analyzed meal.');
        return;
      }
      const totals = aggregateNutrients(latest.ingredients);
      setNutrients(totals);
      setCompatibilityResult(null);
      setTips([]);
    } catch (err) {
      setNutrients(null);
      alert(err.message || 'An error occurred while analyzing the meal.');
    }
  };
  const handleCheckCompatibility = () => {
    if (!selectedLabel || !nutrients) return;
    const result = checkDietCompatibility(selectedLabel, nutrients);
    setCompatibilityResult(result);
  };
  const handleGenerateTips = useCallback(() => {
    if (!nutrients) return;
    const newTips = generateNutritionTips(nutrients);
    setTips(newTips);
  }, [nutrients]);
  useEffect(() => {
    if (activeTab === 'tips' && tips.length === 0) {
      handleGenerateTips();
    }
  }, [activeTab, tips.length, handleGenerateTips]);
  return (
    <div className="analyzeMeal">
      {/* Input section */}
      <div className='foodEntryContainer'>
        <h2>Enter Your Meal</h2>
        <div className='foodEntryBox'>
          <div className="toolbar">
            <div className="left-actions">
              <button onClick={submit}><img src={enterIcon} alt="Submit" /> Submit</button>
              <button onClick={addFields}><img src={addIcon} alt="Add" /></button>
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
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                  <button type="button" onClick={() => removeFields(index)} className='removeBtn'>
                    <img src={removeIcon} alt="Button Icon" className="buttonIcon" />
                  </button>
                </div>
              ))}
            </form>
          </div>
        </div>
      </div>
      {/* Analysis Results */}
      <div className='analysisResultsContainer'>
        <h2>Meal Analysis</h2>
        <div className="tabSwitcher">
          <button className={activeTab === 'summary' ? 'active' : ''} onClick={() => setActiveTab('summary')} disabled={!nutrients}>Nutrition Summary</button>
          <button className={activeTab === 'compatibility' ? 'active' : ''} onClick={() => setActiveTab('compatibility')} disabled={!nutrients}>Check Meal Compatibility</button>
          <button className={activeTab === 'tips' ? 'active' : ''} onClick={() => setActiveTab('tips')} disabled={!nutrients}>Nutrition Tips</button>
        </div>
        <div className="tabContent">
          {!nutrients ? (
            <div className="analysisPlaceholder">
              <p>Submit a meal to view an analysis.</p>
            </div>
          ) : (
            <>
              {activeTab === 'summary' && (
                <div className="nutritionLabel">
                  <div className="caloriesLine">
                    Calories: {nutrients.ENERC_KCAL?.toFixed(0) || '0'}
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }}>Nutrient</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(TARGET_NUTRIENTS).map(([code, meta]) => (
                        <tr key={code}>
                          <td>{meta.label}</td>
                          <td className="quantity">{nutrients[code]?.toFixed(2) || '0.00'} {meta.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === 'compatibility' && (
                <div>
                  <select
                    className='dietSelect'
                    value={selectedLabel}
                    onChange={(e) => {
                      setSelectedLabel(e.target.value);
                      setCompatibilityResult(null);
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
                      This meal is {compatibilityResult ? ':heavy_check_mark:' : ':x:'}{' '}
                      <strong>{compatibilityResult ? 'Compatible' : 'Not Compatible'}</strong>{' '}
                      with <strong>{selectedLabel}</strong> diet.
                    </p>
                  )}
                </div>
              )}
              {activeTab === 'tips' && (
                <div>
                  <ul>
                    {tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
