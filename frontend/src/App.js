
import React from 'react';
import MealAnalyzer from './components/MealAnalyzer';

/**
App Component: The main entry point of the React application.
 
OUTPUT:
Renders the application title and the MealAnalyzer component
 */
function App() {
  return (
    <div className="App">
      <h1>HealthMate - Meal Analyzer</h1>
      {/* Renders the core component for user input and meal analysis */}
      <MealAnalyzer />
    </div>
  );
}

export default App;
