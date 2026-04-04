import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getApiErrorMessage = (error, fallback = "Something went wrong.") => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (!error?.response) {
    return "Cannot connect to server. Please make sure backend is running.";
  }

  return fallback;
};

export default api;
