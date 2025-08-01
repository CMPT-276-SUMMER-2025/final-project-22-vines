const admin = require('firebase-admin');
const db = admin.firestore();

/**
 * @route POST /api/user
 * @desc Creates a user profile if it does not already exist, using phone number as ID
 * @body {string} phone - Phone number used as unique identifier
 * @returns {Object} JSON with the user ID
 */
exports.createUser = async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate that phone number is provided
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Reference to Firestore document with ID equal to phone number
    const userRef = db.collection('users').doc(phone);
    const doc = await userRef.get();

    // Create the user if it doesn't already exist
    if (!doc.exists) {
      await userRef.set({ phone });
    }

    // Respond with the user's phone as their ID
    res.status(200).json({ id: phone });
  } catch (err) {
    console.error('Error creating/loading user:', err.message);
    res.status(500).json({ error: 'Server error while creating/loading user' });
  }
};
