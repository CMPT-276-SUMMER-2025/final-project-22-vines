import NavBar from '../components/NavBar'
import { useState } from 'react';
import { useFoodLog } from '../contexts/FoodLogContext';
import { useTrackedGoals } from '../contexts/TrackedGoalsContext';
import { useUser } from '../contexts/UserContext';
import WorkoutHistory from '../components/WorkoutHistory';
import "../css/Dashboard.css";

function Dashboard() {
    const { foodLog, loggedNutrients } = useFoodLog();
    const { trackedNutrients, goals, TARGET_NUTRIENTS } = useTrackedGoals();
    const { phone, setPhone } = useUser();
    const [manualPhoneInput, setManualPhoneInput] = useState('');

    return (
        <>
            <NavBar/>
            <div className="dashboard">
                <div className="loggedMeals">
                    <h2>Meal History</h2>
                    <div className="loggedMealsContent">
                      {foodLog.length === 0 ? (
                      <p className="placeholder">No meals logged yet.</p>
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
                                    {/* <button className="delete-meal" onClick={() => removeMeal(entry.timestamp)}>×</button> */}
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
                </div>
                <div className="nutritionInfo">
                    <h2>Nutrition Summary</h2>
                    <div className="nutritionInfoContent">
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
                </div>
                <div className="trackedExercises">
                  <h2>Exercise History</h2>
                  <div className="trackedExercisesContent">
                    {!phone ? (
                      <div className="noProfilePrompt">
                        <p>No profile loaded.<br/> <br/>Enter your phone number to view your workouts:</p>
                        <div className="phoneInputRow">
                          <input
                            type="text"
                            placeholder="Enter phone number"
                            value={manualPhoneInput}
                            onChange={(e) => setManualPhoneInput(e.target.value)}
                          />
                          <button onClick={() => setPhone(manualPhoneInput)}>
                            Load Profile
                          </button>
                        </div>
                      </div>
                    ) : (
                      <WorkoutHistory phone={phone} />
                    )}
                  </div>
                </div>

            </div>
        </> 
    )
}

export default Dashboard