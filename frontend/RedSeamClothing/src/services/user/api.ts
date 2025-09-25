import axios from 'axios';

// Create an Axios instance with a base URL.
// This instance will be used for all API calls to ensure consistency.
const api = axios.create({
    baseURL: 'https://api.your-domain.com/api', // Replace with your actual backend API URL
    headers: {
        'Content-Type': 'application/json',
        // Note: The Authorization header is often set dynamically after user login.
        // You can add an interceptor here to attach a token from a secure location (e.g., localStorage).
        // 'Authorization': `Bearer YOUR_AUTH_TOKEN`,
    },
});

// You can add interceptors here to handle global requests and responses.
// Example for adding a token:
// api.interceptors.request.use(config => {
//     const token = localStorage.getItem('userToken');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

export default api;
