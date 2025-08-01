// Fitness goal definitions with associated fuzzy keywords

const workoutGoals = [
  {
    id: "muscle-building",
    label: "Muscle Building",
    keywords: ["curl", "press", "raise", "row", "squat", "bench", "extension", "fly", "pullover", "deadlift", "pull-up"]
  },
  {
    id: "strength-training",
    label: "Strength Training",
    keywords: ["press", "pull", "squat", "lift", "row", "snatch", "clean", "bench", "barbell", "deadlift"]
  },
  {
    id: "core-strength",
    label: "Core Strength / Abs",
    keywords: ["plank", "sit-up", "crunch", "leg raise", "knee raise", "core", "abs", "ab"]
  },
  {
    id: "cardio",
    label: "Cardio / Endurance",
    keywords: ["run", "jump", "sprint", "climber", "burpee", "mountain", "step", "high knees", "skipping"]
  },
  {
    id: "calisthenics",
    label: "Calisthenics / Bodyweight",
    keywords: ["push-up", "pull-up", "dips", "squat", "lunge", "handstand", "plank", "bodyweight"]
  },
  {
    id: "mobility",
    label: "Mobility / Flexibility",
    keywords: ["stretch", "mobility", "hip opener", "rotation", "bend", "cat", "cow", "cobra", "child"]
  },
  {
    id: "weight-loss",
    label: "Weight Loss",
    keywords: ["jump", "burpee", "run", "step", "mountain", "high knees", "cardio"]
  },
  {
    id: "fat-loss",
    label: "Fat Loss",
    keywords: ["jump", "burpee", "mountain", "fast", "sprint", "high knees"]
  },
  {
    id: "crossfit",
    label: "CrossFit / HIIT",
    keywords: ["snatch", "clean", "burpee", "jump", "kettlebell", "slam", "push press"]
  },
  {
    id: "agility",
    label: "Agility Training",
    keywords: ["ladder", "hop", "shuffle", "zig zag", "cone", "quick feet"]
  }
];

// Export dropdown options
export const GOALS_WITH_LABELS = workoutGoals.map(goal => ({
  id: goal.id,
  label: goal.label
}));

// Export just the list of goal IDs
export const GOALS = workoutGoals.map(goal => goal.id);

// Export matching function
export function matchExercisesToGoal(exercises, selectedGoalId) {
  const goal = workoutGoals.find(g => g.id === selectedGoalId);
  if (!goal) return [];

  return exercises.filter(ex => {
    const name = ex.name.toLowerCase();
    return goal.keywords.some(keyword => name.includes(keyword));
  });
}
