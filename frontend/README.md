# HealthMate Frontend

This directory contains the React frontend for HealthMate.

## Features

- User profile creation and local persistence
- Meal analysis UI with Edamam API integration
- Compatibility checker and nutrition tips
- Exercise search using Wger API
- Workout logging with Firebase
- Weekly workout plan generation based on fitness goal

## Tech Stack

- React.js (Create React App)
- Axios for API requests
- Firebase for workout log storage

## Setup Instructions

1. Navigate to frontend:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm start
```

App will open at `http://localhost:3000`

## Production Build

To build for production (removes warnings):

```bash
npm run build
```

## Notes

- Make sure `mealAPI.js` points to correct backend API URL (e.g. `http://localhost:5000/api/edamam`).
- Ensure the backend is running before using features like meal analysis and workout logging.