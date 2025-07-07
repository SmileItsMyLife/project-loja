import { registrationUser } from "../API/userAPI";
import { setUserContext } from "../utils/contextSetData";
import { useStore } from "./useStore";

export const useRegistration = () => {
    const { user } = useStore();

    const registerAndAuth = async (email, password) => {
        try {
            const response = await registrationUser(email, password);
            if (response instanceof Error) {
                return { success: false, error: response };
            } else {
                localStorage.setItem('token', response.data.token);
                setUserContext(response.data.token, user);
                return { success: true };
            }
        } catch (error) {
            return { success: false, error };
        }
    };

    return { registerAndAuth };
};