import API from './api';

export const getAllUsers = async () => {
    try {
        const response = await API.get('/admin/users');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

export const createUser = async (userData) => {
    try {
        const response = await API.post('/admin/users', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await API.delete(`/admin/users/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};