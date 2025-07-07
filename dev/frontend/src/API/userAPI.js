import { $userHost, $userAuthHost } from './index';

export const registrationUser = async (email, password) => {
    return await $userHost.post('api/users/register', { email, password });
};

export const loginUser = async (email, password) => {
    return await $userHost.post('api/users/login', { email, password });
};

export const checkAuthUser = async () => {
    return await $userAuthHost.get('api/users/check');
};