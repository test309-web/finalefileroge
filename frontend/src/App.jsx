
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Lessons from './components/Lessons';
import Exercises from './components/Exercises';
import LessonDetail from './components/LessonDetail';
import ExerciseDetail from './components/ExerciseDetail';
import CreateLesson from './components/CreateLesson';
import CreateExercise from './components/CreateExercise';
import { isAuthenticated } from './services/authService';

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // التحقق من حالة المصادقة عند تحميل التطبيق
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  if (!authChecked) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={!isAuth ? <Login /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/register" 
            element={!isAuth ? <Register /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuth ? <Dashboard /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/lessons" 
            element={isAuth ? <Lessons /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/lessons/create" 
            element={isAuth ? <CreateLesson /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/lessons/:id" 
            element={isAuth ? <LessonDetail /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/exercises" 
            element={isAuth ? <Exercises /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/exercises/create" 
            element={isAuth ? <CreateExercise /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/exercises/:id" 
            element={isAuth ? <ExerciseDetail /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;