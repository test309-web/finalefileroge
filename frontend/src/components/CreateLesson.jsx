
import React, { useState, useEffect } from 'react';
import { createLesson } from '../services/lessonService';

const CreateLesson = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        subject: '',
        level: 'beginner',
        file_url: ''
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        
        if (userData && userData.role !== 'teacher') {
            window.location.href = '/dashboard';
        }
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
            await createLesson(formData);
            alert('Lesson created successfully!');
            window.location.href = '/lessons';
        } catch (error) {
            if (error.errors) {
                setValidationErrors(error.errors);
            } else {
                alert(error.message || 'Failed to create lesson.');
            }
        } finally {
            setLoading(false);
        }
    }

    if (!user || user.role !== 'teacher') {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="alert alert-danger text-center">
                            <h2>Access Denied</h2>
                            <p>Only teachers can create lessons.</p>
                            <a href="/dashboard" className="btn btn-primary">Back to Dashboard</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <nav className="navbar navbar-light bg-light mb-4 rounded shadow-sm">
                <div className="container-fluid">
                    <a className="navbar-brand fw-bold text-primary" href="/lessons">
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Lessons
                    </a>
                </div>
            </nav>

            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-primary text-white py-3">
                            <h3 className="text-center mb-0">
                                <i className="fas fa-plus-circle me-2"></i>
                                Create New Lesson
                            </h3>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="title" className="form-label fw-semibold">
                                            Lesson Title *
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required 
                                            placeholder="Enter lesson title"
                                        />
                                        {validationErrors.title && 
                                            <div className="text-danger small">{validationErrors.title[0]}</div>
                                        }
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="subject" className="form-label fw-semibold">
                                            Subject *
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required 
                                            placeholder="Enter subject"
                                        />
                                        {validationErrors.subject && 
                                            <div className="text-danger small">{validationErrors.subject[0]}</div>
                                        }
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="level" className="form-label fw-semibold">
                                            Level *
                                        </label>
                                        <select 
                                            className="form-select" 
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
                                        {validationErrors.level && 
                                            <div className="text-danger small">{validationErrors.level[0]}</div>
                                        }
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="file_url" className="form-label fw-semibold">
                                            Resource URL (Optional)
                                        </label>
                                        <input 
                                            type="url" 
                                            className="form-control" 
                                            id="file_url"
                                            name="file_url"
                                            value={formData.file_url}
                                            onChange={handleChange}
                                            placeholder="https://example.com/resource"
                                        />
                                        <div className="form-text">
                                            Enter a URL to embed content (Google Docs, YouTube, etc.)
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label fw-semibold">
                                        Description *
                                    </label>
                                    <textarea 
                                        className="form-control" 
                                        id="description"
                                        name="description"
                                        rows="3"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        placeholder="Brief description of the lesson"
                                    ></textarea>
                                    {validationErrors.description && 
                                        <div className="text-danger small">{validationErrors.description[0]}</div>
                                    }
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="content" className="form-label fw-semibold">
                                        Lesson Content *
                                    </label>
                                    <textarea 
                                        className="form-control" 
                                        id="content"
                                        name="content"
                                        rows="8"
                                        value={formData.content}
                                        onChange={handleChange}
                                        required
                                        placeholder="Detailed lesson content..."
                                        style={{ resize: 'vertical' }}
                                    ></textarea>
                                    {validationErrors.content && 
                                        <div className="text-danger small">{validationErrors.content[0]}</div>
                                    }
                                </div>

                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Creating Lesson...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save me-2"></i>
                                                Create Lesson
                                            </>
                                        )}
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

export default CreateLesson;