import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExercise, updateExercise } from '../services/exerciseService';
import { getLessons } from '../services/lessonService';
import { getCurrentUser } from '../services/authService';

const EditExercise = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        solution: '',
        level: 'beginner',
        points: 10,
        lesson_id: ''
    });
    const [lessons, setLessons] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [exercise, setExercise] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
        setAuthChecked(true);
    }, []);

    useEffect(() => {
        if (authChecked && currentUser) {
            loadExercise();
            loadLessons();
        }
    }, [authChecked, currentUser, id]);

    const loadExercise = async () => {
        try {
            const exerciseData = await getExercise(id);
            if (exerciseData.status === 'success') {
                setExercise(exerciseData.data);
                
                // التحقق من الصلاحيات بعد تحميل البيانات والمستخدم
                if (exerciseData.data.teacher_id !== currentUser.id && currentUser.role !== 'admin') {
                    alert('You are not authorized to edit this exercise');
                    navigate('/dashboard');
                    return;
                }
                
                setFormData({
                    title: exerciseData.data.title,
                    description: exerciseData.data.description,
                    content: exerciseData.data.content,
                    solution: exerciseData.data.solution,
                    level: exerciseData.data.level,
                    points: exerciseData.data.points,
                    lesson_id: exerciseData.data.lesson_id || ''
                });
            } else {
                alert('Exercise not found');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error loading exercise:', error);
            alert('Error loading exercise');
            navigate('/dashboard');
        }
    };

    const loadLessons = async () => {
        try {
            let lessonsData;
            if (currentUser.role === 'teacher') {
                const response = await fetch('http://127.0.0.1:8000/api/teacher/lessons', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                lessonsData = await response.json();
            } else {
                lessonsData = await getLessons();
            }
            
            if (lessonsData.status === 'success') {
                setLessons(lessonsData.data || []);
            }
        } catch (error) {
            console.error('Error loading lessons:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setValidationErrors({});
        
        try {
            await updateExercise(id, formData);
            navigate('/dashboard');
        } catch (error) {
            if (error.errors) {
                setValidationErrors(error.errors);
            } else {
                alert(error.message || 'Failed to update exercise');
            }
        } finally {
            setLoading(false);
        }
    }

    const handleBack = () => {
        navigate('/dashboard');
    }

    if (!authChecked || !exercise) {
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
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <button 
                        className="btn btn-outline-secondary mb-3"
                        onClick={handleBack}
                    >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Dashboard
                    </button>

                    <div className="card shadow">
                        <div className="card-header bg-warning text-white">
                            <h2 className="mb-0">
                                <i className="fas fa-edit me-2"></i>
                                Edit Exercise
                            </h2>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input 
                                        type="text" 
                                        name="title" 
                                        className={`form-control ${validationErrors.title ? 'is-invalid' : ''}`}
                                        value={formData.title}
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.title && 
                                        <div className="invalid-feedback">{validationErrors.title[0]}</div>
                                    }
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea 
                                        name="description" 
                                        className={`form-control ${validationErrors.description ? 'is-invalid' : ''}`}
                                        rows="3"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.description && 
                                        <div className="invalid-feedback">{validationErrors.description[0]}</div>
                                    }
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="content" className="form-label">Exercise Content</label>
                                    <textarea 
                                        name="content" 
                                        className={`form-control ${validationErrors.content ? 'is-invalid' : ''}`}
                                        rows="4"
                                        value={formData.content}
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.content && 
                                        <div className="invalid-feedback">{validationErrors.content[0]}</div>
                                    }
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="solution" className="form-label">Solution</label>
                                    <textarea 
                                        name="solution" 
                                        className={`form-control ${validationErrors.solution ? 'is-invalid' : ''}`}
                                        rows="4"
                                        value={formData.solution}
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.solution && 
                                        <div className="invalid-feedback">{validationErrors.solution[0]}</div>
                                    }
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="level" className="form-label">Level</label>
                                    <select 
                                        name="level" 
                                        className="form-select"
                                        value={formData.level}
                                        onChange={handleChange}
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="points" className="form-label">Points</label>
                                    <input 
                                        type="number" 
                                        name="points" 
                                        className={`form-control ${validationErrors.points ? 'is-invalid' : ''}`}
                                        value={formData.points}
                                        onChange={handleChange}
                                        min="1"
                                        required 
                                    />
                                    {validationErrors.points && 
                                        <div className="invalid-feedback">{validationErrors.points[0]}</div>
                                    }
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="lesson_id" className="form-label">Related Lesson (Optional)</label>
                                    <select 
                                        name="lesson_id" 
                                        className="form-select"
                                        value={formData.lesson_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select a lesson (optional)</option>
                                        {lessons.map(lesson => (
                                            <option key={lesson.id} value={lesson.id}>
                                                {lesson.title} - {lesson.level}
                                            </option>
                                        ))}
                                    </select>
                                    {validationErrors.lesson_id && 
                                        <div className="invalid-feedback">{validationErrors.lesson_id[0]}</div>
                                    }
                                </div>
                                
                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-warning"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save me-2"></i>
                                                Update Exercise
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={handleBack}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditExercise;