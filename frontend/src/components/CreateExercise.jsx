import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createExercise } from '../services/exerciseService';
import { getLessons } from '../services/lessonService';
import { getCurrentUser } from '../services/authService';

const CreateExercise = () => {
    const navigate = useNavigate();
    
    // État pour stocker les données du formulaire d'exercice
    const [formData, setFormData] = useState({
        title: '', // Titre de l'exercice
        description: '', // Description de l'exercice
        content: '', // Contenu/énoncé de l'exercice
        solution: '', // Solution de l'exercice
        level: 'beginner', // Niveau de difficulté (défaut: débutant)
        points: 10, // Points attribués (défaut: 10)
        lesson_id: '' // Leçon associée (optionnelle)
    });
    
    const [lessons, setLessons] = useState([]); // Liste des leçons disponibles
    const [validationErrors, setValidationErrors] = useState({}); // Erreurs de validation
    const [loading, setLoading] = useState(false); // État de chargement
    const [currentUser, setCurrentUser] = useState(null); // Utilisateur connecté

    // Effet pour charger l'utilisateur et les leçons au montage du composant
    useEffect(() => {
        const user = getCurrentUser(); // Récupérer l'utilisateur connecté
        setCurrentUser(user);
        loadLessons(); // Charger les leçons disponibles
    }, []);

    // Fonction pour charger les leçons selon le rôle de l'utilisateur
    const loadLessons = async () => {
        try {
            let lessonsData;
            if (currentUser?.role === 'teacher') {
                // Pour l'enseignant : récupérer uniquement ses propres leçons
                const response = await fetch('http://127.0.0.1:8000/api/teacher/lessons', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token d'authentification
                        'Content-Type': 'application/json'
                    }
                });
                lessonsData = await response.json();
            } else {
                // Pour l'admin ou autres rôles : récupérer toutes les leçons
                lessonsData = await getLessons();
            }
            
            // Mettre à jour la liste des leçons si la requête réussit
            if (lessonsData.status === 'success') {
                setLessons(lessonsData.data || []);
            }
        } catch (error) {
            console.error('Error loading lessons:', error);
        }
    };

    // Fonction pour retourner au tableau de bord
    const handleBack = () => {
        navigate('/dashboard');
    };

    // Fonction pour gérer les changements dans les champs du formulaire
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    }

    // Fonction pour soumettre le formulaire de création d'exercice
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setValidationErrors({}); // Réinitialiser les erreurs
        
        try {
            await createExercise(formData); // Appel API pour créer l'exercice
            navigate('/exercises'); // Redirection vers la liste des exercices
        } catch (error) {
            if (error.errors) {
                setValidationErrors(error.errors); // Afficher les erreurs de validation
            } else {
                alert(error.message || 'Failed to create exercise'); // Erreur générale
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    {/* Bouton de retour */}
                    <button 
                        className="btn btn-outline-secondary mb-3"
                        onClick={handleBack}
                    >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Dashboard
                    </button>

                    {/* Carte principale du formulaire */}
                    <div className="card shadow">
                        <div className="card-header bg-success text-white">
                            <h2 className="mb-0">
                                <i className="fas fa-tasks me-2"></i>
                                Create New Exercise
                            </h2>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                {/* Champ : Titre de l'exercice */}
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input 
                                        type="text" 
                                        name="title" 
                                        className={`form-control ${validationErrors.title ? 'is-invalid' : ''}`}
                                        placeholder="Enter exercise title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.title && 
                                        <div className="invalid-feedback">{validationErrors.title[0]}</div>
                                    }
                                </div>
                                
                                {/* Champ : Description de l'exercice */}
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea 
                                        name="description" 
                                        className={`form-control ${validationErrors.description ? 'is-invalid' : ''}`}
                                        rows="3"
                                        placeholder="Enter exercise description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.description && 
                                        <div className="invalid-feedback">{validationErrors.description[0]}</div>
                                    }
                                </div>
                                
                                {/* Champ : Contenu/énoncé de l'exercice */}
                                <div className="mb-3">
                                    <label htmlFor="content" className="form-label">Exercise Content</label>
                                    <textarea 
                                        name="content" 
                                        className={`form-control ${validationErrors.content ? 'is-invalid' : ''}`}
                                        rows="4"
                                        placeholder="Enter the exercise question or problem"
                                        value={formData.content}
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.content && 
                                        <div className="invalid-feedback">{validationErrors.content[0]}</div>
                                    }
                                </div>

                                {/* Champ : Solution de l'exercice */}
                                <div className="mb-3">
                                    <label htmlFor="solution" className="form-label">Solution</label>
                                    <textarea 
                                        name="solution" 
                                        className={`form-control ${validationErrors.solution ? 'is-invalid' : ''}`}
                                        rows="4"
                                        placeholder="Enter the solution or answer"
                                        value={formData.solution}
                                        onChange={handleChange}
                                        required 
                                    />
                                    {validationErrors.solution && 
                                        <div className="invalid-feedback">{validationErrors.solution[0]}</div>
                                    }
                                </div>

                                {/* Sélecteur : Niveau de difficulté */}
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

                                {/* Champ : Points attribués */}
                                <div className="mb-3">
                                    <label htmlFor="points" className="form-label">Points</label>
                                    <input 
                                        type="number" 
                                        name="points" 
                                        className={`form-control ${validationErrors.points ? 'is-invalid' : ''}`}
                                        placeholder="Enter points for this exercise"
                                        value={formData.points}
                                        onChange={handleChange}
                                        min="1"
                                        required 
                                    />
                                    {validationErrors.points && 
                                        <div className="invalid-feedback">{validationErrors.points[0]}</div>
                                    }
                                </div>

                                {/* Sélecteur : Leçon associée (optionnelle) */}
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
                                                {lesson.title} - {lesson.level} {/* Affichage titre et niveau */}
                                            </option>
                                        ))}
                                    </select>
                                    {validationErrors.lesson_id && 
                                        <div className="invalid-feedback">{validationErrors.lesson_id[0]}</div>
                                    }
                                </div>
                                
                                {/* Boutons d'action */}
                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-success"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-plus me-2"></i>
                                                Create Exercise
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

export default CreateExercise;