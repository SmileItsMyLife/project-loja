import { deleteType, fetchTypes } from '../API/typeAPI';
import { useStore } from './useStore';

export function useType() {
    const { type } = useStore();

    const getAndStoreTypes = async () => {
        try {
            const dataTypes = await fetchTypes();
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
            await getAndStoreTypes();
            return { success: true };
        }
    };

    const removeAndRefreshType = async (typeId) => {
        const response = await deleteType(typeId);
        if (response instanceof Error) {
            return { success: false, error: response };
        } else {
            await getAndStoreTypes();
            return { success: true };
        }
    };

    return {
        getAndStoreTypes,
        createAndRefreshType,
        removeAndRefreshType,
        type
    };
}