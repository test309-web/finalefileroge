
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExercise, updateExercise, deleteExercise } from '../services/exerciseService';
import { getCurrentUser } from '../services/authService';

const ExerciseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const userData = getCurrentUser();
                setUser(userData);

                const exerciseData = await getExercise(id);
                setExercise(exerciseData.exercise);
                setEditForm(exerciseData.exercise);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch exercise", error);
                setLoading(false);
            }
        };
        fetchExercise();
    }, [id]);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setEditForm(exercise);
        setMessage('');
    };

    const handleInputChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const result = await updateExercise(exercise.id, editForm);
            setExercise(result.exercise);
            setEditing(false);
            setMessage('Exercise updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update exercise: ' + (error.message || 'Unknown error'));
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this exercise? This action cannot be undone.')) {
            try {
                await deleteExercise(exercise.id);
                setMessage('Exercise deleted successfully!');
                setTimeout(() => {
                    navigate('/exercises');
                }, 2000);
            } catch (error) {
                setMessage('Failed to delete exercise: ' + (error.message || 'Unknown error'));
            }
        }
    };

    if (loading) {
        return (
            <div className="container-fluid vh-100 bg-light">
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="col-12 text-center">
                        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 fs-5 text-muted">Loading exercise content...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!exercise) {
        return (
            <div className="container-fluid vh-100 bg-light">
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="col-12 col-md-6 text-center">
                        <div className="alert alert-danger border-0 shadow">
                            <h2 className="text-danger">Exercise Not Found</h2>
                            <p className="mb-3">The exercise you're looking for doesn't exist.</p>
                            <a href="/exercises" className="btn btn-primary btn-lg">
                                <i className="fas fa-arrow-left me-2"></i>
                                Back to Exercises
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const canEditDelete = user && user.role === 'teacher' && exercise.teacher_id === user.id;

    return (
        <div className="container-fluid bg-light min-vh-100">
            <div className="row">
                <div className="col-12">
                    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
                        <div className="container">
                            <a className="navbar-brand fw-bold" href="/exercises">
                                <i className="fas fa-arrow-left me-2"></i>
                                Back to Exercises
                            </a>
                            <div className="navbar-nav ms-auto">
                                <span className="navbar-text text-white">
                                    Welcome, {user?.name}
                                </span>
                            </div>
                        </div>
                    </nav>

                    {message && (
                        <div className="container mt-3">
                            <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                                {message}
                                <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                            </div>
                        </div>
                    )}

                    <div className="container my-4">
                        <div className="row justify-content-center">
                            <div className="col-12 col-lg-10 col-xl-8">
                                <div className="card shadow border-0 rounded-3">
                                    <div className="card-header bg-success text-white py-4 rounded-top-3">
                                        <div className="row align-items-center">
                                            <div className="col-12 col-md-8">
                                                {editing ? (
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        value={editForm.title || ''}
                                                        onChange={handleInputChange}
                                                        className="form-control form-control-lg fw-bold"
                                                    />
                                                ) : (
                                                    <h1 className="h2 mb-2 fw-bold">{exercise.title}</h1>
                                                )}
                                                {editing ? (
                                                    <textarea
                                                        name="description"
                                                        value={editForm.description || ''}
                                                        onChange={handleInputChange}
                                                        className="form-control mt-2"
                                                        rows="2"
                                                    />
                                                ) : (
                                                    <p className="mb-0 fs-5 opacity-75">{exercise.description}</p>
                                                )}
                                            </div>
                                            <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
                                                {editing ? (
                                                    <>
                                                        <select
                                                            name="level"
                                                            value={editForm.level || ''}
                                                            onChange={handleInputChange}
                                                            className="form-select mb-2"
                                                        >
                                                            <option value="beginner">Beginner</option>
                                                            <option value="intermediate">Intermediate</option>
                                                            <option value="advanced">Advanced</option>
                                                        </select>
                                                        <input
                                                            type="number"
                                                            name="points"
                                                            value={editForm.points || ''}
                                                            onChange={handleInputChange}
                                                            className="form-control mb-2"
                                                            placeholder="Points"
                                                            min="0"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="badge bg-light text-dark fs-6 mb-2 px-3 py-2">
                                                            {exercise.level}
                                                        </div>
                                                        <div className="badge bg-warning text-dark fs-6 mb-2 px-3 py-2">
                                                            {exercise.points} points
                                                        </div>
                                                    </>
                                                )}
                                                <p className="mb-1 text-white">
                                                    <strong>By:</strong> {exercise.teacher?.name}
                                                </p>
                                                {editing ? (
                                                    <input
                                                        type="text"
                                                        name="subject"
                                                        value={editForm.subject || ''}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        placeholder="Subject"
                                                    />
                                                ) : (
                                                    <p className="mb-0 text-white">
                                                        <strong>Subject:</strong> {exercise.subject}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="card-body p-4 p-md-5">
                                        <div className="mb-5">
                                            <h3 className="mb-3 text-primary">
                                                <i className="fas fa-tasks me-2"></i>
                                                Exercise Content
                                            </h3>
                                            {editing ? (
                                                <textarea
                                                    name="content"
                                                    value={editForm.content || ''}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    rows="12"
                                                    placeholder="Exercise content..."
                                                />
                                            ) : (
                                                <div className="p-4 bg-light rounded shadow-sm">
                                                    <div className="exercise-content fs-5 lh-base">
                                                        {exercise.content}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {exercise.lesson && (
                                            <div className="mb-4">
                                                <h4 className="mb-3 text-primary">
                                                    <i className="fas fa-book me-2"></i>
                                                    Related Lesson
                                                </h4>
                                                <div className="card border-0 shadow-sm">
                                                    <div className="card-body">
                                                        <h5 className="card-title">{exercise.lesson.title}</h5>
                                                        <p className="card-text text-muted">
                                                            {exercise.lesson.description}
                                                        </p>
                                                        <a 
                                                            href={`/lessons/${exercise.lesson.id}`} 
                                                            className="btn btn-outline-primary"
                                                        >
                                                            View Lesson
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {canEditDelete && (
                                            <div className="mb-4">
                                                <h4 className="mb-3 text-primary">
                                                    <i className="fas fa-cog me-2"></i>
                                                    Management Actions
                                                </h4>
                                                <div className="d-grid gap-2 d-md-flex">
                                                    {editing ? (
                                                        <>
                                                            <button 
                                                                onClick={handleUpdate}
                                                                className="btn btn-success btn-lg me-md-2"
                                                            >
                                                                <i className="fas fa-save me-2"></i>
                                                                Save Changes
                                                            </button>
                                                            <button 
                                                                onClick={handleCancelEdit}
                                                                className="btn btn-secondary btn-lg"
                                                            >
                                                                <i className="fas fa-times me-2"></i>
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button 
                                                                onClick={handleEdit}
                                                                className="btn btn-warning btn-lg me-md-2"
                                                            >
                                                                <i className="fas fa-edit me-2"></i>
                                                                Edit Exercise
                                                            </button>
                                                            <button 
                                                                onClick={handleDelete}
                                                                className="btn btn-danger btn-lg"
                                                            >
                                                                <i className="fas fa-trash me-2"></i>
                                                                Delete Exercise
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {user && user.role === 'teacher' && exercise.student_points && exercise.student_points.length > 0 && (
                                            <div className="mt-5">
                                                <h4 className="mb-3 text-primary">
                                                    <i className="fas fa-chart-bar me-2"></i>
                                                    Student Submissions
                                                </h4>
                                                <div className="table-responsive">
                                                    <table className="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th>Student Name</th>
                                                                <th>Points Earned</th>
                                                                <th>Teacher Notes</th>
                                                                <th>Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {exercise.student_points.map(point => (
                                                                <tr key={point.id}>
                                                                    <td>{point.student ? point.student.name : 'Unknown'}</td>
                                                                    <td>
                                                                        <span className={`badge ${point.points_earned >= exercise.points * 0.8 ? 'bg-success' : 'bg-warning'}`}>
                                                                            {point.points_earned}/{exercise.points}
                                                                        </span>
                                                                    </td>
                                                                    <td>{point.teacher_notes || 'No notes'}</td>
                                                                    <td>{new Date(point.created_at).toLocaleDateString()}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-footer bg-light py-3">
                                        <div className="row">
                                            <div className="col-12 col-md-6">
                                                <small className="text-muted">
                                                    <i className="fas fa-calendar me-1"></i>
                                                    Created: {new Date(exercise.created_at).toLocaleDateString()}
                                                </small>
                                            </div>
                                            <div className="col-12 col-md-6 text-md-end">
                                                <small className="text-muted">
                                                    <i className="fas fa-clock me-1"></i>
                                                    Updated: {new Date(exercise.updated_at).toLocaleDateString()}
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

export default ExerciseDetail;