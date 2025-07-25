// import NavBar from '../components/NavBar'
import {useState} from 'react'
// import analyzemeal from "../assets/analyzemeal.svg";
// import "../css/AnalyzeMeal.css";
import { analyzeMeal, checkMealCompatibility, getNutritionTips } from '../api/mealAPI';
// import { totalNutrients } from '../components/totalNutrients';


function AnalyzeMeal2() {
    const [mealText, setMealText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzed, setIsAnalyzed] = useState(false);
    const [tips, setTips] = useState(null);
    const [compatibilityInfo, setCompatibilityInfo] = useState(null);

    const handleAnalyzeMeal = async () => {
        try {
            const result = await analyzeMeal(mealText);
            console.log("result: ", result);
            const ingredients = result.nutrition.ingredients;
            
            let total = {
                calories: 0,
                protein: 0,
                carbohydrates: 0,
                fat: 0
            };

            // Go through each ingredient and add the quantity of nutrients to their respective variables
            for (let i = 0; i < ingredients.length; i++) {
                total.calories += ingredients[i].parsed[0].nutrients.ENERC_KCAL.quantity;
                total.protein += ingredients[i].parsed[0].nutrients.PROCNT.quantity;
                total.carbohydrates += ingredients[i].parsed[0].nutrients.CHOCDF.quantity;
                total.fat += ingredients[i].parsed[0].nutrients.FAT.quantity;
            }

            result.total = total;

            setAnalysisResult(result);
            setIsAnalyzed(true);
        } catch (err) {
            console.error("error:", err);
        }
    };
    
    const handleCheckCompatibility = async () => {
        try {
            // const result = await checkMealCompatibility(analysisResult);
            
            const result = {
                cautions: analysisResult.nutrition.cautions,
                dietLabels: analysisResult.nutrition.dietLabels,
                healthLabels: analysisResult.nutrition.healthLabels,
            }

            setCompatibilityInfo(result);
        } catch (err) {
            console.error("error: ", err);
        }
    };

    const handleNutritionTips = async () => {
        try {
            // const result = await getNutritionTips(analysisResult);
            console.log("nutriton tips test: ", analysisResult);
            let calories = 0;
            let fat = 0;
            let sugar = 0;
            let sodium = 0;
            let fiber = 0;
            let protein = 0;
            let healthLabels = analysisResult.nutrition.healthLabels || [];
            const ingredients = analysisResult.nutrition.ingredients;

            for (let i = 0; i < ingredients.length; i++) {
                calories += ingredients[i].parsed[0].nutrients.ENERC_KCAL.quantity || 0;
                fat += ingredients[i].parsed[0].nutrients.FAT.quantity || 0;
                sugar += ingredients[i].parsed[0].nutrients.SUGAR.quantity || 0;
                sodium += ingredients[i].parsed[0].nutrients.NA.quantity || 0;
                fiber += ingredients[i].parsed[0].nutrients.FIBTG.quantity || 0;
                protein += ingredients[i].parsed[0].nutrients.PROCNT.quantity || 0;
            }

            const tips = [];

             // Calorie tips
            if (calories > 700) {
                tips.push('This meal is high in calories. Consider reducing portion size.');
            } else if (calories < 300) {
                tips.push('This meal is low in calories. Consider adding a source of protein or healthy fats.');
            }

            // Fat content
            if (fat > 70) {
                tips.push('Fat content is high. Consider reducing oil, butter, or fatty meats.');
            }

            // Sugar warning
            if (sugar > 25) {
                tips.push('Sugar content is high. Try cutting back on sugary sauces or sweeteners.');
            }

            // Sodium warning
            if (sodium > 2300) {
                tips.push('Sodium level is very high. Watch out for processed or salty foods.');
            }

            // Fiber encouragement
            if (fiber < 10) {
                tips.push('Fiber is low. Add whole grains, beans, or veggies for better digestion.');
            }

            // Protein praise
            if (protein > 20) {
                tips.push('Great source of protein!');
            }

            // Health labels praise
            if (healthLabels.includes('LOW_SODIUM')) {
                tips.push('Nice work keeping sodium levels low!');
            }
            if (healthLabels.includes('HIGH_FIBER')) {
                tips.push('Excellent fiber content in this meal!');
            }
            
            setTips(tips);
        } catch (err) {
            console.error("error: ", err);
        }
        
    };

    return (
        <div>
            <textarea
                value={mealText}
                onChange={(e) => setMealText(e.target.value)}
                placeholder="Enter your meal description..."
            />
            <br />
            <button onClick={handleAnalyzeMeal} disabled={!mealText}>
                Analyze Meal
            </button>
            <button onClick={handleCheckCompatibility} disabled={!isAnalyzed}>
                Check Meal Compatibility
            </button>
            <button onClick={handleNutritionTips} disabled={!isAnalyzed}>
                Nutrition Tips
            </button>

            {analysisResult && (
                <div>
                <h3>Nutrition Breakdown</h3>
                <p>URI: {analysisResult.nutrition.uri}</p>
                <p>Calories: { analysisResult.total.calories}</p>
                <p>Protein: { analysisResult.total.protein}</p>
                <p>Carbohydrates: {analysisResult.total.carbohydrates}</p>
                <p>Fat: {analysisResult.total.fat}</p>
                </div>
            )}

            {compatibilityInfo && (
                <div>
                <h4>Compatibility Info:</h4>
                <h5>Cautions</h5>
                <pre>{JSON.stringify(compatibilityInfo.cautions, null, 2)}</pre>
                <h5>Diet labels</h5>
                <pre>{JSON.stringify(compatibilityInfo.dietLabels, null, 2)}</pre>
                <h5>Health labels</h5>
                <pre>{JSON.stringify(compatibilityInfo.healthLabels, null, 2)}</pre>
                </div>
            )}

            {tips && (
                <div>
                <h4>Nutrition Tips:</h4>
                <pre>{JSON.stringify(tips, null, 2)}</pre>
                </div>
            )}
        </div> 
    )
}

export default AnalyzeMeal2