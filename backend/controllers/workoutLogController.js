const { db } = require('../firebase');

exports.logWorkout = async (req, res) => {
  try {
    const { phone, exerciseName, sets, reps, weight, date } = req.body;

    if (!phone || !exerciseName || !sets || !reps || !weight || !date) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const log = {
      phone,
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
    const phone = req.params.phone;
    const logsSnapshot = await db.collection('workoutLogs')
      .where('phone', '==', phone)
      //.orderBy('date', 'desc') // optional
      .get();

    const logs = logsSnapshot.docs.map(doc => doc.data());
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching workout logs:', error);
    res.status(500).json({ error: 'Server error while fetching logs' });
  }
};