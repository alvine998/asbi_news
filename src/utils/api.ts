// src/api/axiosInstance.ts
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/', // Set your API base URL
    timeout: 10000, // Optional: Timeout in milliseconds
    headers: {
        'Content-Type': 'application/json', // Default content type
        'bearer-token': process.env.NEXT_PUBLIC_BEARER_TOKEN || "",
    },
});

// Add a request interceptor
// axiosInstance.interceptors.request.use(
//     (config) => {
//         // Example: Attach Authorization token if available
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle errors globally
        if (error.response) {
            console.error('API Error:', error.response.data);
        } else {
            console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
