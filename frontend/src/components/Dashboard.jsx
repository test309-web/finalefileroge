import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';

const Dashboard = () => {
    const currentUser = getCurrentUser(); // Récupérer l'utilisateur connecté
    const navigate = useNavigate();

    // Fonction pour gérer la déconnexion
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

    // Fonction pour retourner au tableau de bord
    const handleBack = () => {
        navigate('/dashboard');
    };

    // Fonction pour obtenir le message de bienvenue selon le rôle
    const getWelcomeMessage = () => {
        switch(currentUser?.role) {
            case 'admin':
                return 'Administrator Dashboard - Manage the entire platform'; // Tableau de bord administrateur
            case 'teacher':
                return 'Teacher Dashboard - Create and manage your lessons and exercises'; // Tableau de bord enseignant
            case 'student':
                return 'Student Dashboard - Explore lessons and practice exercises'; // Tableau de bord étudiant
            default:
                return 'Welcome to your dashboard'; // Message par défaut
        }
    };

    // Fonction pour obtenir les statistiques selon le rôle
    const getStats = () => {
        const stats = {
            admin: [
                { title: 'Total Users', value: '150', icon: 'users', color: 'primary', link: '/admin/dashboard' },
                { title: 'Teachers', value: '25', icon: 'chalkboard-teacher', color: 'success', link: '/admin/dashboard' },
                { title: 'Students', value: '125', icon: 'user-graduate', color: 'info', link: '/admin/dashboard' },
                { title: 'Lessons', value: '80', icon: 'book', color: 'warning', link: '/lessons' }
            ],
            teacher: [
                { title: 'My Lessons', value: '12', icon: 'book', color: 'primary', link: '/lessons' },
                { title: 'My Exercises', value: '25', icon: 'tasks', color: 'success', link: '/exercises' },
                { title: 'Students', value: '45', icon: 'user-graduate', color: 'info', link: '#' },
                { title: 'Total Points', value: '1,250', icon: 'star', color: 'warning', link: '#' }
            ],
            student: [
                { title: 'Completed Lessons', value: '15', icon: 'book', color: 'primary', link: '/lessons' },
                { title: 'Solved Exercises', value: '32', icon: 'tasks', color: 'success', link: '/exercises' },
                { title: 'My Points', value: '450', icon: 'star', color: 'info', link: '#' },
                { title: 'Progress', value: '65%', icon: 'chart-line', color: 'warning', link: '#' }
            ]
        };

        return stats[currentUser?.role] || []; // Retourner les stats selon le rôle ou tableau vide
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    {/* En-tête du tableau de bord */}
                    <div className="card bg-light border-0 mb-4">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    {/* Bouton retour */}
                                    <button 
                                        className="btn btn-outline-secondary mb-3"
                                        onClick={handleBack}
                                    >
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Back to Dashboard
                                    </button>
                                    <h1 className="display-5 mb-2">
                                        Welcome, <span className="text-primary">{currentUser?.name}</span>!
                                    </h1>
                                    <p className="lead mb-0 text-muted">
                                        {getWelcomeMessage()}
                                    </p>
                                    <div className="mt-3">
                                        {/* Badge du rôle utilisateur */}
                                        <span className={`badge bg-${
                                            currentUser?.role === 'admin' ? 'danger' : 
                                            currentUser?.role === 'teacher' ? 'warning' : 'info'
                                        } fs-6`}>
                                            <i className={`fas fa-${
                                                currentUser?.role === 'admin' ? 'crown' : 
                                                currentUser?.role === 'teacher' ? 'chalkboard-teacher' : 'user-graduate'
                                            } me-2`}></i>
                                            {currentUser?.role?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-4 text-end">
                                    {/* Bouton de déconnexion */}
                                    <button 
                                        className="btn btn-outline-danger btn-lg"
                                        onClick={handleLogout}
                                    >
                                        <i className="fas fa-sign-out-alt me-2"></i>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section des statistiques */}
                    <div className="row g-4 mb-5">
                        {getStats().map((stat, index) => (
                            <div key={index} className="col-md-6 col-lg-3">
                                <Link to={stat.link} className="card text-decoration-none text-dark shadow-hover border-0">
                                    <div className={`card-body text-center p-4 bg-${stat.color} bg-opacity-10`}>
                                        <div className={`text-${stat.color} mb-3`}>
                                            <i className={`fas fa-${stat.icon} fa-2x`}></i>
                                        </div>
                                        <h3 className="card-title fw-bold">{stat.value}</h3>
                                        <p className="card-text text-muted">{stat.title}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Section des actions rapides */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white border-0">
                                    <h4 className="mb-0">
                                        <i className="fas fa-bolt text-warning me-2"></i>
                                        Quick Actions
                                    </h4>
                                </div>
                                <div className="card-body">
                                    <div className="row g-4">
                                        {/* Actions pour l'administrateur */}
                                        {currentUser?.role === 'admin' && (
                                            <>
                                                <div className="col-md-4">
                                                    <Link to="/admin/dashboard" className="card text-decoration-none h-100 border-0 shadow-hover">
                                                        <div className="card-body text-center p-4">
                                                            <i className="fas fa-users-cog fa-3x text-primary mb-3"></i>
                                                            <h5 className="card-title">User Management</h5>
                                                            <p className="card-text text-muted">Manage all users, teachers, and administrators</p>
                                                            <span className="btn btn-outline-primary btn-sm">Manage Users</span>
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div className="col-md-4">
                                                    <Link to="/lessons" className="card text-decoration-none h-100 border-0 shadow-hover">
                                                        <div className="card-body text-center p-4">
                                                            <i className="fas fa-book fa-3x text-success mb-3"></i>
                                                            <h5 className="card-title">All Lessons</h5>
                                                            <p className="card-text text-muted">View and manage all platform lessons</p>
                                                            <span className="btn btn-outline-success btn-sm">View Lessons</span>
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div className="col-md-4">
                                                    <Link to="/exercises" className="card text-decoration-none h-100 border-0 shadow-hover">
                                                        <div className="card-body text-center p-4">
                                                            <i className="fas fa-tasks fa-3x text-warning mb-3"></i>
                                                            <h5 className="card-title">All Exercises</h5>
                                                            <p className="card-text text-muted">Manage all exercises and assignments</p>
                                                            <span className="btn btn-outline-warning btn-sm">View Exercises</span>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </>
                                        )}
                                        
                                        {/* Actions pour l'enseignant */}
                                        {currentUser?.role === 'teacher' && (
                                            <>
                                                {/* Créer une leçon */}
                                                <div className="col-md-4">
                                                    <Link to="/lessons/create" className="card text-decoration-none h-100 border-0 shadow-hover">
                                                        <div className="card-body text-center p-4">
                                                            <i className="fas fa-plus-circle fa-3x text-primary mb-3"></i>
                                                            <h5 className="card-title">Create Lesson</h5>
                                                            <p className="card-text text-muted">Create new learning materials for students</p>
                                                            <span className="btn btn-outline-primary btn-sm">Create New</span>
                                                        </div>
                                                    </Link>
                                                </div>
                                                {/* Créer un exercice */}
                                                <div className="col-md-4">
                                                    <Link to="/exercises/create" className="card text-decoration-none h-100 border-0 shadow-hover">
                                                        <div className="card-body text-center p-4">
                                                            <i className="fas fa-tasks fa-3x text-success mb-3"></i>
                                                            <h5 className="card-title">Create Exercise</h5>
                                                            <p className="card-text text-muted">Create new exercises and assignments</p>
                                                            <span className="btn btn-outline-success btn-sm">Create New</span>
                                                        </div>
                                                    </Link>
                                                </div>
                                                {/* Gérer mes leçons */}
                                                <div className="col-md-4">
                                                    <Link to="/lessons" className="card text-decoration-none h-100 border-0 shadow-hover">
                                                        <div className="card-body text-center p-4">
                                                            <i className="fas fa-book-open fa-3x text-info mb-3"></i>
                                                            <h5 className="card-title">My Lessons</h5>
                                                            <p className="card-text text-muted">Manage your existing lessons and content</p>
                                                            <span className="btn btn-outline-info btn-sm">Manage</span>
                                                        </div>
                                                    </Link>
                                                </div>
                                                
                                                {/* Section ajoutée : Gérer les exercices */}
                                                <div className="col-md-4">
                                                    <Link to="/exercises" className="card text-decoration-none h-100 border-0 shadow-hover">
                                                        <div className="card-body text-center p-4">
                                                            <i className="fas fa-cogs fa-3x text-warning mb-3"></i>
                                                            <h5 className="card-title">Manage Exercises</h5>
                                                            <p className="card-text text-muted">View, edit and delete your exercises</p>
                                                            <span className="btn btn-outline-warning btn-sm">Manage Exercises</span>
                                                        </div>
                                                    </Link>
                                                </div>
                                                
                                                {/* Analytics des exercices */}
                                                <div className="col-md-4">
                                                    <div className="card text-decoration-none h-100 border-0 shadow-hover bg-light">
                                                        <div className="card-body text-center p-4">
                                                            <i className="fas fa-chart-bar fa-3x text-secondary mb-3"></i>
                                                            <h5 className="card-title">Exercise Analytics</h5>
                                                            <p className="card-text text-muted">View performance and completion statistics</p>
                                                            <span className="btn btn-outline-secondary btn-sm">View Analytics</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        
                                        {/* Actions pour l'étudiant */}
                                        {currentUser?.role === 'student' && (
                                            <>
                                                <div className="col-md-4">
                                                    <Link to="/lessons" className="card text-decoration-none h-100 border-0 shadow-hover">
                                                        <div className="card-body text-center p-4">
                                                            <i className="fas fa-book fa-3x text-primary mb-3"></i>
                                                            <h5 className="card-title">Browse Lessons</h5>
                                                            <p className="card-text text-muted">Explore available learning materials</p>
                                                            <span className="btn btn-outline-primary btn-sm">Start Learning</span>
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div className="col-md-4">
                                                    <Link to="/exercises" className="card text-decoration-none h-100 border-0 shadow-hover">
                                                        <div className="card-body text-center p-4">
                                                            <i className="fas fa-tasks fa-3x text-success mb-3"></i>
                                                            <h5 className="card-title">Practice Exercises</h5>
                                                            <p className="card-text text-muted">Test your knowledge with exercises</p>
                                                            <span className="btn btn-outline-success btn-sm">Practice Now</span>
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="card text-decoration-none h-100 border-0 shadow-hover">
                                                        <div className="card-body text-center p-4">
                                                            <i className="fas fa-chart-line fa-3x text-info mb-3"></i>
                                                            <h5 className="card-title">My Progress</h5>
                                                            <p className="card-text text-muted">Track your learning journey</p>
                                                            <span className="btn btn-outline-info btn-sm">View Progress</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section activité récente */}
                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white border-0">
                                    <h4 className="mb-0">
                                        <i className="fas fa-history text-info me-2"></i>
                                        Recent Activity
                                    </h4>
                                </div>
                                <div className="card-body">
                                    <div className="list-group list-group-flush">
                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <i className="fas fa-book text-success me-2"></i>
                                                <span>Last login was successful</span>
                                            </div>
                                            <small className="text-muted">Just now</small>
                                        </div>
                                        <div className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <i className="fas fa-user-check text-primary me-2"></i>
                                                <span>Welcome to your dashboard</span>
                                            </div>
                                            <small className="text-muted">Today</small>
                                        </div>
                                        {/* Activités spécifiques à l'enseignant */}
                                        {currentUser?.role === 'teacher' && (
                                            <>
                                                <div className="list-group-item d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <i className="fas fa-tasks text-warning me-2"></i>
                                                        <span>You have exercises to manage</span>
                                                    </div>
                                                    <small className="text-muted">Click on Manage Exercises</small>
                                                </div>
                                                <div className="list-group-item d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <i className="fas fa-edit text-info me-2"></i>
                                                        <span>You can edit and delete your exercises</span>
                                                    </div>
                                                    <small className="text-muted">Available now</small>
                                                </div>
                                            </>
                                        )}
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

export default Dashboard;