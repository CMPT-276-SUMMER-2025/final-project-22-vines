import React from 'react';
import './css/index.css';
import reportWebVitals from './reportWebVitals';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import App from './App.jsx'
import { FoodLogProvider } from './contexts/FoodLogContext.jsx';
import { TrackedGoalsProvider } from './contexts/TrackedGoalsContext';
import { UserProvider } from './contexts/UserContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <TrackedGoalsProvider>
          <FoodLogProvider>
            <App />
          </FoodLogProvider>
        </TrackedGoalsProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



