import React, { useState, useEffect } from 'react';
import MealAnalyzer from './components/MealAnalyzer';
import ExerciseSearch from './components/ExerciseSearch';
import CreateProfile from './components/CreateProfile';
import WorkoutLogger from './components/WorkoutLogger';
import WorkoutHistory from './components/WorkoutHistory';

function App() {
  const [selectedExerciseName, setSelectedExerciseName] = useState('');
  const [phone, setPhone] = useState(localStorage.getItem('phone') || null);

  const [refreshKey, setRefreshKey] = useState(0); // new state

  useEffect(() => {
    const storedPhone = localStorage.getItem('phone');
    if (storedPhone) setPhone(storedPhone);
  }, []);

  const handleProfileCreated = (id) => {
    setPhone(id);
  };

  // Triggered after a new workout is logged
  const handleWorkoutLogged = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="App">
      <h1>HealthMate</h1>

      <CreateProfile onProfileCreated={handleProfileCreated} />

      <section style={{ paddingBottom: '2rem' }}>
        <h2>Meal Analyzer</h2>
        <MealAnalyzer />
      </section>

      <section>
        <h2>Exercise Search</h2>
        <ExerciseSearch onSelectExercise={setSelectedExerciseName} />
      </section>

      <section>
        <h2>Workout Logger</h2>
        <WorkoutLogger
          selectedExerciseName={selectedExerciseName}
          phone={phone}
          onWorkoutLogged={handleWorkoutLogged} // passed here
        />
      </section>

      <section>
        <WorkoutHistory
          phone={phone}
          refreshTrigger={refreshKey} // passed here
        />
      </section>
    </div>
  );
}

export default App;
