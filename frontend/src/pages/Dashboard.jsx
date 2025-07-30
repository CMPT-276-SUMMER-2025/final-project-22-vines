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
                    <h3>Meal History</h3>
                    {foodLog.length === 0 ? (
                    <p className="placeholder">No meals logged yet.</p>
                    ) : (
                    <ul>
                        {foodLog.map((meal, i) => (
                        <li key={i}>
                            {new Date(meal.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} – {meal.text}
                        </li>
                        ))}
                    </ul>
                    )}
                </div>
                <div className="nutritionInfo">
                    <h3>Nutrition Summary</h3>
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
                <div className="trackedExercises">
                    <h3>Exercise History</h3>
                    <p>Work in progress.</p>
                </div>
            </div>
        </> 
    )
}

export default Dashboard