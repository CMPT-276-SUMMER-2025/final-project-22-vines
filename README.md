[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19722667&assignment_repo_type=AssignmentRepo)

[Project Tittle: HealthMate]
[22 Vines: Kiratpal Singh Johal ; Mohid Khan ; Justin Borgeson]

[HealthMate is a wellness-focused web application designed to help users track and manage their physical and mental health. The app includes essential features like sleep tracking, calorie intake monitoring, exercise logging, water intake reminders, and a daily to-do list for health tasks. Users can also create profiles and securely log in to monitor their progress over time. The main goal is to make health tracking easy and all in one place. Whether someone wants to reach fitness goals, eat better, or build healthy habits, HealthMate gives them simple tools to do that.]

Features Implemented
---------------------
- Analyze meals using Edamam API
- Aggregate nutritional info for user-entered ingredients
- Check meal compatibility against selected dietary labels
- Generate nutrition tips based on the meal content
- Log and view workout history using Firebase Firestore
- Search exercises using Wger API
- Generate beginner-friendly weekly workout plan by fitness goal
- Create and store user profiles locally

Project Structure
------------------
root/
├── backend/
│   ├── controllers/
│   │   ├── mealController.js
│   │   ├── workoutLogController.js
│   │   └── weeklyPlanController.js
│   ├── routes/
│   │   ├── edamamRoutes.js
│   │   ├── workoutLogRoutes.js
│   │   └── weeklyPlanRoutes.js
│   ├── firebase.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MealAnalyzer.jsx
│   │   │   ├── ExerciseSearch.jsx
│   │   │   ├── WorkoutLogger.jsx
│   │   │   ├── WorkoutHistory.jsx
│   │   │   ├── WeeklyPlanGenerator.jsx
│   │   │   ├── GoalSelector.jsx
│   │   │   └── CreateProfile.jsx
│   │   ├── utils/
│   │   │   ├── dietLabels.js
│   │   │   ├── nutritionTips.jsx
│   │   │   └── goals.js
│   │   ├── api/
│   │   │   ├── mealAPI.js
│   │   │   └── exerciseAPI.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md

How to Run Locally
------------------

1. Clone the repository

    git clone https://github.com/CMPT-276-SUMMER-2025/final-project-22-vines.git

    Open a terminal in VS.
    
    Install dependencies:
    npm install
    
    Type "cd backend" and hit enter, in order to go to the backend folder.

    After the installation create a .env file in /backend and copy paste the contents from .env file that is attached with Milestone 2 submission.

    Note: Each Edamam API key has a limit of 10 calls. If you don't the proper results from Edamam features please contact the project manager or generate your own Edamam API keys at https://www.edamam.com.

    Then create a JSON file as `serviceAccountKey.json` in /backend And copy paste the contents from serviceAccountKey.json file attached with Milestone 2 submission.

    Then in the terminal type "cd .." and hit enter to go to the root folder.
    Then type "cd frontend" and hit enter to go to the frontend folder.

    Then create a .env file in /frontend with the following content:

    REACT_APP_API_BASE_URL=http://localhost:5000
    VITE_BACKEND_URL=http://localhost:3001

    Then in the terminal type "cd .." and hit enter to go to the root folder again.

2. Backend Setup

    cd backend
    
    Install dependencies:

    npm install

    Start the backend server:

    node server.js

3. Frontend Setup

    cd ../frontend

    Install dependencies:

    npm install

    Start the frontend dev server:

    npm start

    The app should open at http://localhost:3000

Contact
--------
If you have any issues setting it up, please contact the team lead.
