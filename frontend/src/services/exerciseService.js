
import API from './api';

export const getExercises = async () => {
    try {
        const response = await API.get('/exercises');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

export const getExercise = async (id) => {
    try {
        const response = await API.get(`/exercises/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

export const createExercise = async (exerciseData) => {
    try {
        const response = await API.post('/exercises', exerciseData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

export const searchExercises = async (searchData) => {
    try {
        const response = await API.get('/exercises/search/by', { params: searchData });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

export const assignPoints = async (pointsData) => {
    try {
        const response = await API.post('/exercises/assign-points', pointsData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};