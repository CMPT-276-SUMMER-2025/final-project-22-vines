import { useState } from 'react';
import { useTrackedGoals } from '../contexts/TrackedGoalsContext';
import NavBar from '../components/NavBar'
import '../css/Settings.css'

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

const DEFAULT_GOALS = {
  ENERC_KCAL: 2000,
  PROCNT: 50,
  CHOCDF: 250,
  FAT: 70,
};


function Settings() {
  const { goals, setGoals, addTrackedNutrient, removeTrackedNutrient } = useTrackedGoals();
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('diet');

  return (
    <>
      <NavBar />
      <div className="settings">
        <div className="settingsTabs">
            <button
                className={activeTab === 'diet' ? 'tabButton active' : 'tabButton'}
                onClick={() => setActiveTab('diet')}
            >
                Diet Goals
            </button>
            <button
                className={activeTab === 'activity' ? 'tabButton active' : 'tabButton'}
                onClick={() => setActiveTab('activity')}
            >
                Activity Preferences
            </button>
        </div>

        <div className="tabsContent">
          {activeTab === 'diet' && (
            <div className="dietGoals">
            <table className="goalTable">
              <thead>
                <tr>
                  <th></th>
                  <th>Nutrient</th>
                  <th>Goal</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(goals).map(([nutrient, value]) => (
                    <tr key={nutrient} className="goalRow">
                    <td>
                        <button
                        onClick={() => removeTrackedNutrient(nutrient)}
                        >
                        ✕
                        </button>
                    </td>
                    <td>{TARGET_NUTRIENTS[nutrient]?.label || nutrient}</td>
                    <td>
                        <input
                        type="number"
                        value={value}
                        onChange={(e) =>
                            setGoals({ ...goals, [nutrient]: Number(e.target.value) })
                        }
                        />
                        <span className="unit">
                        {TARGET_NUTRIENTS[nutrient]?.unit || ''}
                        </span>
                    </td>
                    </tr>
                ))}
                </tbody>

            </table>

            <button
              className="addNutrientBtn"
              onClick={() => setShowAdd(!showAdd)}
            >
              {showAdd ? 'Cancel' : '+ Add a nutrient'}
            </button>

            {showAdd && (
              <div className="addNutrientPanel">
                <input
                  type="text"
                  placeholder="Search nutrients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="nutrientSearch"
                />
                <ul className="nutrientList">
                  {Object.entries(TARGET_NUTRIENTS)
                    .filter(([code, { label }]) =>
                      label.toLowerCase().startsWith(searchTerm.toLowerCase())
                    )
                    .filter(([code]) => !(code in goals))
                    .map(([code, { label }]) => (
                      <li
                        key={code}
                        className="nutrientItem"
                        onClick={() => {
                          addTrackedNutrient(code);
                          setSearchTerm('');
                          setShowAdd(false);
                        }}
                      >
                        {label}
                      </li>
                    ))}
                  {Object.entries(TARGET_NUTRIENTS)
                    .filter(([code, { label }]) =>
                      label.toLowerCase().startsWith(searchTerm.toLowerCase())
                    )
                    .filter(([code]) => !(code in goals)).length === 0 && (
                      <li className="noResults">No nutrients found.</li>
                    )}
                </ul>
              </div>
            )}
          </div>
          )}
          {activeTab === 'activity' && (
            <div className="activityPreferences">
            <p>Work in progress.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


export default Settings