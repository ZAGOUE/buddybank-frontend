import axios from "axios";

// On récupère l'URL API depuis la variable d'environnement Netlify
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

console.log("API_BASE_URL =", process.env.REACT_APP_API_BASE_URL);

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
