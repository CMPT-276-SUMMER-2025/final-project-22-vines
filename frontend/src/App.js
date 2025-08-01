import React, { useState, useEffect } from 'react';
import MealAnalyzer from './components/MealAnalyzer';
import ExerciseSearch from './components/ExerciseSearch';
import CreateProfile from './components/CreateProfile';
import WorkoutLogger from './components/WorkoutLogger';
import WorkoutHistory from './components/WorkoutHistory';

function App() {
  const [selectedExerciseName, setSelectedExerciseName] = useState('');
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || null);

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (storedId) setUserId(storedId);
  }, []);

  const handleProfileCreated = (user) => {
    setUserId(user.id);
    setUserEmail(user.email);
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
          userId={userId}
          userEmail={userEmail}
        />
      </section>

      <section>
        <WorkoutHistory userEmail={userEmail} />
      </section>
    </div>
  );
}

export default App;
