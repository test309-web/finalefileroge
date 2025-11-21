import React, { useState, useEffect } from 'react';
import { getAllUsers, createTeacher, updateUser, deleteUser, logout } from '../services/authService';
import { getCurrentUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTeacherForm, setShowTeacherForm] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [teacherForm, setTeacherForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
        if (user?.role === 'admin') {
            loadUsers();
        }
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const usersData = await getAllUsers();
            setUsers(usersData.data || []);
        } catch (error) {
            alert('Error loading users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeacher = async (e) => {
        e.preventDefault();
        try {
            await createTeacher(teacherForm);
            alert('Teacher created successfully');
            setShowTeacherForm(false);
            setTeacherForm({
                name: '',
                email: '',
                password: '',
                password_confirmation: ''
            });
            loadUsers();
        } catch (error) {
            alert(error.message || 'Error creating teacher');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                alert('User deleted successfully');
                loadUsers();
            } catch (error) {
                alert('Error deleting user');
            }
        }
    };

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            try {
                await logout();
                navigate('/login');
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    if (currentUser?.role !== 'admin') {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    Access denied. Admin privileges required.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow">
                        {/* Header */}
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="mb-0">
                                    <i className="fas fa-users-cog me-2"></i>
                                    Admin Dashboard
                                </h2>
                                <small className="opacity-75">Manage all platform users</small>
                            </div>
                            <div>
                                <button 
                                    className="btn btn-outline-light me-2"
                                    onClick={handleBackToDashboard}
                                >
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Back to Dashboard
                                </button>
                                <button 
                                    className="btn btn-outline-light me-2"
                                    onClick={() => setShowTeacherForm(!showTeacherForm)}
                                >
                                    <i className="fas fa-plus me-2"></i>
                                    Add Teacher
                                </button>
                                <button 
                                    className="btn btn-outline-warning"
                                    onClick={handleLogout}
                                >
                                    <i className="fas fa-sign-out-alt me-2"></i>
                                    Logout
                                </button>
                            </div>
                        </div>
                        
                        {/* Teacher Creation Form */}
                        {showTeacherForm && (
                            <div className="card-body border-bottom bg-light">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 className="mb-0">
                                                <i className="fas fa-chalkboard-teacher me-2"></i>
                                                Create New Teacher
                                            </h4>
                                            <button 
                                                type="button" 
                                                className="btn-close" 
                                                onClick={() => setShowTeacherForm(false)}
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                        <form onSubmit={handleCreateTeacher}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Full Name</label>
                                                        <input 
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter teacher's full name"
                                                            value={teacherForm.name}
                                                            onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Email Address</label>
                                                        <input 
                                                            type="email"
                                                            className="form-control"
                                                            placeholder="Enter teacher's email"
                                                            value={teacherForm.email}
                                                            onChange={(e) => setTeacherForm({...teacherForm, email: e.target.value})}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Password</label>
                                                        <input 
                                                            type="password"
                                                            className="form-control"
                                                            placeholder="Create password (min. 6 characters)"
                                                            value={teacherForm.password}
                                                            onChange={(e) => setTeacherForm({...teacherForm, password: e.target.value})}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Confirm Password</label>
                                                        <input 
                                                            type="password"
                                                            className="form-control"
                                                            placeholder="Confirm password"
                                                            value={teacherForm.password_confirmation}
                                                            onChange={(e) => setTeacherForm({...teacherForm, password_confirmation: e.target.value})}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                <button type="submit" className="btn btn-primary">
                                                    <i className="fas fa-user-plus me-2"></i>
                                                    Create Teacher Account
                                                </button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary"
                                                    onClick={() => setShowTeacherForm(false)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="card-body">
                            <div className="row mb-4">
                                <div className="col-md-3">
                                    <div className="card bg-danger text-white">
                                        <div className="card-body text-center p-3">
                                            <i className="fas fa-crown fa-2x mb-2"></i>
                                            <h4 className="mb-1">{users.filter(user => user.role === 'admin').length}</h4>
                                            <p className="mb-0">Admins</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card bg-warning text-white">
                                        <div className="card-body text-center p-3">
                                            <i className="fas fa-chalkboard-teacher fa-2x mb-2"></i>
                                            <h4 className="mb-1">{users.filter(user => user.role === 'teacher').length}</h4>
                                            <p className="mb-0">Teachers</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card bg-info text-white">
                                        <div className="card-body text-center p-3">
                                            <i className="fas fa-user-graduate fa-2x mb-2"></i>
                                            <h4 className="mb-1">{users.filter(user => user.role === 'student').length}</h4>
                                            <p className="mb-0">Students</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card bg-success text-white">
                                        <div className="card-body text-center p-3">
                                            <i className="fas fa-users fa-2x mb-2"></i>
                                            <h4 className="mb-1">{users.length}</h4>
                                            <p className="mb-0">Total Users</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Users Table */}
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2 text-muted">Loading users...</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Created At</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(user => (
                                                <tr key={user.id}>
                                                    <td><strong>#{user.id}</strong></td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <i className={`fas fa-${
                                                                user.role === 'admin' ? 'crown text-danger' : 
                                                                user.role === 'teacher' ? 'chalkboard-teacher text-warning' : 'user-graduate text-info'
                                                            } me-2`}></i>
                                                            {user.name}
                                                        </div>
                                                    </td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <span className={`badge ${
                                                            user.role === 'admin' ? 'bg-danger' : 
                                                            user.role === 'teacher' ? 'bg-warning' : 'bg-info'
                                                        }`}>
                                                            <i className={`fas fa-${
                                                                user.role === 'admin' ? 'crown' : 
                                                                user.role === 'teacher' ? 'chalkboard-teacher' : 'user-graduate'
                                                            } me-1`}></i>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <small>
                                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            disabled={user.role === 'admin'}
                                                            title={user.role === 'admin' ? 'Cannot delete admin user' : 'Delete user'}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                            <span className="ms-1 d-none d-md-inline">Delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {users.length === 0 && !loading && (
                                <div className="text-center py-5">
                                    <i className="fas fa-users fa-3x text-muted mb-3"></i>
                                    <h4>No Users Found</h4>
                                    <p className="text-muted">There are no users in the system yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;