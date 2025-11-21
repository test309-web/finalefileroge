import API from './api';

export const register = async (userData) => {
    try {
        const response = await API.post('/register', userData);
        if (response.data.authorisation.token) {
            localStorage.setItem('token', response.data.authorisation.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

export const login = async (userData) => {
    try {
        const response = await API.post('/login', userData);
        if (response.data.authorisation.token) {
            localStorage.setItem('token', response.data.authorisation.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

export const getUserDetails = async () => {
    try {
        const response = await API.get('/userdetail');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

export const logout = async () => {
    try {
        await API.post('/logout');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getAllUsers = async () => {
    try {
        const response = await API.get('/admin/users');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

export const createTeacher = async (teacherData) => {
    try {
        const response = await API.post('/admin/teachers', teacherData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Network error' };
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await API.put(`/admin/users/${id}`, userData);
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