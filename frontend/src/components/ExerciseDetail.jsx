import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExercise } from '../services/exerciseService';
import { getCurrentUser } from '../services/authService';

const ExerciseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
        loadExercise();
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    const loadExercise = async () => {
        try {
            const exerciseData = await getExercise(id);
            console.log('Exercise detail data:', exerciseData); // للتصحيح
            
            if (exerciseData.status === 'success') {
                setExercise(exerciseData.data);
            } else {
                setExercise(null);
            }
        } catch (error) {
            console.error('Error loading exercise:', error);
            setExercise(null);
        } finally {
            setLoading(false);
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

    if (!exercise) {
        return (
            <div className="container mt-4">
                <button 
                    className="btn btn-outline-secondary mb-3"
                    onClick={handleBack}
                >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back
                </button>
                <div className="alert alert-danger">
                    <h4>Exercise Not Found</h4>
                    <p className="mb-0">The exercise you're looking for doesn't exist.</p>
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

                    <div className="card shadow">
                        <div className="card-header bg-success text-white">
                            <h2 className="mb-0">{exercise.title}</h2>
                            <div className="mt-2">
                                <span className={`badge ${
                                    exercise.level === 'beginner' ? 'bg-success' : 
                                    exercise.level === 'intermediate' ? 'bg-warning' : 'bg-danger'
                                } me-2`}>
                                    {exercise.level}
                                </span>
                                <span className="badge bg-info me-2">
                                    {exercise.points} Points
                                </span>
                                <small>By: {exercise.teacher?.name || 'Unknown'}</small>
                            </div>
                        </div>
                        <div className="card-body">
                            <h4>Description</h4>
                            <p className="lead">{exercise.description}</p>
                            
                            <h4>Exercise Content</h4>
                            <div className="content-box p-3 bg-light rounded mb-4">
                                <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                    {exercise.content}
                                </pre>
                            </div>

                            <h4>Solution</h4>
                            <div className="solution-box p-3 bg-dark text-white rounded">
                                <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                    {exercise.solution}
                                </pre>
                            </div>

                            {exercise.lesson && (
                                <div className="mt-4">
                                    <h5>Related Lesson</h5>
                                    <div className="card">
                                        <div className="card-body">
                                            <h6 className="card-title">{exercise.lesson.title}</h6>
                                            <p className="card-text text-muted">{exercise.lesson.description}</p>
                                            <span className={`badge ${
                                                exercise.lesson.level === 'beginner' ? 'bg-success' : 
                                                exercise.lesson.level === 'intermediate' ? 'bg-warning' : 'bg-danger'
                                            }`}>
                                                {exercise.lesson.level}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="card-footer">
                            <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                    Created: {new Date(exercise.created_at).toLocaleDateString()}
                                </small>
                                {(currentUser?.role === 'admin' || 
                                  (currentUser?.role === 'teacher' && exercise.teacher_id === currentUser.id)) && (
                                    <button 
                                        className="btn btn-outline-warning btn-sm"
                                        onClick={() => navigate(`/exercises/edit/${exercise.id}`)}
                                    >
                                        <i className="fas fa-edit me-1"></i>
                                        Edit Exercise
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExerciseDetail;