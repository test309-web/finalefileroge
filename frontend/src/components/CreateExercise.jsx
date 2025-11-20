
import React, { useState, useEffect } from 'react';
import { createExercise } from '../services/exerciseService';
import { getLessons } from '../services/lessonService';

const CreateExercise = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        subject: '',
        level: 'beginner',
        points: 10,
        lesson_id: ''
    });
    const [lessons, setLessons] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        
       
        if (userData && userData.role !== 'teacher') {
            window.location.href = '/dashboard';
        }

        
        const fetchLessons = async () => {
            try {
                const lessonsData = await getLessons();
                setLessons(lessonsData.lessons || []);
            } catch (error) {
                console.error("Failed to fetch lessons", error);
            }
        };
        fetchLessons();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await createExercise(formData);
            alert('Exercise created successfully!');
            window.location.href = '/exercises';
        } catch (error) {
            if (error.errors) {
                setValidationErrors(error.errors);
            } else {
                alert(error.message || 'Failed to create exercise.');
            }
        } finally {
            setLoading(false);
        }
    }

    if (!user || user.role !== 'teacher') {
        return (
            <div className="container mt-5 text-center">
                <h2>Access Denied</h2>
                <p>Only teachers can create exercises.</p>
                <a href="/dashboard" className="btn btn-primary">Back to Dashboard</a>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <nav className="navbar navbar-light bg-light mb-4">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/exercises">← Back to Exercises</a>
                </div>
            </nav>

            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="text-center">Create New Exercise</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Exercise Title</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.title && <div className="text-danger">{validationErrors.title[0]}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="subject" className="form-label">Subject</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.subject && <div className="text-danger">{validationErrors.subject[0]}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="level" className="form-label">Level</label>
                                    <select 
                                        className="form-control" 
                                        id="level"
                                        name="level"
                                        value={formData.level}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                    {validationErrors.level && <div className="text-danger">{validationErrors.level[0]}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="lesson_id" className="form-label">Related Lesson (Optional)</label>
                                    <select 
                                        className="form-control" 
                                        id="lesson_id"
                                        name="lesson_id"
                                        value={formData.lesson_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select a lesson</option>
                                        {lessons.map(lesson => (
                                            <option key={lesson.id} value={lesson.id}>
                                                {lesson.title}
                                            </option>
                                        ))}
                                    </select>
                                    {validationErrors.lesson_id && <div className="text-danger">{validationErrors.lesson_id[0]}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="points" className="form-label">Points</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="points"
                                        name="points"
                                        min="1"
                                        max="100"
                                        value={formData.points}
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.points && <div className="text-danger">{validationErrors.points[0]}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea 
                                        className="form-control" 
                                        id="description"
                                        name="description"
                                        rows="3"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                    {validationErrors.description && <div className="text-danger">{validationErrors.description[0]}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="content" className="form-label">Exercise Content</label>
                                    <textarea 
                                        className="form-control" 
                                        id="content"
                                        name="content"
                                        rows="8"
                                        value={formData.content}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                    {validationErrors.content && <div className="text-danger">{validationErrors.content[0]}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="file_path" className="form-label">File URL (Optional)</label>
                                    <input 
                                        type="url" 
                                        className="form-control" 
                                        id="file_path"
                                        name="file_path"
                                        value={formData.file_path || ''}
                                        onChange={handleChange}
                                    />
                                    {validationErrors.file_path && <div className="text-danger">{validationErrors.file_path[0]}</div>}
                                </div>

                                <div className="d-grid">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating Exercise...' : 'Create Exercise'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateExercise;