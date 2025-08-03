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
    <div className="exerciseHistory">
      {visible && logs.length === 0 && (
        <p>No workouts logged yet.</p>
      )}

      {visible && logs.length > 0 && (
        <ul>
          {logs.slice().map((log, index) => {
            const datetime = new Date(log.timestamp);
            const time = datetime.toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
            });
            const date = datetime.toLocaleDateString();

            return (
              <div key={index} className="exercise-entry">
                <div className="exercise-header">
                  <span className="exercise-time">{date}, {time}</span>
                </div>
                <div className="exercise-body">
                  <ul>
                    <li><strong>{log.exerciseName}</strong></li>
                    <li>• {log.sets} sets</li>
                    <li>• {log.reps} reps</li>
                    <li>• {log.weight} lbs</li>
                  </ul>
                </div>
              </div>
            );
          })}
        </ul>
      )}
    </div>

  );
}

export default WorkoutHistory;
