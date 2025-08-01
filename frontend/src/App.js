import React, { useState, useEffect } from 'react';
import MealAnalyzer from './components/MealAnalyzer';
import ExerciseSearch from './components/ExerciseSearch';
import CreateProfile from './components/CreateProfile';
import WorkoutLogger from './components/WorkoutLogger';
import WorkoutHistory from './components/WorkoutHistory';

function App() {
  const [selectedExerciseName, setSelectedExerciseName] = useState('');
  const [phone, setPhone] = useState(localStorage.getItem('phone') || null); // only use phone

  useEffect(() => {
    const storedPhone = localStorage.getItem('phone'); // must match key used in CreateProfile
    if (storedPhone) setPhone(storedPhone);
  }, []);

  const handleProfileCreated = (id) => {
    setPhone(id); // update phone on profile creation
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
        />
      </section>

      <section>
        <WorkoutHistory phone={phone} />
      </section>
    </div>
  );
}

export default App;
