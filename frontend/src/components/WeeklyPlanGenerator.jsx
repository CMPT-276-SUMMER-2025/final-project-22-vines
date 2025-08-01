
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoalSelector from './GoalSelector';
import PlanDisplay from './PlanDisplay';
import { matchExercisesToGoal } from '../utils/goals';

const WeeklyPlanGenerator = () => {
  const [selectedGoal, setSelectedGoal] = useState('');
  const [allExercises, setAllExercises] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await axios.get('/api/weeklyplan/exercises'); // Your backend endpoint
        setAllExercises(res.data);
      } catch (err) {
        console.error('Error fetching exercises:', err);
      }
    };
    fetchExercises();
  }, []);

  useEffect(() => {
    if (!selectedGoal) return;

    const matched = matchExercisesToGoal(allExercises, selectedGoal);
    const plan = [];

    for (let i = 0; i < 7; i++) {
      const dayExercises = matched.slice(i * 2, i * 2 + 2); // 2 per day
      if (dayExercises.length < 2) break;
      plan.push({
        day: `Day ${i + 1}`,
        exercises: dayExercises,
      });
    }

    setWeeklyPlan(plan);
  }, [selectedGoal, allExercises]);

  return (
    <div>
      <GoalSelector selectedGoal={selectedGoal} setSelectedGoal={setSelectedGoal} />
      <PlanDisplay weeklyPlan={weeklyPlan} />
    </div>
  );
};

export default WeeklyPlanGenerator;
