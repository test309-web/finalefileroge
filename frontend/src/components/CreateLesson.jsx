import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLesson } from '../services/lessonService';

const CreateLesson = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        level: 'beginner'
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        navigate('/dashboard'); 
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setValidationErrors({});
        
        try {
            await createLesson(formData);
            navigate('/lessons');
        } catch (error) {
            if (error.errors) {
                setValidationErrors(error.errors);
            } else {
                alert(error.message || 'Failed to create lesson');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    {/* Back Button */}
                    <button 
                        className="btn btn-outline-secondary mb-3"
                        onClick={handleBack}
                    >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Dashboard
                    </button>

                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h2 className="mb-0">
                                <i className="fas fa-plus-circle me-2"></i>
                                Create New Lesson
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
                                        placeholder="Enter lesson title"
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
                                        placeholder="Enter lesson description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.description && 
                                        <div className="invalid-feedback">{validationErrors.description[0]}</div>
                                    }
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="content" className="form-label">Content</label>
                                    <textarea 
                                        name="content" 
                                        className={`form-control ${validationErrors.content ? 'is-invalid' : ''}`}
                                        rows="6"
                                        placeholder="Enter lesson content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.content && 
                                        <div className="invalid-feedback">{validationErrors.content[0]}</div>
                                    }
                                </div>
                                
                                <div className="mb-4">
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
                                
                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save me-2"></i>
                                                Create Lesson
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

export default CreateLesson;