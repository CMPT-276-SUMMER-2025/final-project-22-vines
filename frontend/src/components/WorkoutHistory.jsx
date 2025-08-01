import React, { useState, useEffect } from 'react';

function WorkoutHistory({ phone, refreshTrigger }) {
  const [logs, setLogs] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    if (!phone) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/workoutLogs/${phone}`);
      const data = await res.json();

      // Sort logs by timestamp (latest first)
      const sortedLogs = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setLogs(sortedLogs);
      setVisible(true);
    } catch (err) {
      console.error('Failed to fetch workout logs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh logs when refreshTrigger changes (example after logging a workout)
useEffect(() => {
  if (!phone) return;

  setVisible(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/workoutLogs/${phone}`);
      const data = await res.json();
      const sortedLogs = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setLogs(sortedLogs);
    } catch (err) {
      console.error('Failed to fetch workout logs:', err);
    }
  };

  fetchLogs();
}, [refreshTrigger, phone]);



  // Reset logs when phone changes
  useEffect(() => {
    setLogs([]);
    setVisible(false);
  }, [phone]);

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
                <strong>{log.exerciseName}</strong> – {log.sets} sets × {log.reps} reps @ {log.weight} lbs on{' '}
                {new Date(log.timestamp).toLocaleString()}
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
