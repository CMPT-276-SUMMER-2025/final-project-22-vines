import React, { useState, useEffect } from 'react';
import { analyzeMeal, getLatestMeal } from '../api/mealAPI';
import useUndoRedo from '../hooks';
import { useFoodLog } from '../contexts/FoodLogContext';
import { useTrackedGoals } from '../contexts/TrackedGoalsContext';
import "../css/LogFood.css";
import addIcon from '../assets/buttons/add.svg';
import undoIcon from '../assets/buttons/undo.svg';
import redoIcon from '../assets/buttons/redo.svg';
import clearIcon from '../assets/buttons/clear.svg';
import enterIcon from '../assets/buttons/enter.svg';
import removeIcon from '../assets/buttons/remove.svg';

export default function FoodLogger() {
  const { loggedNutrients, foodLog, addMeal, removeMeal } = useFoodLog();
  const { trackedNutrients, goals, TARGET_NUTRIENTS } = useTrackedGoals();
  const [activeTab, setActiveTab] = useState('summary');
  const [, setNutrients] = useState(null);
  const [loading, setLoading] = useState(false);

  
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
  }, [tempValues.length, inputRef]);



  const submit = (e) => {
    e.preventDefault();
    handleAnalyze(formFields);
    // setActiveTab('summary'); // default tab after saving
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

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault(); // Prevent newline or comma from appearing
      const currentValue = tempValues[index].trim();

      if (currentValue !== '') {
        handleBlur(index);   // Optionally save the current input
        addFields();         // Create a new field
        setTimeout(() => {
          // Focus the new input (next index)
          const nextInput = inputRef.current?.querySelectorAll('input')[index + 1];
          nextInput?.focus();
        }, 0);
      }
    }
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
    if (loading) return; // Prevent multiple rapid clicks

    const combinedInput = formFields.map(f => f.food.trim()).filter(Boolean).join(', ');
    if (!combinedInput) return alert("Please enter some foods.");

    try {
      setLoading(true);

      await analyzeMeal(combinedInput);
      const latest = await getLatestMeal();
      const totals = aggregateNutrients(latest.ingredients);
      setNutrients(totals);

      addMeal({
        timestamp: new Date().toISOString(),
        items: formFields.map(f => f.food.trim()).filter(Boolean),
        nutrients: totals
      });

      // Clear input after successful log
      setFormFieldsRaw([{ food: '' }], true);
      setTempValues(['']);

    } catch (error) {
      console.error("Error analyzing meal:", error);
      alert("Failed to analyze meal. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="logFood">
        <div className='foodEntryContainer'>
        <h2>Enter Your Meal</h2>
        {/* Input field for user to type in ingredients */}
        <div className='foodEntryBox'>
            <div className="toolbar">
                <div className="left-actions">
                <button onClick={submit} disabled={loading}>
                  {loading ? 'Submitting...' : <><img src={enterIcon} alt="Submit" /> Submit</>}
                </button>
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
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                        <button type="button" onClick={() => removeFields(index)} className='removeBtn'><img src={removeIcon} alt="Button Icon" className="buttonIcon"/></button>
                    </div>
                ))}
                </form>
            </div>
        </div>
        </div>

        <div className='logFoodContainer'>
            <h2>Logged Information</h2>
        
            <div className="tabSwitcher">
                <button
                className={activeTab === 'summary' ? 'active' : ''}
                onClick={() => setActiveTab('summary')}
                >
                Nutrition Summary
                </button>
                <button
                className={activeTab === 'history' ? 'active' : ''}
                onClick={() => setActiveTab('history')}
                >
                Meal History
                </button>
            </div>
            
            <div className="tabContent">
                {activeTab === 'summary' && (
                    <div className="summaryCard">
                        {trackedNutrients.map(code => {
                          const label = TARGET_NUTRIENTS[code]?.label || code;
                          const unit = TARGET_NUTRIENTS[code]?.unit || '';
                          const current = Math.round(loggedNutrients[code] || 0);
                          const goal = goals[code];

                          const ratio = goal ? current / goal : 0;
                          const progressPercent = Math.min(100, Math.round(ratio * 100));

                          return (
                            <div key={code} className="nutrient-row">
                              <div className="nutrient-labels">
                                <span>{label}</span>
                                <span>{current}{unit && ` ${unit}`} / {goal}{unit && ` ${unit}`}</span>
                              </div>
                              <div className="progress-container">
                                <div
                                  className={`progress-bar ${
                                    progressPercent >= 100 ? 'progress-green' :
                                    progressPercent >= 75  ? 'progress-palegreen' :
                                    progressPercent >= 50  ? 'progress-yellow' :
                                    progressPercent >= 25  ? 'progress-orange' :
                                                            'progress-red'
                                  }`}
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="historyCard">
                        {foodLog.length === 0 ? (
                        <p>No meals logged yet.</p>
                        ) : (
                        <ul>
                          {foodLog.slice().reverse().map((entry, index) => {
                            const time = new Date(entry.timestamp).toLocaleTimeString([], {
                              hour: 'numeric',
                              minute: '2-digit',
                            });

                            return (
                              <div key={entry.timestamp} className="meal-entry">
                                <div className="meal-header">
                                  <span className="meal-time">{time}</span>
                                  <button className="delete-meal" onClick={() => removeMeal(entry.timestamp)}>×</button>
                                </div>
                                <div className="meal-body">
                                  <ul>
                                    {entry.items.map((item, i) => (
                                      <li key={i}>• {item}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            );
                          })}

                        </ul>
                        )}
                    </div>
                )}
            </div>
        </div>

        <div className="rightSpacer"/>
    </div>
  );
}