import React, { createContext, useState, useContext } from 'react';

const FoodLogContext = createContext();

export const FoodLogProvider = ({ children }) => {
  const [loggedNutrients, setLoggedNutrients] = useState({});
  const [foodLog, setFoodLog] = useState([]);
  const [trackedNutrients, setTrackedNutrients] = useState([
    'ENERC_KCAL', 'PROCNT', 'CHOCDF', 'FAT'  // default
  ]);

  const addMeal = (mealText, nutrients) => {
    const timestamp = new Date().toISOString();
    const meal = { text: mealText, timestamp };

    setFoodLog(prev => [...prev, meal]);

    const updatedTotals = { ...loggedNutrients };
    Object.keys(nutrients).forEach(key => {
      updatedTotals[key] = (updatedTotals[key] || 0) + nutrients[key];
    });
    setLoggedNutrients(updatedTotals);
  };


  const resetLog = () => {
    setFoodLog([]);
    setLoggedNutrients({});
  };

  const addTrackedNutrient = (nutrientCode) => {
    if (!trackedNutrients.includes(nutrientCode)) {
      setTrackedNutrients([...trackedNutrients, nutrientCode]);
    }
  };

  const removeTrackedNutrient = (nutrientCode) => {
    setTrackedNutrients(trackedNutrients.filter(n => n !== nutrientCode));
  };


  return (
    <FoodLogContext.Provider
      value={{
        foodLog,
        loggedNutrients,
        trackedNutrients,
        addMeal,
        resetLog,
        addTrackedNutrient,
        removeTrackedNutrient
      }}
    >
      {children}
    </FoodLogContext.Provider>
  );
};

export const useFoodLog = () => useContext(FoodLogContext);
