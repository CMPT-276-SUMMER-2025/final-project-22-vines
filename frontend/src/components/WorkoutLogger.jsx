import React, { useState, useEffect } from 'react';

function WorkoutLogger({ selectedExerciseName, userId }) {
  const [exerciseName, setExerciseName] = useState(selectedExerciseName || '');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  // Sync exercise name when selected from search
  useEffect(() => {
    if (selectedExerciseName) {
      setExerciseName(selectedExerciseName);
    }
  }, [selectedExerciseName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!userId) {
      setMessage('Please create or load your profile first.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          exerciseName,
          sets: Number(sets),
          reps: Number(reps),
          weight: Number(weight),
          date: date || new Date().toISOString().split('T')[0],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Failed to log workout.');
      } else {
        setMessage('✅ Workout logged successfully!');
        if (!selectedExerciseName) setExerciseName('');
        setSets('');
        setReps('');
        setWeight('');
        setDate('');
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Server error while logging workout.');
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <form onSubmit={handleSubmit}>
        <label>
          Exercise Name:{' '}
          <input
            type="text"
            required
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            disabled={!!selectedExerciseName}
          />
        </label>
        <br />
        <label>
          Sets:{' '}
          <input
            type="number"
            required
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
        </label>
        <br />
        <label>
          Reps:{' '}
          <input
            type="number"
            required
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
        </label>
        <br />
        <label>
          Weight (lbs):{' '}
          <input
            type="number"
            required
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </label>
        <br />
        <label>
          Date:{' '}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Log Workout</button>
      </form>

      {message && (
        <p style={{ color: message.includes('✅') ? 'green' : 'crimson' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default WorkoutLogger;
