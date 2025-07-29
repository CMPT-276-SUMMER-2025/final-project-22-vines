import React, { createContext, useState, useContext } from 'react';

const FoodLogContext = createContext();

export const FoodLogProvider = ({ children }) => {
  const [loggedNutrients, setLoggedNutrients] = useState({});
  const [foodLog, setFoodLog] = useState([]);

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

  return (
    <FoodLogContext.Provider value={{ foodLog, loggedNutrients, addMeal, resetLog }}>
      {children}
    </FoodLogContext.Provider>
  );
};

export const useFoodLog = () => useContext(FoodLogContext);
