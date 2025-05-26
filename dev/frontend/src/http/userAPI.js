import { $userHost, $userAuthHost } from './index';
import { jwtDecode } from 'jwt-decode';

/**
 * Centraliza o tratamento de erros HTTP.
 */
const handleError = (error) => {
    if (error.response) {
        console.error('Error response status:', error.response.status);
        return error.response.status;
    } else if (error.request) {
        console.error('No response received');
        return 500;
    } else {
        console.error('Request setup error:', error.message);
        return 500;
    }
};

export const registration = async (email, password) => {
    try {
        if (!email || !password) throw new Error('Email and password are required');

        const response = await $userHost.post('api/users/registration', { email, password });
        localStorage.setItem('token', response.data.token);
        return jwtDecode(response.data.token);
    } catch (error) {
        return handleError(error);
    }
};

export const login = async (email, password) => {
    try {
        if (!email || !password) throw new Error('Email and password are required');

        const response = await $userHost.post('api/users/login', { email, password });
        localStorage.setItem('token', response.data.token);
        return jwtDecode(response.data.token);
    } catch (error) {
        return handleError(error);
    }
};

export const check = async () => {
    try {
        const response = await $userAuthHost.get('api/users/auth');
        localStorage.setItem('token', response.data.token);
        return jwtDecode(response.data.token);
    } catch (error) {
        return handleError(error);
    }
};