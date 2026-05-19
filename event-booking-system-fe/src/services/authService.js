import { handleApi } from "../api/apiHandler";
import { authAxiosClient, axiosClientJson } from "../api/axiosClient";

export const login = async (email, password) => {
    try {
        return await handleApi(() =>
            axiosClientJson.post("/login", { email, password })
        );
    } catch (error) {
        console.error('Login error:', error);
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
