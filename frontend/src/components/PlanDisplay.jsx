import React from 'react';

/**
 * Removes all HTML tags from a string.
 *
 * @param {string} html - Raw HTML string
 * @returns {string} Plain text
 */
function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

/**
 * PlanDisplay Component
 * Displays a 7-day workout plan in a table format.
 *
 * @param {Array} weeklyPlan - Array of 7 days, each containing exercise objects
 * @returns {JSX.Element|null} Formatted table of exercises or null if empty
 */
const PlanDisplay = ({ weeklyPlan }) => {
  if (!weeklyPlan.length) return null;

  return (
    <div className="mt-6">

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
                {/* Only display the day name once per group using rowSpan */}
                {exIdx === 0 && (
                  <td
                    rowSpan={day.exercises.length}
                    style={{
                      fontWeight: 'bold',
                      padding: '10px',
                      verticalAlign: 'top',
                    }}
                  >
                    {day.day}
                  </td>
                )}

                <td style={{ padding: '10px', fontWeight: 600 }}>{ex.name}</td>
                <td style={{ padding: '10px' }}>{stripHtml(ex.description)}</td>
                <td style={{ padding: '10px' }}>
                  {ex.image ? (
                    <img
                      src={ex.image}
                      alt={ex.name}
                      style={{ width: '100px', borderRadius: '8px' }}
                    />
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
