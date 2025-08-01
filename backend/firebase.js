const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // make sure this path and file exist

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = { db };
