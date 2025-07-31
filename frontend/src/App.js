import React, { useState } from 'react';
import MealAnalyzer from './components/MealAnalyzer';
import ExerciseSearch from './components/ExerciseSearch';
import CreateProfile from './components/CreateProfile';
import WorkoutLogger from './components/WorkoutLogger';

function App() {
  const [selectedExerciseName, setSelectedExerciseName] = useState('');
  const [userId, setUserId] = useState(null); // store user ID once profile is created/loaded

  return (
    <div className="App">
      <h1>HealthMate</h1>

      {/* Pass a callback to update userId when profile is created */}
      <CreateProfile onProfileCreated={(user) => setUserId(user.id)} />

      <section style={{ paddingBottom: '2rem' }}>
        <h2>Meal Analyzer</h2>
        <MealAnalyzer />
      </section>

      <section>
        <h2>Exercise Search</h2>
        <ExerciseSearch onSelectExercise={setSelectedExerciseName} />
      </section>

      {userId && (
        <section>
          <h2>Workout Logger</h2>
          <WorkoutLogger
            selectedExerciseName={selectedExerciseName}
            userId={userId}
          />
        </section>
      )}

      {!userId && (
        <p style={{ color: 'crimson', fontWeight: 'bold', marginLeft: '1rem' }}>
          Please create or load your profile to log workouts.
        </p>
      )}
    </div>
  );
}

export default App;
