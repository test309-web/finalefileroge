import React, { useState, useEffect } from 'react';
import { getAllUsers, createTeacher, updateUser, deleteUser, logout } from '../services/authService';
import { getCurrentUser } from '../services/authService';

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
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
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
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <h2 className="mb-0">
                                <i className="fas fa-users-cog me-2"></i>
                                Admin Dashboard
                            </h2>
                            <div>
                                <button 
                                    className="btn btn-success me-2"
                                    onClick={() => setShowTeacherForm(!showTeacherForm)}
                                >
                                    <i className="fas fa-plus me-2"></i>
                                    Add Teacher
                                </button>
                                <button 
                                    className="btn btn-outline-light"
                                    onClick={handleLogout}
                                >
                                    <i className="fas fa-sign-out-alt me-2"></i>
                                    Logout
                                </button>
                            </div>
                        </div>
                        
                        {showTeacherForm && (
                            <div className="card-body border-bottom">
                                <h4>Create New Teacher</h4>
                                <form onSubmit={handleCreateTeacher}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Name</label>
                                                <input 
                                                    type="text"
                                                    className="form-control"
                                                    value={teacherForm.name}
                                                    onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Email</label>
                                                <input 
                                                    type="email"
                                                    className="form-control"
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
                                                    value={teacherForm.password_confirmation}
                                                    onChange={(e) => setTeacherForm({...teacherForm, password_confirmation: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button type="submit" className="btn btn-primary">
                                            Create Teacher
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
                        )}

                        <div className="card-body">
                            <div className="row mb-4">
                                <div className="col-md-3">
                                    <div className="card bg-primary text-white">
                                        <div className="card-body text-center">
                                            <h4>{users.filter(user => user.role === 'admin').length}</h4>
                                            <p className="mb-0">Admins</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card bg-warning text-white">
                                        <div className="card-body text-center">
                                            <h4>{users.filter(user => user.role === 'teacher').length}</h4>
                                            <p className="mb-0">Teachers</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card bg-info text-white">
                                        <div className="card-body text-center">
                                            <h4>{users.filter(user => user.role === 'student').length}</h4>
                                            <p className="mb-0">Students</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="card bg-success text-white">
                                        <div className="card-body text-center">
                                            <h4>{users.length}</h4>
                                            <p className="mb-0">Total Users</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
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
                                                    <td>{user.id}</td>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <span className={`badge ${
                                                            user.role === 'admin' ? 'bg-danger' : 
                                                            user.role === 'teacher' ? 'bg-warning' : 'bg-info'
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                                    <td>
                                                        <button 
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            disabled={user.role === 'admin'}
                                                            title={user.role === 'admin' ? 'Cannot delete admin user' : 'Delete user'}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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