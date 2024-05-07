import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

export const registration = async (email, password) => {
    try {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        const res = await $host.post('api/users/registration', { email, password });
        if (res.status === 200) {
            localStorage.setItem('token', res.data.token);
            return jwtDecode(res.data.token); // Return decoded JWT token
        }
        // Handle other successful responses if necessary
    } catch (error) {
        // Handle errors
        if (error.response) {
            // Request was made and server responded with a status code that falls out of the range of 2xx
            console.error('Error response status:', error.response.status);
            return error.response.status; // Return status code of error
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received');
            return 500; // Return a generic error status code
        } else {
            // Something happened in setting up the request that triggered an error
            console.error('Request setup error:', error.message);
            return 500; // Return a generic error status code
        }
    }
};

export const login = async (email, password) => {
    try {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        const { data } = await $host.post('api/users/login', { email, password });
        localStorage.setItem('token', data.token);
        return jwtDecode(data.token); // Return decoded JWT token
    } catch (error) {
        // Handle errors
        if (error.response) {
            // Request was made and server responded with a status code that falls out of the range of 2xx
            console.error('Error response status:', error.response.status);
            return error.response.status; // Return status code of error
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received');
            return 500; // Return a generic error status code
        } else {
            // Something happened in setting up the request that triggered an error
            console.error('Request setup error:', error.message);
            return 500; // Return a generic error status code
        }
    }
};

export const check = async () => {
    const { data } = await $authHost.get('api/users/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}
