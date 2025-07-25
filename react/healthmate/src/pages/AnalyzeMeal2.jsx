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
        const result = await checkMealCompatibility(analysisResult);
        setCompatibilityInfo(result);
    };

    const handleNutritionTips = async () => {
        const result = await getNutritionTips(analysisResult);
        setTips(result);
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
                <pre>{JSON.stringify(compatibilityInfo, null, 2)}</pre>
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