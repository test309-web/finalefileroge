import axios from 'axios';

// Création d'une instance Axios avec une configuration de base
const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // URL de base de l'API backend
    withCredentials: true, // Permet l'envoi des cookies d'authentification
});

// Intercepteur de requêtes : exécuté avant chaque appel API
API.interceptors.request.use(
    (config) => {
        // Récupérer le token JWT depuis le localStorage
        const token = localStorage.getItem('token');
        
        // Si un token existe, l'ajouter dans les en-têtes de la requête
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config; // Retourner la configuration modifiée
    },
    (error) => {
        // En cas d'erreur lors de la configuration de la requête
        return Promise.reject(error);
    }
);

// Intercepteur de réponses : exécuté après chaque réponse API
API.interceptors.response.use(
    (response) => {
        // Si la réponse est réussie, la retourner directement
        return response;
    },
    (error) => {
        // Vérifier si l'erreur est une erreur 401 (Non autorisé)
        if (error.response && error.response.status === 401) {
            // Supprimer les données d'authentification du localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Rediriger vers la page de connexion
            window.location.href = '/login';
        }
        
        // Rejeter l'erreur pour qu'elle soit gérée par le code appelant
        return Promise.reject(error);
    }
);

export default API;