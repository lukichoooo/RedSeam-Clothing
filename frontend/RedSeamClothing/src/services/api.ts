import axios from 'axios';

const API_BASE_URL = 'https://api.redseam.redberryinternship.ge/api';

// Create an Axios instance with a base URL.
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
