import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getExercises, deleteExercise } from '../services/exerciseService';
import { getCurrentUser } from '../services/authService';

const Exercises = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
        loadExercises();
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    const loadExercises = async () => {
        try {
            const exercisesData = await getExercises();
            setExercises(exercisesData.data || []);
        } catch (error) {
            console.error('Error loading exercises:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExercise = async (exerciseId) => {
        if (window.confirm('Are you sure you want to delete this exercise?')) {
            try {
                await deleteExercise(exerciseId);
                loadExercises();
            } catch (error) {
                alert('Error deleting exercise');
            }
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <button 
                        className="btn btn-outline-secondary mb-3"
                        onClick={handleBack}
                    >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back
                    </button>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1>
                            <i className="fas fa-tasks me-2"></i>
                            Exercises
                        </h1>
                        {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                            <Link to="/exercises/create" className="btn btn-primary">
                                <i className="fas fa-plus me-2"></i>
                                Create Exercise
                            </Link>
                        )}
                    </div>

                    <div className="row">
                        {exercises.map(exercise => (
                            <div key={exercise.id} className="col-md-6 col-lg-4 mb-4">
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{exercise.title}</h5>
                                        <p className="card-text text-muted">{exercise.description}</p>
                                        <div className="mb-2">
                                            <span className={`badge ${
                                                exercise.level === 'beginner' ? 'bg-success' : 
                                                exercise.level === 'intermediate' ? 'bg-warning' : 'bg-danger'
                                            } me-2`}>
                                                {exercise.level}
                                            </span>
                                            <span className="badge bg-info">
                                                {exercise.points} Points
                                            </span>
                                        </div>
                                        <p className="card-text">
                                            <small className="text-muted">
                                                By: {exercise.teacher?.name || 'Unknown'}
                                            </small>
                                        </p>
                                        {exercise.lesson && (
                                            <p className="card-text">
                                                <small className="text-muted">
                                                    Lesson: {exercise.lesson.title}
                                                </small>
                                            </p>
                                        )}
                                    </div>
                                    <div className="card-footer bg-transparent">
                                        <div className="d-flex justify-content-between">
                                            <Link 
                                                to={`/exercises/${exercise.id}`} 
                                                className="btn btn-outline-primary btn-sm"
                                            >
                                                View
                                            </Link>
                                            {(currentUser?.role === 'admin' || 
                                              (currentUser?.role === 'teacher' && exercise.teacher_id === currentUser.id)) && (
                                                <div>
                                                    <Link 
                                                        to={`/exercises/edit/${exercise.id}`}
                                                        className="btn btn-outline-warning btn-sm me-2"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button 
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => handleDeleteExercise(exercise.id)}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {exercises.length === 0 && (
                        <div className="text-center py-5">
                            <i className="fas fa-tasks fa-3x text-muted mb-3"></i>
                            <h4>No exercises available</h4>
                            <p className="text-muted">Start by creating your first exercise.</p>
                            {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                                <Link to="/exercises/create" className="btn btn-primary">
                                    Create First Exercise
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Exercises;