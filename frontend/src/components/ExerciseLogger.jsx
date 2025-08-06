import React, { useState, useEffect } from 'react';
import CreateProfile from './CreateProfile';
import WorkoutLogger from './WorkoutLogger';
import WorkoutHistory from './WorkoutHistory';
import "../css/LogExercise.css";

export default function ExerciseLogger() {
  const [selectedExerciseName, ] = useState('');
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
    <div className="logExercise">
      <div className="logForm">
        {/* Profile Section */}
        <h2>Load Profile</h2>
        <CreateProfile onProfileCreated={handleProfileCreated} />
        {/* Workout Entry Section */}
        <h2>Enter Your Exercise</h2>
        <WorkoutLogger
          selectedExerciseName={selectedExerciseName}
          phone={phone}
          onWorkoutLogged={handleWorkoutLogged}
        />
      </div>
      <div className="exerciseHistoryContainer">
        <h2>Exercise History</h2>
        <WorkoutHistory
          phone={phone}
          refreshTrigger={refreshKey}
        />
      </div>
      <div className="rightSpacer"/>
    </div>
  );
}