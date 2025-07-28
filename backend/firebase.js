
const admin = require('firebase-admin');

// Load service account credentials from the path specified in the environment variable
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Initialize Firebase Admin SDK with service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Create a Firestore database instance
const db = admin.firestore();

// Export the Firestore instance for use in other parts of the app
module.exports = db;
