import React, { createContext, useState, useContext } from 'react';

const FoodLogContext = createContext();

export const FoodLogProvider = ({ children }) => {
  const [loggedNutrients, setLoggedNutrients] = useState({});
  const [foodLog, setFoodLog] = useState([]);
  const [trackedNutrients, setTrackedNutrients] = useState([
    'ENERC_KCAL', 'PROCNT', 'CHOCDF', 'FAT'  // default
  ]);

  const addMeal = ({ timestamp = new Date().toISOString(), items = [], nutrients = {} }) => {
    const meal = { timestamp, items, nutrients };

    setFoodLog(prev => [...prev, meal]);

    const updatedTotals = { ...loggedNutrients };
    Object.keys(nutrients).forEach(key => {
      updatedTotals[key] = (updatedTotals[key] || 0) + nutrients[key];
    });
    setLoggedNutrients(updatedTotals);
  };

  const removeMeal = (timestamp) => {
    setFoodLog(prev => {
      const mealToRemove = prev.find(entry => entry.timestamp === timestamp);
      if (!mealToRemove || !mealToRemove.nutrients) return prev;

      const updatedTotals = { ...loggedNutrients };
      Object.entries(mealToRemove.nutrients).forEach(([key, value]) => {
        updatedTotals[key] = (updatedTotals[key] || 0) - value;
        if (updatedTotals[key] < 0) updatedTotals[key] = 0;
      });

      setLoggedNutrients(updatedTotals);
      return prev.filter(entry => entry.timestamp !== timestamp);
    });
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
        removeTrackedNutrient,
        removeMeal
      }}
    >
      {children}
    </FoodLogContext.Provider>
  );
};

export const useFoodLog = () => useContext(FoodLogContext);
