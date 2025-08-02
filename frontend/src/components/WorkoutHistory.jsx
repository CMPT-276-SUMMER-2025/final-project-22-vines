import React, { useState, useEffect, useCallback } from 'react';

function WorkoutHistory({ phone, refreshTrigger }) {
  const [logs, setLogs] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // useCallback ensures stable reference for useEffect dependencies
  const fetchLogs = useCallback(async () => {
    if (!phone) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/workoutLogs/${phone}`);
      const data = await res.json();

      const sortedLogs = data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      setLogs(sortedLogs);
      setVisible(true);
    } catch (err) {
      console.error('Failed to fetch workout logs:', err);
    } finally {
      setLoading(false);
    }
  }, [phone]);

  // Fetch logs on refresh trigger (e.g., after logging a new workout)
  useEffect(() => {
    if (!phone) return;
    setVisible(true);
    fetchLogs();
  }, [refreshTrigger, phone, fetchLogs]);

  // Clear logs on phone change
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
