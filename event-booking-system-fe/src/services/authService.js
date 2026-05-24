import { handleApi } from "../api/apiHandler";
import { authAxiosClient, axiosClient, axiosClientMultipart } from "../api/axiosClient";
import { buildEventFormData } from "../utils/formData";

export const login = async (email, password) => {
    try {
        return await handleApi(() =>
            axiosClient.post("/login", { email, password })
        );
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const formData = buildEventFormData(userData);
        return await handleApi(() =>
            axiosClientMultipart().post("/users", formData)
        );
    } catch (error) {
        console.error('Register error:', error);
        throw error;
    }
};

export const getMyInfo = async (token) => {
    try {
        return await handleApi(() =>
            authAxiosClient(token).get("/secure/me")
        );
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};
