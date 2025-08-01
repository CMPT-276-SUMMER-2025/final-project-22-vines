# HealthMate Backend

This directory contains the Express.js backend for HealthMate.

## Features

- Analyze meals via Edamam Nutrition Analysis API
- Store latest meal log in Firebase Firestore
- Handle workout logging (sets, reps, weight)
- Fetch workout history based on user phone number

## Tech Stack

- Node.js
- Express.js
- Firebase Admin SDK
- Edamam Nutrition API

## Setup Instructions

1. Navigate to backend:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file with the following content:

```
EDAMAM_APP_ID=your_edamam_app_id
EDAMAM_API_KEY=your_edamam_api_key
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
PORT=5000
```

4. Place your Firebase service account JSON as `serviceAccountKey.json`

5. Start the backend server:

```bash
node server.js
```

## Routes

- `POST /api/edamam/analyze`: Analyze a meal using Edamam
- `GET /api/edamam/logs/:userId`: Retrieve saved meal logs
- `POST /api/workoutLogs`: Log a workout session
- `GET /api/workoutLogs/:phone`: Retrieve workout logs for user

## Notes

- Backend runs on port `5000` by default
- Ensure CORS is enabled if testing frontend separately