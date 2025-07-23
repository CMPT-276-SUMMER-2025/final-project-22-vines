import React, { useState } from 'react';
import { analyzeMeal, checkMealCompatibility, getNutritionTips } from '../api/mealAPI';

const MealAnalyzer = () => {
  const [mealText, setMealText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [tips, setTips] = useState(null);
  const [compatibilityInfo, setCompatibilityInfo] = useState(null);

  const handleAnalyzeMeal = async () => {
  const result = await analyzeMeal(mealText); 
  setAnalysisResult(result);
  setIsAnalyzed(true);
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
          <p>Calories: {analysisResult.calories}</p>
          <p>Fat: {analysisResult.totalNutrients.FAT.quantity} {analysisResult.totalNutrients.FAT.unit}</p>
          <p>Protein: {analysisResult.totalNutrients.PROCNT.quantity} {analysisResult.totalNutrients.PROCNT.unit}</p>
          <p>Carbs: {analysisResult.totalNutrients.CHOCDF.quantity} {analysisResult.totalNutrients.CHOCDF.unit}</p>
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
  );
};

export default MealAnalyzer;
