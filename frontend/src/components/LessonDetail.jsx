import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLesson } from '../services/lessonService';

const LessonDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLesson();
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    const loadLesson = async () => {
        try {
            const lessonData = await getLesson(id);
            if (lessonData.status === 'success') {
                setLesson(lessonData.data);
            } else {
                setLesson(null);
            }
        } catch (error) {
            console.error('Error loading lesson:', error);
            setLesson(null);
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

    if (!lesson) {
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
                    <h4>Lesson Not Found</h4>
                    <p className="mb-0">The lesson you're looking for doesn't exist.</p>
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
                        <div className="card-header bg-primary text-white">
                            <h2 className="mb-0">{lesson.title}</h2>
                            <div className="mt-2">
                                <span className={`badge ${
                                    lesson.level === 'beginner' ? 'bg-success' : 
                                    lesson.level === 'intermediate' ? 'bg-warning' : 'bg-danger'
                                } me-2`}>
                                    {lesson.level}
                                </span>
                                <small>By: {lesson.teacher?.name || 'Unknown'}</small>
                            </div>
                        </div>
                        <div className="card-body">
                            <h4>Description</h4>
                            <p className="lead">{lesson.description}</p>
                            
                            <h4>Content</h4>
                            <div className="content-box p-3 bg-light rounded">
                                {lesson.content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonDetail;