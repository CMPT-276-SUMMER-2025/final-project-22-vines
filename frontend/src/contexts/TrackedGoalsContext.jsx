// src/contexts/TrackedGoalsContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Default tracked nutrients
const defaultTracked = ['ENERC_KCAL', 'PROCNT', 'CHOCDF', 'FAT'];

const TrackedGoalsContext = createContext();

const TARGET_NUTRIENTS = {
  "SUGAR.added": { label: "Added sugar", unit: "g" },
  CA: { label: "Calcium, Ca", unit: "mg" },
  "CHOCDF.net": { label: "Carbohydrate (net)", unit: "g" },
  CHOCDF: { label: "Carbohydrate, by difference", unit: "g" },
  CHOLE: { label: "Cholesterol", unit: "mg" },
  ENERC_KCAL: { label: "Energy", unit: "kcal" },
  FAMS: { label: "Fatty acids, total monounsaturated", unit: "g" },
  FAPU: { label: "Fatty acids, total polyunsaturated", unit: "g" },
  FASAT: { label: "Fatty acids, total saturated", unit: "g" },
  FATRN: { label: "Fatty acids, total trans", unit: "g" },
  FIBTG: { label: "Fiber, total dietary", unit: "g" },
  FOLDFE: { label: "Folate, DFE", unit: "µg" },
  FOLFD: { label: "Folate, food", unit: "µg" },
  FOLAC: { label: "Folic acid", unit: "µg" },
  FE: { label: "Iron, Fe", unit: "mg" },
  MG: { label: "Magnesium", unit: "mg" },
  NIA: { label: "Niacin", unit: "mg" },
  P: { label: "Phosphorus, P", unit: "mg" },
  K: { label: "Potassium, K", unit: "mg" },
  PROCNT: { label: "Protein", unit: "g" },
  RIBF: { label: "Riboflavin", unit: "mg" },
  NA: { label: "Sodium, Na", unit: "mg" },
  "Sugar.alcohol": { label: "Sugar alcohols", unit: "g" },
  SUGAR: { label: "Sugars, total", unit: "g" },
  THIA: { label: "Thiamin", unit: "mg" },
  FAT: { label: "Total lipid (fat)", unit: "g" },
  VITA_RAE: { label: "Vitamin A, RAE", unit: "µg" },
  VITB12: { label: "Vitamin B-12", unit: "µg" },
  VITB6A: { label: "Vitamin B-6", unit: "mg" },
  VITC: { label: "Vitamin C, total ascorbic acid", unit: "mg" },
  VITD: { label: "Vitamin D (D2 + D3)", unit: "µg" },
  TOCPHA: { label: "Vitamin E (alpha-tocopherol)", unit: "mg" },
  VITK1: { label: "Vitamin K (phylloquinone)", unit: "µg" },
  WATER: { label: "Water", unit: "g" },
  ZN: { label: "Zinc, Zn", unit: "mg" }
};

export const TrackedGoalsProvider = ({ children }) => {
  const [trackedNutrients, setTrackedNutrients] = useState(defaultTracked);
  const [goals, setGoals] = useState({
    ENERC_KCAL: 2000,
    PROCNT: 100,
    CHOCDF: 250,
    FAT: 70,
  });

  const addTrackedNutrient = (nutrientCode) => {
    if (!trackedNutrients.includes(nutrientCode)) {
        setTrackedNutrients([...trackedNutrients, nutrientCode]);

        // Set a default goal (or 0 if unknown)
        setGoals(prev => ({
        ...prev,
        [nutrientCode]: 0
        }));
    }};


  const removeTrackedNutrient = (nutrientCode) => {
    setTrackedNutrients(trackedNutrients.filter(n => n !== nutrientCode));
    const updated = { ...goals };
    delete updated[nutrientCode];
    setGoals(updated);
  };

  return (
    <TrackedGoalsContext.Provider value={{
        trackedNutrients,
        goals,
        setGoals,
        addTrackedNutrient,
        removeTrackedNutrient,
        TARGET_NUTRIENTS
    }}>
      {children}
    </TrackedGoalsContext.Provider>
  );
};

export const useTrackedGoals = () => useContext(TrackedGoalsContext);
