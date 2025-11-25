import API from './api';

// Fonction pour récupérer tous les exercices
export const getExercises = async () => {
    try {
        const response = await API.get('/exercises');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

// Fonction pour récupérer un exercice spécifique par son ID
export const getExercise = async (id) => {
    try {
        const response = await API.get(`/exercises/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

// Fonction pour créer un nouvel exercice
export const createExercise = async (exerciseData) => {
    try {
        const response = await API.post('/exercises', exerciseData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

// Fonction pour mettre à jour un exercice existant
export const updateExercise = async (id, exerciseData) => {
    try {
        const response = await API.put(`/exercises/${id}`, exerciseData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

// Fonction pour supprimer un exercice
export const deleteExercise = async (id) => {
    try {
        const response = await API.delete(`/exercises/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

// Fonction pour rechercher des exercices avec des critères spécifiques
export const searchExercises = async (searchData) => {
    try {
        const response = await API.get('/exercises/search/by', { params: searchData });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

// Fonction pour attribuer des points pour un exercice
export const assignPoints = async (pointsData) => {
    try {
        const response = await API.post('/exercises/assign-points', pointsData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};