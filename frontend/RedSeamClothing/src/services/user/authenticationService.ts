import api from "../api";

export interface LoginResponse
{
    user: {
        email: string;
        id: number;
        name: string;
        profile_photo: string;
    };
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

const authenticationService = {
    // Login
    login: async (payload: LoginPayload): Promise<LoginResponse> =>
    {
        const { data } = await api.post<LoginResponse>("/login", payload, {
            headers: {
                Accept: "application/json",
            },
        });
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
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            },
        });
        return data;
    },

    // Logout
    logout: async (): Promise<void> =>
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
