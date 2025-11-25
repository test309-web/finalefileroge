import API from './api';

// Fonction pour récupérer tous les utilisateurs (admin seulement)
export const getAllUsers = async () => {
    try {
        const response = await API.get('/admin/users');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

// Fonction pour créer un nouvel utilisateur (admin seulement)
export const createUser = async (userData) => {
    try {
        const response = await API.post('/admin/users', userData);
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