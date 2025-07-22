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

// saving a meal log for a user
async function saveMealLog(userId, logData) {
  await db.collection('mealLogs').add({
    userId,
    ...logData,
    timestamp: new Date()
  });
}

// fetching logs for a user
async function getMealLogs(userId) {
  const snapshot = await db
    .collection('mealLogs')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

module.exports = {
  saveMealLog,
  getMealLogs,
};
