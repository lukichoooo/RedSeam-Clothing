import axios from 'axios';

const API_BASE_URL = 'https://api.redseam.redberryinternship.ge/api';

// Create an Axios instance with a base URL.
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export default api;
