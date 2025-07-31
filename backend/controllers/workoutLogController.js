const db = require('../firebase');

// POST /api/workouts
exports.saveWorkoutLog = async (req, res) => {
  const { userId, exerciseName, sets, reps, weight, date } = req.body;

  // Validate required fields
  if (!userId || !exerciseName || !sets || !reps || !weight) {
    return res.status(400).json({ error: 'Missing required workout log fields.' });
  }

  try {
    // Save the workout log to Firestore
    const docRef = await db.collection('workoutLogs').add({
      userId,
      exerciseName,
      sets,
      reps,
      weight,
      date: date || new Date().toISOString() // fallback if date is missing
    });

    res.status(201).json({
      id: docRef.id,
      message: 'Workout log saved successfully.'
    });
  } catch (error) {
    console.error('Error saving workout log:', error);
    res.status(500).json({ error: 'Failed to save workout log.' });
  }
};
