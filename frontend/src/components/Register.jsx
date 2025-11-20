
import React, { useState } from "react";
import { register, logout } from "../services/authService";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student"
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setValidationErrors({});
        
        try {
            await register(formData);
            window.location.href = "/dashboard";
        } catch (error) {
            if (error.errors) {
                setValidationErrors(error.errors);
            } else {
                alert(error.message || "Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = () => {
        logout();
    }

    return (
        <div className="container-fluid vh-100 bg-light">
            <div className="row h-100 justify-content-center align-items-center">
                <div className="col-12 col-sm-8 col-md-6 col-lg-4 col-xl-3">
                    <div className="card shadow-lg border-0 rounded-3">
                        <div className="card-header bg-success text-white text-center py-4 rounded-top-3">
                            <h2 className="mb-0 fw-bold">
                                <i className="fas fa-user-plus me-2"></i>
                                Create Account
                            </h2>
                            <p className="mb-0 mt-2 opacity-75">Join our educational platform</p>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label fw-semibold">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        className={`form-control form-control-lg ${validationErrors.name ? 'is-invalid' : ''}`}
                                        placeholder="Enter your full name"
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.name && 
                                        <div className="invalid-feedback">{validationErrors.name[0]}</div>
                                    }
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        className={`form-control form-control-lg ${validationErrors.email ? 'is-invalid' : ''}`}
                                        placeholder="Enter your email"
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.email && 
                                        <div className="invalid-feedback">{validationErrors.email[0]}</div>
                                    }
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label fw-semibold">Password</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        className={`form-control form-control-lg ${validationErrors.password ? 'is-invalid' : ''}`}
                                        placeholder="Create a password (min. 6 characters)"
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.password && 
                                        <div className="invalid-feedback">{validationErrors.password[0]}</div>
                                    }
                                </div>
                                
                                <div className="mb-4">
                                    <label htmlFor="role" className="form-label fw-semibold">I am a:</label>
                                    <select 
                                        name="role" 
                                        className="form-select form-select-lg"
                                        onChange={handleChange}
                                        value={formData.role}
                                    >
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                    </select>
                                </div>
                                
                                <div className="d-grid mb-3">
                                    <button 
                                        type="submit" 
                                        className="btn btn-success btn-lg fw-semibold"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-user-check me-2"></i>
                                                Create Account
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                            
                            <div className="text-center">
                                <p className="mb-3">Already have an account?</p>
                                <a href="/login" className="btn btn-outline-success btn-lg w-100">
                                    <i className="fas fa-sign-in-alt me-2"></i>
                                    Sign In
                                </a>
                            </div>
                        </div>
                        <div className="card-footer bg-light text-center py-3 rounded-bottom-3">
                            <button 
                                onClick={handleLogout}
                                className="btn btn-link text-muted text-decoration-none"
                            >
                                <i className="fas fa-sign-out-alt me-1"></i>
                                Clear Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;