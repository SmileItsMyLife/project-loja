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
                    setData(prev => ({
                        ...prev,
                        isAuth: true
                    }));

                    console.log(1)

                } else {

                    setUserContextDefault(user, product);
                    setData(prev => ({
                        ...prev,
                        isAuth: false
                    }));

                    console.log(2)
                }
            } catch (error) {
                console.error('Error checking authentication:', error);

                setData(prev => ({
                    ...prev,
                    error: error,
                    isAuth: false
                }));

            } finally {
                setData(prev => ({
                    ...prev,
                    loading: false
                }));
            }
        };
        checkAuthAndStoreData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return data;
}