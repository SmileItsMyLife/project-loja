import { useState, useEffect } from 'react';
import { checkAuthUser } from '../API/userAPI';
import { useStore } from './useStore';
import { setUserContext, setUserContextDefault } from '../utils/contextSetData';

export const useAuth = () => {

    const [data, setData] = useState({
        isAuth: false,
        loading: true,
        error: null
    })

    const { user, product } = useStore();

    useEffect(() => {
        const checkAuthAndStoreData = async () => {
            try {
                if (localStorage.getItem('token')) {
                    const checkUserData = await checkAuthUser();

                    localStorage.setItem('token', checkUserData.data.token);

                    setUserContext(checkUserData.data.token, user);
                    setData({
                        ...data,
                        isAuth: true
                    });

                } else {
                    
                    setUserContextDefault(user, product);
                    setData({
                        ...data,
                        isAuth: true
                    });
                }
            } catch (error) {
                console.error('Error checking authentication:', error);

                setData({
                    ...data,
                    error: error,
                    isAuth: true
                });

            } finally {
                setData({
                    ...data,
                    loading: false
                });
            }
        };
        checkAuthAndStoreData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return data;
}