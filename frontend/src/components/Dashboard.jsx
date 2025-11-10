
import React, { useState, useEffect } from 'react';
import { getUserDetails, getCurrentUser, logout } from '../services/authService';
import { getLessons } from '../services/lessonService';
import { getExercises } from '../services/exerciseService';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                
                const userData = await getUserDetails();
                setUser(userData);

                
                const [lessonsData, exercisesData] = await Promise.all([
                    getLessons(),
                    getExercises()
                ]);

                setLessons(lessonsData.lessons || []);
                setExercises(exercisesData.exercises || []);
            } catch (error) {
                console.error("Failed to fetch data", error);
                setError('Failed to load data. Please check your connection.');
                
                
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        logout();
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="alert alert-danger text-center">
                            <h4>Error</h4>
                            <p>{error}</p>
                            <button onClick={() => window.location.reload()} className="btn btn-primary">
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentUser = user || getCurrentUser();

    return (
        <div className="container mt-4">
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 rounded shadow">
                <div className="container-fluid">
                    <span className="navbar-brand fw-bold">
                        <i className="fas fa-graduation-cap me-2"></i>
                        School Platform
                    </span>
                    <div className="navbar-nav ms-auto">
                        <div className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown">
                                <i className="fas fa-user me-1"></i>
                                {currentUser?.name}
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <button onClick={handleLogout} className="dropdown-item text-danger">
                                        <i className="fas fa-sign-out-alt me-2"></i>
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Welcome Message */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="alert alert-info border-0 shadow-sm">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-user-circle fa-2x me-3"></i>
                            <div>
                                <h4 className="alert-heading mb-1">Welcome, {currentUser?.name}!</h4>
                                <p className="mb-0">You are logged in as a <strong className="text-capitalize">{currentUser?.role}</strong>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions and Statistics */}
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">
                                <i className="fas fa-bolt me-2"></i>
                                Quick Actions
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <a href="/lessons" className="btn btn-outline-primary btn-lg">
                                    <i className="fas fa-book me-2"></i>
                                    View All Lessons
                                </a>
                                <a href="/exercises" className="btn btn-outline-primary btn-lg">
                                    <i className="fas fa-tasks me-2"></i>
                                    View All Exercises
                                </a>
                                {currentUser?.role === 'teacher' && (
                                    <>
                                        <a href="/lessons/create" className="btn btn-success btn-lg">
                                            <i className="fas fa-plus me-2"></i>
                                            Create New Lesson
                                        </a>
                                        <a href="/exercises/create" className="btn btn-success btn-lg">
                                            <i className="fas fa-plus-circle me-2"></i>
                                            Create New Exercise
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">
                                <i className="fas fa-chart-bar me-2"></i>
                                Statistics
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-6">
                                    <div className="p-3">
                                        <h2 className="text-primary">{lessons.length}</h2>
                                        <p className="mb-0 text-muted">Total Lessons</p>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="p-3">
                                        <h2 className="text-success">{exercises.length}</h2>
                                        <p className="mb-0 text-muted">Total Exercises</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Content */}
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-warning text-dark">
                            <h5 className="mb-0">
                                <i className="fas fa-clock me-2"></i>
                                Recent Lessons
                            </h5>
                        </div>
                        <div className="card-body">
                            {lessons.slice(0, 5).map(lesson => (
                                <div key={lesson.id} className="mb-3 p-3 border rounded">
                                    <h6 className="mb-1">{lesson.title}</h6>
                                    <small className="text-muted d-block">
                                        Subject: {lesson.subject} | Level: {lesson.level}
                                    </small>
                                    <a href={`/lessons/${lesson.id}`} className="btn btn-sm btn-outline-primary mt-2">
                                        View Details
                                    </a>
                                </div>
                            ))}
                            {lessons.length === 0 && (
                                <p className="text-muted text-center">No lessons available.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0">
                                <i className="fas fa-list me-2"></i>
                                Recent Exercises
                            </h5>
                        </div>
                        <div className="card-body">
                            {exercises.slice(0, 5).map(exercise => (
                                <div key={exercise.id} className="mb-3 p-3 border rounded">
                                    <h6 className="mb-1">{exercise.title}</h6>
                                    <small className="text-muted d-block">
                                        Points: {exercise.points} | Level: {exercise.level}
                                    </small>
                                    <a href={`/exercises/${exercise.id}`} className="btn btn-sm btn-outline-primary mt-2">
                                        View Details
                                    </a>
                                </div>
                            ))}
                            {exercises.length === 0 && (
                                <p className="text-muted text-center">No exercises available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;