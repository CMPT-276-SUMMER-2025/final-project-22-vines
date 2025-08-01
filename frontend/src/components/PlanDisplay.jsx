import React from 'react';

const PlanDisplay = ({ weeklyPlan }) => {
  if (!weeklyPlan.length) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Your 7-Day Workout Plan</h2>
      {weeklyPlan.map((day, index) => (
        <div key={index} className="mb-4 p-4 border rounded shadow">
          <h3 className="text-lg font-semibold">{day.day}</h3>
          <ul className="list-disc ml-6">
            {day.exercises.map((ex, i) => (
              <li key={i}>
                <strong>{ex.name}</strong> – {ex.description?.slice(0, 100)}...
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PlanDisplay;
