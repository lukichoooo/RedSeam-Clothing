import axios from 'axios';

// Create an Axios instance with a base URL.
const api = axios.create({
    baseURL: 'https://api.redseam.redberryinternship.ge/api', // Replace with your actual backend API URL
    headers: {
        'Content-Type': 'application/json',
    },
});


export default api;
