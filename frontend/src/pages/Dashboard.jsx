import NavBar from '../components/NavBar'
import { useFoodLog } from '../contexts/FoodLogContext';
import { useTrackedGoals } from '../contexts/TrackedGoalsContext';
import "../css/Dashboard.css";

function Dashboard() {
    const { foodLog, loggedNutrients } = useFoodLog();
    const { trackedNutrients, goals, TARGET_NUTRIENTS } = useTrackedGoals();
    return (
        <>
            <NavBar/>
            <div className="dashboard">
                <div className="loggedMeals">
                    <h2>Meal History</h2>
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
                    <p>Work in progress.</p>
                </div>
            </div>
        </> 
    )
}

export default Dashboard