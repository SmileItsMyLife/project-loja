import {useState, useEffect} from 'react';
import { check } from '../API/userAPI';
import { useStore } from '../store/storeContext';

export const useAuth = () => {

    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useStore();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const checkUserData = await check();
                    if (typeof checkUserData === 'number') {
                        setError(checkUserData)
                        return setIsAuth(false);
                    } else {
                        console.log(checkUserData);
                        user.setIsAuth(true);  
                        return setIsAuth(true);
                    }
                } else {
                    setIsAuth(false);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsAuth(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    });

    return {isAuth, loading, error};
}