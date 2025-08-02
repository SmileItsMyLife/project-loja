import { useEffect } from 'react';
import { deleteType, fetchTypes } from '../API/typeAPI';
import { useStore } from './useStore';

export function useType() {
    const { type } = useStore();

    const refreshTypes = async () => {
        try {
            const dataTypes = await fetchTypes();
            console.log('Fetched types:', dataTypes);
            type.setTypes(dataTypes);
            return { success: true };
        } catch (error) {
            console.error('Error fetching types:', error);
            return { success: false, error };
        }
    };

    const createAndRefreshType = async (typeName) => {
        const response = await type.addType(typeName);
        if (response instanceof Error) {
            return { success: false, error: response };
        } else {
            await refreshTypes();
            return { success: true };
        }
    };

    const removeAndRefreshType = async (typeId) => {
        const response = await deleteType(typeId);
        if (response instanceof Error) {
            return { success: false, error: response };
        } else {
            await refreshTypes();
            return { success: true };
        }
    };

    useEffect(() => {
        const getAndStoreTypes = async () => {
            try {
                const dataTypes = await fetchTypes();
                type.setTypes(dataTypes.data);
                console.log('Fetched types:', dataTypes);
                return { success: true };
            } catch (error) {
                console.error('Error fetching types:', error);
                return { success: false, error };
            }
        };
        getAndStoreTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        refreshTypes,
        createAndRefreshType,
        removeAndRefreshType,
        type
    };
}