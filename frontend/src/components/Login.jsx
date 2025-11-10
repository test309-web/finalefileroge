import React, { useState } from "react";
import { login, logout } from "../services/authService";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
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
            await login(formData);
            window.location.href = "/dashboard";
        } catch (error) {
            if (error.errors) {
                setValidationErrors(error.errors);
            } else {
                alert(error.message || "Login failed. Please check your credentials.");
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
                        <div className="card-header bg-primary text-white text-center py-4 rounded-top-3">
                            <h2 className="mb-0 fw-bold">
                                <i className="fas fa-graduation-cap me-2"></i>
                                School Platform
                            </h2>
                            <p className="mb-0 mt-2 opacity-75">Sign in to your account</p>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
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
                                
                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label fw-semibold">Password</label>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        className={`form-control form-control-lg ${validationErrors.password ? 'is-invalid' : ''}`}
                                        placeholder="Enter your password"
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.password && 
                                        <div className="invalid-feedback">{validationErrors.password[0]}</div>
                                    }
                                </div>
                                
                                <div className="d-grid mb-3">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg fw-semibold"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Signing In...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-sign-in-alt me-2"></i>
                                                Sign In
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                            
                            <div className="text-center">
                                <p className="mb-3">Don't have an account?</p>
                                <a href="/register" className="btn btn-outline-primary btn-lg w-100">
                                    <i className="fas fa-user-plus me-2"></i>
                                    Create Account
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

export default Login;