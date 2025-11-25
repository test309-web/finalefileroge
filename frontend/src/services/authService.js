import API from './api';

// Fonction pour l'inscription d'un nouvel utilisateur
export const register = async (userData) => {
    try {
        const response = await API.post('/register', userData);
        // Si la réponse contient un token, le sauvegarder dans le localStorage
        if (response.data.authorisation.token) {
            localStorage.setItem('token', response.data.authorisation.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

// Fonction pour la connexion d'un utilisateur
export const login = async (userData) => {
    try {
        const response = await API.post('/login', userData);
        // Sauvegarder le token et les données utilisateur après une connexion réussie
        if (response.data.authorisation.token) {
            localStorage.setItem('token', response.data.authorisation.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

// Fonction pour récupérer les détails de l'utilisateur connecté
export const getUserDetails = async () => {
    try {
        const response = await API.get('/userdetail');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

// Fonction pour déconnecter l'utilisateur
export const logout = async () => {
    try {
        await API.post('/logout'); // Appel API pour invalider le token côté serveur
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Nettoyer le localStorage et rediriger vers la page de connexion
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
};

// Fonction utilitaire pour vérifier si l'utilisateur est authentifié
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; // Retourne true si le token existe, false sinon
};

// Fonction pour récupérer les données de l'utilisateur connecté depuis le localStorage
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null; // Parser les données JSON ou retourner null
};

// Fonction pour récupérer tous les utilisateurs (admin seulement)
export const getAllUsers = async () => {
    try {
        const response = await API.get('/admin/users');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

// Fonction pour créer un nouveau compte enseignant (admin seulement)
export const createTeacher = async (teacherData) => {
    try {
        const response = await API.post('/admin/teachers', teacherData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

// Fonction pour mettre à jour un utilisateur (admin seulement)
export const updateUser = async (id, userData) => {
    try {
        const response = await API.put(`/admin/users/${id}`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

// Fonction pour supprimer un utilisateur (admin seulement)
export const deleteUser = async (id) => {
    try {
        const response = await API.delete(`/admin/users/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};