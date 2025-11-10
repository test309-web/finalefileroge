
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLesson } from '../services/lessonService';
import { getCurrentUser } from '../services/authService';

const LessonDetail = () => {
    const { id } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const userData = getCurrentUser();
                setUser(userData);

                const lessonData = await getLesson(id);
                setLesson(lessonData.lesson);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch lesson", error);
                setLoading(false);
            }
        };
        fetchLesson();
    }, [id]);

    if (loading) {
        return (
            <div className="container-fluid vh-100 bg-light">
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="col-12 text-center">
                        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 fs-5 text-muted">Loading lesson content...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="container-fluid vh-100 bg-light">
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="col-12 col-md-6 text-center">
                        <div className="alert alert-danger border-0 shadow">
                            <h2 className="text-danger">Lesson Not Found</h2>
                            <p className="mb-3">The lesson you're looking for doesn't exist.</p>
                            <a href="/lessons" className="btn btn-primary btn-lg">
                                <i className="fas fa-arrow-left me-2"></i>
                                Back to Lessons
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const canEditDelete = user && (user.role === 'admin' || (user.role === 'teacher' && lesson.teacher_id === user.id));

    return (
        <div className="container-fluid bg-light min-vh-100">
            <div className="row">
                <div className="col-12">
                    {/* Navigation Header */}
                    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
                        <div className="container">
                            <a className="navbar-brand fw-bold" href="/lessons">
                                <i className="fas fa-arrow-left me-2"></i>
                                Back to Lessons
                            </a>
                            <div className="navbar-nav ms-auto">
                                <span className="navbar-text text-white">
                                    Welcome, {user?.name}
                                </span>
                            </div>
                        </div>
                    </nav>

                    {/* Main Content */}
                    <div className="container my-4">
                        <div className="row justify-content-center">
                            <div className="col-12 col-lg-10 col-xl-8">
                                {/* Lesson Card */}
                                <div className="card shadow border-0 rounded-3">
                                    <div className="card-header bg-primary text-white py-4 rounded-top-3">
                                        <div className="row align-items-center">
                                            <div className="col-12 col-md-8">
                                                <h1 className="h2 mb-2 fw-bold">{lesson.title}</h1>
                                                <p className="mb-0 fs-5 opacity-75">{lesson.description}</p>
                                            </div>
                                            <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
                                                <div className="badge bg-light text-dark fs-6 mb-2 px-3 py-2">
                                                    {lesson.level}
                                                </div>
                                                <p className="mb-1 text-white">
                                                    <strong>By:</strong> {lesson.teacher?.name}
                                                </p>
                                                <p className="mb-0 text-white">
                                                    <strong>Subject:</strong> {lesson.subject}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="card-body p-4 p-md-5">
                                        {/* Embedded Content */}
                                        {lesson.file_url && (
                                            <div className="mb-5">
                                                <h3 className="mb-3 text-primary">
                                                    <i className="fas fa-link me-2"></i>
                                                    Lesson Resources
                                                </h3>
                                                <div className="ratio ratio-16x9">
                                                    <iframe 
                                                        src={lesson.file_url}
                                                        className="rounded shadow"
                                                        title="Lesson Content"
                                                        allowFullScreen
                                                    />
                                                </div>
                                                <div className="mt-2 text-center">
                                                    <small className="text-muted">
                                                        Embedded content from: {lesson.file_url}
                                                    </small>
                                                </div>
                                            </div>
                                        )}

                                        {/* Lesson Content */}
                                        <div className="mb-5">
                                            <h3 className="mb-3 text-primary">
                                                <i className="fas fa-book me-2"></i>
                                                Lesson Content
                                            </h3>
                                            <div className="p-4 bg-light rounded shadow-sm">
                                                <div className="lesson-content fs-5 lh-base">
                                                    {lesson.content}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Admin/Teacher Actions */}
                                        {canEditDelete && (
                                            <div className="mb-4">
                                                <h4 className="mb-3 text-primary">
                                                    <i className="fas fa-cog me-2"></i>
                                                    Management Actions
                                                </h4>
                                                <div className="d-grid gap-2 d-md-flex">
                                                    <button className="btn btn-warning btn-lg me-md-2">
                                                        <i className="fas fa-edit me-2"></i>
                                                        Edit Lesson
                                                    </button>
                                                    <button className="btn btn-danger btn-lg">
                                                        <i className="fas fa-trash me-2"></i>
                                                        Delete Lesson
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Related Exercises */}
                                        {lesson.exercises && lesson.exercises.length > 0 && (
                                            <div className="mt-5">
                                                <h3 className="mb-4 text-primary">
                                                    <i className="fas fa-tasks me-2"></i>
                                                    Related Exercises
                                                </h3>
                                                <div className="row">
                                                    {lesson.exercises.map(exercise => (
                                                        <div key={exercise.id} className="col-12 col-md-6 mb-3">
                                                            <div className="card h-100 border-0 shadow-sm">
                                                                <div className="card-body">
                                                                    <h5 className="card-title text-dark">{exercise.title}</h5>
                                                                    <p className="card-text text-muted">
                                                                        {exercise.description}
                                                                    </p>
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <span className="badge bg-primary fs-6">
                                                                            {exercise.points} points
                                                                        </span>
                                                                        <a 
                                                                            href={`/exercises/${exercise.id}`} 
                                                                            className="btn btn-outline-primary"
                                                                        >
                                                                            View Exercise
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-footer bg-light py-3">
                                        <div className="row">
                                            <div className="col-12 col-md-6">
                                                <small className="text-muted">
                                                    <i className="fas fa-calendar me-1"></i>
                                                    Created: {new Date(lesson.created_at).toLocaleDateString()}
                                                </small>
                                            </div>
                                            <div className="col-12 col-md-6 text-md-end">
                                                <small className="text-muted">
                                                    <i className="fas fa-clock me-1"></i>
                                                    Updated: {new Date(lesson.updated_at).toLocaleDateString()}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonDetail;