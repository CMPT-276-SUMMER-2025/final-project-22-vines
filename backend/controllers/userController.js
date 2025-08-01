const admin = require('firebase-admin');
const db = admin.firestore();

exports.createUser = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Check if user already exists
    const userRef = db.collection('users').doc(phone);
    const doc = await userRef.get();

    if (!doc.exists) {
      // Create user if not exists
      await userRef.set({ phone });
    }

    res.status(200).json({ id: phone }); // Send back phone as ID
  } catch (err) {
    console.error('Error creating/loading user:', err);
    res.status(500).json({ error: 'Server error while creating/loading user' });
  }
};
