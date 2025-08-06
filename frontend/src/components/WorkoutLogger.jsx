import React, { useState, useEffect } from 'react';

/**
 * WorkoutLogger Component:
 * A form that allows users to log a workout (exercise name, sets, reps, weight)
 * Requires a valid user profile (phone) to be active.
 *
 * @param {string} phone - User's phone number (used as identifier)
 * @param {string} selectedExerciseName - Pre-filled exercise name (optional)
 * @param {Function} onWorkoutLogged - Callback to refresh workout history after logging
 */
function WorkoutLogger({ phone, selectedExerciseName, onWorkoutLogged }) {
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [message, setMessage] = useState('');

  const isDisabled = !phone; // Disable form if user has not loaded a profile

  // Pre-fill exercise name from selection (e.g., from ExerciseSearch)
  useEffect(() => {
    if (selectedExerciseName) {
      setExerciseName(selectedExerciseName);
    }
  }, [selectedExerciseName]);

  /**
   * Handles form submission:
   * Validates fields
   * Sends workout log to backend
   * Resets fields and triggers parent refresh
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!exerciseName || !sets || !reps || !weight) {
      setMessage('⚠️ Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/workoutLogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          exerciseName,
          sets: Number(sets),
          reps: Number(reps),
          weight: Number(weight),
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`❌ Error: ${data.error || 'Something went wrong.'}`);
      } else {
        setMessage('✅ Workout logged successfully!');
        setExerciseName('');
        setSets('');
        setReps('');
        setWeight('');

        // Notify parent to refresh workout history
        if (onWorkoutLogged) {
          onWorkoutLogged();
        }
      }
    } catch (err) {
      console.error('Workout logging error:', err.message);
      setMessage('❌ Server error.');
    }
  };

  return (
    <div>
      {/* Warning message if no profile is loaded */}
      {isDisabled && (
        <p style={{ color: 'crimson' }}>
          ⚠️ Please create or load a profile to use the workout logger.
        </p>
      )}

      <form className="exerciseForm" onSubmit={handleSubmit}>
        <label>
          Exercise Name
          <input
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            disabled={isDisabled}
            placeholder="e.g., Push Ups"
          />
        </label>

        <label>
          Sets
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            disabled={isDisabled}
            min="1"
          />
        </label>

        <label>
          Reps
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            disabled={isDisabled}
            min="1"
          />
        </label>

        <label>
          Weight (lbs)
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            disabled={isDisabled}
            min="0"
          />
        </label>

        <button type="submit" disabled={isDisabled}>
          Log Exercise
        </button>
      </form>

      {/* Show success or error message */}
      {message && (
        <p style={{ marginTop: '1rem', color: message.startsWith('✅') ? 'green' : 'crimson' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default WorkoutLogger;
