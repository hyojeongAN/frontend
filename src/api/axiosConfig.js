import axios from 'axios';
import localforage from 'localforage';

const API_BASE_URL = 'http://localhost:8082/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        if (config.headers['Authorization']) { // 이미 Authorization 헤더가 있으면 (로그인 API처럼) 추가하지 않음
            return config;
        }

        const token = await localforage.getItem('jwtToken');
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && (error.response.status === 401 || error.response.status === 403)) { //&& !originalRequest._retry) {
            originalRequest._retry = true; 
            console.warn("401 Unauthorized 또는 403 Forbidden - 토큰 만료 또는 유효하지 않음. 로그인 화면으로 이동합니다.");
            
            await localforage.removeItem('jwtToken'); // 만료된 토큰 삭제

            // error.response.data.isAuthError = true;
            
            // window.location.href = '/login'; // 로그인 페이지로 리다이렉트
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;