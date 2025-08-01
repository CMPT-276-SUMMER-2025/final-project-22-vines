import React, { useState, useEffect } from 'react';
import MealAnalyzer from './components/MealAnalyzer';
import ExerciseSearch from './components/ExerciseSearch';
import CreateProfile from './components/CreateProfile';
import WorkoutLogger from './components/WorkoutLogger';
import WorkoutHistory from './components/WorkoutHistory';
import WeeklyPlanGenerator from './components/WeeklyPlanGenerator';
import './App.css';

/**
 * App Component:
 * Main container for the HealthMate application.
 * Coordinates user profile, meal analysis, exercise search, workout logging, and weekly plan.
 */
function App() {
  const [selectedExerciseName, setSelectedExerciseName] = useState('');
  const [phone, setPhone] = useState(localStorage.getItem('phone') || null);
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger refresh in WorkoutHistory

  /**
   * On initial mount, retrieve saved phone from localStorage (if available)
   */
  useEffect(() => {
    const storedPhone = localStorage.getItem('phone');
    if (storedPhone) setPhone(storedPhone);
  }, []);

  /**
   * Callback when user profile is created or loaded
   */
  const handleProfileCreated = (id) => {
    setPhone(id);
  };

  /**
   * Callback after a workout is logged, used to refresh WorkoutHistory
   */
  const handleWorkoutLogged = () => {
    setRefreshKey(prev => prev + 1); // Trigger re-render
  };

  return (
    <div className="App">
      <h1>HealthMate</h1>

      {/* Profile Section */}
      <CreateProfile onProfileCreated={handleProfileCreated} />

      {/* Meal Analysis Section */}
      <section style={{ paddingBottom: '2rem' }}>
        <h2>Meal Analyzer</h2>
        <MealAnalyzer />
      </section>

      {/* Exercise Search and Logging Section */}
      <section>
        <h2>Exercise Search</h2>
        <ExerciseSearch onSelectExercise={setSelectedExerciseName} />
      </section>

      <section>
        <h2>Workout Logger</h2>
        <WorkoutLogger
          selectedExerciseName={selectedExerciseName}
          phone={phone}
          onWorkoutLogged={handleWorkoutLogged}
        />
      </section>

      {/* Workout Log History */}
      <section>
        <WorkoutHistory
          phone={phone}
          refreshTrigger={refreshKey}
        />
      </section>

      {/* Weekly Workout Plan Generator */}
      <section>
        <h2>Weekly Workout Plan</h2>
        <WeeklyPlanGenerator />
      </section>
    </div>
  );
}

export default App;
