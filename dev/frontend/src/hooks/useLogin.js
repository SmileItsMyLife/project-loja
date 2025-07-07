import { loginUser } from "../API/userAPI";
import { setUserContext } from "../utils/contextSetData";
import { useStore } from "./useStore";

export const useLogin = () => {
    const { user } = useStore();

    const loginAndAuth = async (email, password) => {
        try {
            const response = await loginUser(email, password);
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

    return { loginAndAuth };
};