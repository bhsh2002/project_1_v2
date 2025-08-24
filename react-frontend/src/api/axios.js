import axios from 'axios';

const API_BASE_URL = 'https://price.savana.ly/back/api/v1/';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem('access_token');
//     if (token) config.headers['Authorization'] = `Bearer ${token}`;
//     return config;
// });

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // هنا يمكن إضافة منطق refresh token إذا أردت
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
