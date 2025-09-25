import axios from "axios";

// Usar variable de entorno o fallback para desarrollo
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const instance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

export default instance;
