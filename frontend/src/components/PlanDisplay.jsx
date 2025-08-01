import React from 'react';

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

const PlanDisplay = ({ weeklyPlan }) => {
  if (!weeklyPlan.length) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Your 7-Day Workout Plan</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid black' }}>
            <th style={{ padding: '10px' }}>Day</th>
            <th style={{ padding: '10px' }}>Exercise</th>
            <th style={{ padding: '10px' }}>Description</th>
            <th style={{ padding: '10px' }}>Image</th>
          </tr>
        </thead>
        <tbody>
          {weeklyPlan.map((day, dayIdx) =>
            day.exercises.map((ex, exIdx) => (
              <tr key={`${dayIdx}-${exIdx}`} style={{ borderBottom: '1px solid #ccc' }}>
                {exIdx === 0 && (
                  <td rowSpan={day.exercises.length} style={{ fontWeight: 'bold', padding: '10px', verticalAlign: 'top' }}>
                    {day.day}
                  </td>
                )}
                <td style={{ padding: '10px', fontWeight: 600 }}>{ex.name}</td>
                <td style={{ padding: '10px' }}>{stripHtml(ex.description)}</td>
                <td style={{ padding: '10px' }}>
                  {ex.image ? (
                    <img src={ex.image} alt={ex.name} style={{ width: '100px', borderRadius: '8px' }} />
                  ) : (
                    <em style={{ color: '#888' }}>No image</em>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PlanDisplay;
