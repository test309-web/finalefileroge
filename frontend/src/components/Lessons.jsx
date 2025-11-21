import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLessons, deleteLesson, getTeacherLessons } from '../services/lessonService';
import { getCurrentUser } from '../services/authService';

const Lessons = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
        loadLessons(user);
    }, []);

    const handleBack = () => {
        navigate(-1);
    };

    const loadLessons = async (user) => {
        try {
            let lessonsData;
            if (user?.role === 'teacher') {
                lessonsData = await getTeacherLessons();
            } else {
                lessonsData = await getLessons();
            }
            setLessons(lessonsData.data || []);
        } catch (error) {
            console.error('Error loading lessons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (window.confirm('Are you sure you want to delete this lesson?')) {
            try {
                await deleteLesson(lessonId);
                loadLessons(currentUser);
            } catch (error) {
                alert('Error deleting lesson');
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
                            <i className="fas fa-book me-2"></i>
                            Lessons
                        </h1>
                        {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                            <Link to="/lessons/create" className="btn btn-primary">
                                <i className="fas fa-plus me-2"></i>
                                Create Lesson
                            </Link>
                        )}
                    </div>

                    <div className="row">
                        {lessons.map(lesson => (
                            <div key={lesson.id} className="col-md-6 col-lg-4 mb-4">
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{lesson.title}</h5>
                                        <p className="card-text text-muted">{lesson.description}</p>
                                        <div className="mb-2">
                                            <span className={`badge ${
                                                lesson.level === 'beginner' ? 'bg-success' : 
                                                lesson.level === 'intermediate' ? 'bg-warning' : 'bg-danger'
                                            }`}>
                                                {lesson.level}
                                            </span>
                                        </div>
                                        <p className="card-text">
                                            <small className="text-muted">
                                                By: {lesson.teacher?.name || 'Unknown'}
                                            </small>
                                        </p>
                                    </div>
                                    <div className="card-footer bg-transparent">
                                        <div className="d-flex justify-content-between">
                                            <Link 
                                                to={`/lessons/${lesson.id}`} 
                                                className="btn btn-outline-primary btn-sm"
                                            >
                                                View
                                            </Link>
                                            {(currentUser?.role === 'admin' || 
                                              (currentUser?.role === 'teacher' && lesson.teacher_id === currentUser.id)) && (
                                                <div>
                                                    <Link 
                                                        to={`/lessons/edit/${lesson.id}`}
                                                        className="btn btn-outline-warning btn-sm me-2"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>
                                                    <button 
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => handleDeleteLesson(lesson.id)}
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

                    {lessons.length === 0 && (
                        <div className="text-center py-5">
                            <i className="fas fa-book fa-3x text-muted mb-3"></i>
                            <h4>No lessons available</h4>
                            <p className="text-muted">Start by creating your first lesson.</p>
                            {(currentUser?.role === 'teacher' || currentUser?.role === 'admin') && (
                                <Link to="/lessons/create" className="btn btn-primary">
                                    Create First Lesson
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Lessons;