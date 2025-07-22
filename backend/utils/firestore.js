const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize once
if (!admin.apps.length) {
  admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'healthmate-d5dc5'
});
}

const db = getFirestore();

// Save log anonymously
async function saveMealLog(logData) {
  await db.collection('mealLogs').add({
    ...logData,
    timestamp: new Date()
  });
}

// Fetch all logs (limited, since no userId filter)
async function getMealLogs() {
  const snapshot = await db
    .collection('mealLogs')
    .orderBy('timestamp', 'desc')
    .limit(10)
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

module.exports = {
  saveMealLog,
  getMealLogs,
};
