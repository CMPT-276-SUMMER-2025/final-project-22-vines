let db = {};
if(!global['__TEST__']){
  const admin = require('firebase-admin');

// Load Firebase service account credentials
// this file exists and is NOT committed to version control and is added to .gitignore
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK with service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Firestore database instance
const db = admin.firestore();

}
// Export Firestore instance for use in other parts of the app
module.exports = { db };

