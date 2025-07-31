const db = require('../firebase');

function sanitizeEmail(email) {
  return email.toLowerCase().replace(/[^a-z0-9]/g, '');
}

exports.createOrLoadUser = async (req, res) => {
  const { name, email } = req.body;
  const sanitizedEmail = sanitizeEmail(email);

  try {
    const userRef = db.collection('users').doc(sanitizedEmail);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({ name, email });
    }

    res.status(200).json({ id: sanitizedEmail, name, email });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create/load user' });
  }
};
