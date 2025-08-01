const admin = require('firebase-admin');
const db = admin.firestore();

exports.logWorkout = async (req, res) => {
  try {
    const { userEmail, exerciseName, sets, reps, weight, date } = req.body;

    if (!userEmail || !exerciseName || !sets || !reps || !weight || !date) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const log = {
      userEmail,
      exerciseName,
      sets,
      reps,
      weight,
      date,
      timestamp: new Date().toISOString()
    };

    await db.collection('workoutLogs').add(log);
    res.status(201).json({ message: 'Workout logged successfully' });

  } catch (err) {
    console.error('Error logging workout:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getWorkoutLogs = async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const snapshot = await db.collection('workoutLogs')
      .where('userEmail', '==', userEmail)
      .orderBy('date', 'desc') // optional
      .get();

    const logs = snapshot.docs.map(doc => doc.data());
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workout logs' });
  }
};