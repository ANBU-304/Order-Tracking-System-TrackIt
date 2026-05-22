// src/services/authService.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:9090/api/auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor to attach token to all requests
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

// ✅ Interceptor to handle 401 responses (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const authService = {
  login: async (email, password) => {
    const response = await api.post("/login", { email, password });
    return response;
  },

  register: async (userData) => {
    const response = await api.post("/register", userData);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  },

  getUserByEmail: async (email) => {
    const response = await api.get(`/email/${email}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/update/${id}`, userData);
    return response.data;
  },
};

export default authService;