import React from 'react';
import { GOALS_WITH_LABELS } from '../utils/goals';

/**
 * GoalSelector Component
 * Dropdown UI to let the user select a fitness goal from a predefined list.
 *
 * @param {string} selectedGoal - Currently selected goal
 * @param {Function} setSelectedGoal - Setter function to update selected goal
 */
const GoalSelector = ({ selectedGoal, setSelectedGoal }) => {
  return (
    <div className="my-4">
      <label htmlFor="goal-select">Select Your Fitness Goal:</label>
      <select
        id="goal-select"
        value={selectedGoal}
        onChange={(e) => setSelectedGoal(e.target.value)}
        className="border p-2 ml-2"
      >
        <option value="">-- Choose a goal --</option>
        {GOALS_WITH_LABELS.map((goal) => (
          <option key={goal.id} value={goal.id}>
            {goal.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GoalSelector;
