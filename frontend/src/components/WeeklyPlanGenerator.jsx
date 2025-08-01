import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoalSelector from './GoalSelector';
import PlanDisplay from './PlanDisplay';
import { matchExercisesToGoal } from '../utils/goals';

const WeeklyPlanGenerator = () => {
  const [selectedGoal, setSelectedGoal] = useState('');
  const [allExercises, setAllExercises] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all exercises on mount
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await axios.get('/api/weeklyplan/exercises');
        setAllExercises(res.data);
      } catch (err) {
        console.error('Error fetching exercises:', err);
      }
    };
    fetchExercises();
  }, []);

  // Rebuild plan when goal is selected
  useEffect(() => {
    if (!selectedGoal || allExercises.length === 0) return;

    const buildPlan = async () => {
      const matched = matchExercisesToGoal(allExercises, selectedGoal);
      const withImages = matched.filter(ex => ex.image && ex.description?.trim());
      const withoutImages = matched.filter(ex => !ex.image || !ex.description?.trim());
      const prioritized = [...withImages, ...withoutImages];

      const plan = [];
      for (let i = 0; i < 7; i++) {
        const dayExercises = prioritized.slice(i * 2, i * 2 + 2);
        if (dayExercises.length < 2) break;
        plan.push({
          day: `Day ${i + 1}`,
          exercises: dayExercises,
        });
      }

      setWeeklyPlan(plan);
      setLoading(false);
    };

    // Start spinner immediately
    setWeeklyPlan([]);
    setLoading(true);
    setTimeout(buildPlan, 100); // allow spinner to render
  }, [selectedGoal, allExercises]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <GoalSelector
        selectedGoal={selectedGoal}
        setSelectedGoal={(goal) => {
          setSelectedGoal(goal);
          setLoading(true); // show spinner immediately
        }}
      />

      {loading ? (
        <p style={{ fontStyle: 'italic', padding: '1rem' }}>
          Generating your 7-Day Training Plan...
        </p>
      ) : (
        <>
          {weeklyPlan.length > 0 && (
            <button
              onClick={handlePrint}
              style={{
                margin: '1rem 0',
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              🖨️ Print This Plan
            </button>
          )}

          <div id="printable">
            <PlanDisplay weeklyPlan={weeklyPlan} />
          </div>
        </>
      )}
    </div>
  );
};

export default WeeklyPlanGenerator;
