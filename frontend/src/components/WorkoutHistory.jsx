import React, { useState, useEffect } from 'react';

function WorkoutHistory({ phone }) {
  const [logs, setLogs] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Optional: reset logs if phone changes (e.g., new profile loaded)
  useEffect(() => {
    setLogs([]);
    setVisible(false);
  }, [phone]);

  const fetchLogs = async () => {
    if (!phone) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/workoutLogs/${phone}`);
      const data = await res.json();
      setLogs(data);
      setVisible(true);
    } catch (err) {
      console.error('Failed to fetch workout logs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <button onClick={fetchLogs} disabled={!phone || loading}>
        {loading ? 'Loading...' : 'Show Workout Logs'}
      </button>

      {visible && logs.length > 0 && (
        <div>
          <h3>Workout History</h3>
          <ul>
            {logs.map((log, index) => (
              <li key={index}>
                <strong>{log.exerciseName}</strong> – {log.sets} sets x {log.reps} reps @ {log.weight} lbs on {log.date}
              </li>
            ))}
          </ul>
        </div>
      )}

      {visible && logs.length === 0 && <p>No workout logs found.</p>}
    </div>
  );
}

export default WorkoutHistory;
