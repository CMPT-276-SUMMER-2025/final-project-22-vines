import React from 'react';
import { GOALS_WITH_LABELS } from '../utils/goals';

/**
 * GoalSelector Component
 * Button UI to let the user select a fitness goal from a predefined list.
 */
const GoalSelector = ({ selectedGoal, setSelectedGoal }) => {
  return (
    <div className="goal-button-group">
      {GOALS_WITH_LABELS.map((goal) => (
        <button
          key={goal.id}
          onClick={() => setSelectedGoal(goal.id)}
          className={`goal-button ${selectedGoal === goal.id ? 'active' : ''}`}
        >
          {goal.label}
        </button>
      ))}
    </div>
  );
};

export default GoalSelector;
