import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_API || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export default api;