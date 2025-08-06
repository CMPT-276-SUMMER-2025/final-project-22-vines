import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoalSelector from './GoalSelector';
import PlanDisplay from './PlanDisplay';
import { matchExercisesToGoal } from '../utils/goals';
import printIcon from "../assets/buttons/print.svg";

/**
 * WeeklyPlanGenerator Component:
 * Allows users to select a fitness goal and generates a beginner-friendly
 * 7-day workout plan based on that goal using Wger exercise data.
 */
const WeeklyPlanGenerator = () => {
  const [selectedGoal, setSelectedGoal] = useState('');
  const [allExercises, setAllExercises] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch all available exercises on component mount
   */
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await axios.get('/api/weeklyplan/exercises');
        setAllExercises(res.data);
      } catch (err) {
        console.error('Error fetching exercises:', err.message);
      }
    };

    fetchExercises();
  }, []);

  /**
   * Build weekly plan when a goal is selected and data is ready
   */
  useEffect(() => {
    if (!selectedGoal || allExercises.length === 0) return;

    const buildPlan = async () => {
      // Filter and prioritize exercises based on goal and data quality
      const matched = matchExercisesToGoal(allExercises, selectedGoal);
      const withImages = matched.filter(ex => ex.image && ex.description?.trim());
      const withoutImages = matched.filter(ex => !ex.image || !ex.description?.trim());
      const prioritized = [...withImages, ...withoutImages];

      // Create a 7-day plan, with 2 exercises per day
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

    // Reset and show spinner briefly before rebuilding plan
    setWeeklyPlan([]);
    setLoading(true);
    setTimeout(buildPlan, 100); // Let spinner render
  }, [selectedGoal, allExercises]);

  /**
   * Opens browser print dialog to print the workout plan
   */
  const handlePrint = () => {
    const printContents = document.getElementById('printable')?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    const doc = printWindow.document;

    const html = doc.createElement('html');
    const head = doc.createElement('head');
    const title = doc.createElement('title');
    title.innerText = 'Workout Plan';
    head.appendChild(title);

    const body = doc.createElement('body');
    body.innerHTML = printContents;

    html.appendChild(head);
    html.appendChild(body);

    doc.documentElement.replaceWith(html);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="generatePlan">
      <div className="goalSelector">
        <h2>Select Your Plan</h2>
        {/* Goal selector dropdown */}
        <GoalSelector
          selectedGoal={selectedGoal}
          setSelectedGoal={(goal) => {
            setSelectedGoal(goal);
            setLoading(true); // Show spinner immediately
          }}
        />
      </div>
      
      <div className="workoutPlanContainer">
        <h2>Workout Plan</h2>
        {!selectedGoal ? (
          <p className="planPlaceholder">
            Select a goal to generate a plan for the week.
          </p>
        ) : loading ? (
          <p className="planPlaceholder">
            Generating your training plan for the week...
          </p>
        ) : (
          <>
            {/* Show print button only when plan is generated */}
            {weeklyPlan.length > 0 && (
              <button className="printButton" onClick={handlePrint}>
                <img src={printIcon} alt="Button Icon" className="buttonIcon"/>
                Print This Plan
              </button>
            )}

            {/* Display the plan */}
            <div id="printable" className="workoutPlan">
              <PlanDisplay weeklyPlan={weeklyPlan} />
            </div>
          </>
        )}
      </div>
      
      <div className="rightSpacer"/>
    </div>
  );
};

export default WeeklyPlanGenerator;
