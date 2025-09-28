import { triggerAuthUpdate } from "../../utils/authSync";
import api from "../api";

export interface User
{
    email: string;
    id: number;
    name: string;
    profile_photo: string; // The URL you want to use
}

export interface LoginResponse
{
    user: User;
    token: string;
}

export interface RegisterResponse extends LoginResponse { }

export interface LoginPayload
{
    email: string;
    password: string;
}

export interface RegisterPayload
{
    avatar?: File | null;
    email: string;
    password: string;
    password_confirmation: string;
    username: string;
}

// Helper function to save credentials
const saveAuthData = (data: LoginResponse): void =>
{
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
};

const authenticationService = {
    // Login
    login: async (payload: LoginPayload): Promise<LoginResponse> =>
    {
        const { data } = await api.post<LoginResponse>("/login", payload, {
            headers: {
                Accept: "application/json",
            },
        });

        // ✅ Save the token and user object upon successful login
        saveAuthData(data);
        triggerAuthUpdate();

        return data;
    },

    // Register
    register: async (payload: RegisterPayload): Promise<RegisterResponse> =>
    {
        const formData = new FormData();
        if (payload.avatar) formData.append("avatar", payload.avatar);
        formData.append("username", payload.username);
        formData.append("email", payload.email);
        formData.append("password", payload.password);
        formData.append("password_confirmation", payload.password_confirmation);

        const { data } = await api.post<RegisterResponse>("/register", formData, {
            headers: {
                Accept: "application/json",
            },
        });

        saveAuthData(data);

        return data;
    },

    // Logout
    logout: (): void => // Changed to void since it's only synchronous localStorage calls
    {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    // Check if user is logged in
    isLoggedIn: (): boolean =>
    {
        return !!localStorage.getItem("token");
    },

    // Get token from localStorage
    getToken: (): string | null =>
    {
        return localStorage.getItem("token");
    },
};

export default authenticationService;