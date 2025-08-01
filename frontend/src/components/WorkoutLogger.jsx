import React, { useState, useEffect } from 'react';

function WorkoutLogger({ phone, selectedExerciseName, onWorkoutLogged }) {
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [message, setMessage] = useState('');

  const isDisabled = !phone;

  useEffect(() => {
    if (selectedExerciseName) {
      setExerciseName(selectedExerciseName);
    }
  }, [selectedExerciseName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!exerciseName || !sets || !reps || !weight) {
      setMessage('⚠️ Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/workoutLogs', {
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

        // trigger refresh in WorkoutHistory
        if (onWorkoutLogged) {
          onWorkoutLogged();
        }
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error.');
    }
  };

  return (
    <div>
      <h2>Workout Logger</h2>
      <h4>Log a Workout</h4>

      {isDisabled && (
        <p style={{ color: 'crimson' }}>
          ⚠️ Please create or load a profile to use the workout logger.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Exercise Name:
          <input
            type="text"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            disabled={isDisabled}
          />
        </label>
        <br />
        <label>
          Sets:
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            disabled={isDisabled}
          />
        </label>
        <br />
        <label>
          Reps:
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            disabled={isDisabled}
          />
        </label>
        <br />
        <label>
          Weight (lbs):
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            disabled={isDisabled}
          />
        </label>
        <br />
        <button type="submit" disabled={isDisabled}>Log Workout</button>
      </form>

      {message && (
        <p style={{ marginTop: '1rem', color: message.startsWith('✅') ? 'green' : 'crimson' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default WorkoutLogger;
