const { db } = require('../firebase');

/**
 * @route POST /api/workoutLogs
 * @desc Logs a new workout session to Firestore
 * @body {string} phone - Phone number identifying the user
 * @body {string} exerciseName - Name of the exercise performed
 * @body {number} sets - Number of sets performed
 * @body {number} reps - Number of reps per set
 * @body {number} weight - Weight used (if applicable)
 * @returns {Object} JSON confirmation message
 */
exports.logWorkout = async (req, res) => {
  try {
    const { phone, exerciseName, sets, reps, weight } = req.body;

    // Validate all required fields
    if (!phone || !exerciseName || !sets || !reps || !weight) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Construct workout log object
    const log = {
      phone,
      exerciseName,
      sets,
      reps,
      weight,
      timestamp: new Date().toISOString()
    };

    // Save log to Firestore
    await db.collection('workoutLogs').add(log);
    res.status(201).json({ message: 'Workout logged successfully' });

  } catch (err) {
    console.error('Error logging workout:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * @route GET /api/workoutLogs/:phone
 * @desc Retrieves all workout logs associated with a given phone number
 * @param {string} req.params.phone - Phone number to filter logs
 * @returns {Array} Array of workout log objects
 */
exports.getWorkoutLogs = async (req, res) => {
  try {
    const phone = req.params.phone;

    // Query logs in Firestore where phone number matches
    const logsSnapshot = await db.collection('workoutLogs')
      .where('phone', '==', phone)
      .get();

    // Convert Firestore documents to plain JS objects
    const logs = logsSnapshot.docs.map(doc => doc.data());

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching workout logs:', error.message);
    res.status(500).json({ error: 'Server error while fetching logs' });
  }
};
