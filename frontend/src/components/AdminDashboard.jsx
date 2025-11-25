import React, { useState, useEffect } from 'react';
import { getAllUsers, createTeacher, updateUser, deleteUser, logout } from '../services/authService';
import { getCurrentUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    // États pour gérer les données et l'interface
    const [users, setUsers] = useState([]); // Liste des utilisateurs
    const [loading, setLoading] = useState(false); // État de chargement
    const [showTeacherForm, setShowTeacherForm] = useState(false); // Affichage du formulaire enseignant
    const [currentUser, setCurrentUser] = useState(null); // Utilisateur connecté
    const [teacherForm, setTeacherForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    }); // Données du formulaire enseignant
    const navigate = useNavigate();

    // Effet pour charger l'utilisateur et les données au montage du composant
    useEffect(() => {
        const user = getCurrentUser(); // Récupérer l'utilisateur connecté
        setCurrentUser(user);
        if (user?.role === 'admin') {
            loadUsers(); // Charger les utilisateurs si admin
        }
    }, []);

    // Fonction pour charger la liste des utilisateurs
    const loadUsers = async () => {
        try {
            setLoading(true);
            const usersData = await getAllUsers(); // Appel API pour récupérer les utilisateurs
            setUsers(usersData.data || []);
        } catch (error) {
            alert('Error loading users'); // Gestion des erreurs
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour créer un nouvel enseignant
    const handleCreateTeacher = async (e) => {
        e.preventDefault();
        try {
            await createTeacher(teacherForm); // Appel API pour créer l'enseignant
            alert('Teacher created successfully');
            setShowTeacherForm(false);
            // Réinitialiser le formulaire
            setTeacherForm({
                name: '',
                email: '',
                password: '',
                password_confirmation: ''
            });
            loadUsers(); // Recharger la liste des utilisateurs
        } catch (error) {
            alert(error.message || 'Error creating teacher');
        }
    };

    // Fonction pour supprimer un utilisateur
    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId); // Appel API pour supprimer l'utilisateur
                alert('User deleted successfully');
                loadUsers(); // Recharger la liste
            } catch (error) {
                alert('Error deleting user');
            }
        }
    };

    // Fonction pour gérer la déconnexion
    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            try {
                await logout(); // Appel API de déconnexion
                navigate('/login'); // Redirection vers la page de connexion
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    };

    // Fonction pour retourner au tableau de bord principal
    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    // Vérification des privilèges administrateur
    if (currentUser?.role !== 'admin') {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    Access denied. Admin privileges required. {/* Accès refusé si non-admin */}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow">
                        {/* En-tête du tableau de bord administrateur */}
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="mb-0">
                                    <i className="fas fa-users-cog me-2"></i>
                                    Admin Dashboard
                                </h2>
                                <small className="opacity-75">Manage all platform users</small>
                            </div>
                            <div>
                                {/* Bouton retour au tableau de bord principal */}
                                <button 
                                    className="btn btn-outline-light me-2"
                                    onClick={handleBackToDashboard}
                                >
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Back to Dashboard
                                </button>
                                {/* Bouton pour afficher le formulaire d'ajout d'enseignant */}
                                <button 
                                    className="btn btn-outline-light me-2"
                                    onClick={() => setShowTeacherForm(!showTeacherForm)}
                                >
                                    <i className="fas fa-plus me-2"></i>
                                    Add Teacher
                                </button>
                                {/* Bouton de déconnexion */}
                                <button 
                                    className="btn btn-outline-warning"
                                    onClick={handleLogout}
                                >
                                    <i className="fas fa-sign-out-alt me-2"></i>
                                    Logout
                                </button>
                            </div>
                        </div>
                        
                        {/* Formulaire de création d'enseignant (conditionnel) */}
                        {showTeacherForm && (
                            <div className="card-body border-bottom bg-light">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 className="mb-0">
                                                <i className="fas fa-chalkboard-teacher me-2"></i>
                                                Create New Teacher
                                            </h4>
                                            {/* Bouton pour fermer le formulaire */}
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
                            {/* Cartes de statistiques des utilisateurs */}
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

                            {/* Tableau des utilisateurs */}
                            {loading ? (
                                // Indicateur de chargement
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
                                                            {/* Icône selon le rôle */}
                                                            <i className={`fas fa-${
                                                                user.role === 'admin' ? 'crown text-danger' : 
                                                                user.role === 'teacher' ? 'chalkboard-teacher text-warning' : 'user-graduate text-info'
                                                            } me-2`}></i>
                                                            {user.name}
                                                        </div>
                                                    </td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        {/* Badge coloré selon le rôle */}
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
                                                            {/* Formatage de la date de création */}
                                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        {/* Bouton de suppression (désactivé pour les admins) */}
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

                            {/* Message si aucun utilisateur trouvé */}
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