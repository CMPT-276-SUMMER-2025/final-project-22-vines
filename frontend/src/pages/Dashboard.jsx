import NavBar from '../components/NavBar'
import { useFoodLog } from '../contexts/FoodLogContext';
import "../css/Dashboard.css";

function Dashboard() {
    const { foodLog, loggedNutrients } = useFoodLog();
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
                    <p>Calories: {Math.round(loggedNutrients['ENERC_KCAL'] || 0)}</p>
                    <p>Protein: {Math.round(loggedNutrients['PROCNT'] || 0)} g</p>
                    <p>Carbs: {Math.round(loggedNutrients['CHOCDF'] || 0)} g</p>
                    <p>Fat: {Math.round(loggedNutrients['FAT'] || 0)} g</p>
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