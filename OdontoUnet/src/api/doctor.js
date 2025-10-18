import axios from "./axios";

// Obtener todos los doctores (público)
export const getDoctorsRequest = () => axios.get("/doctors");

// Obtener doctores con estadísticas (requiere admin)
export const getDoctorsStatsRequest = () => axios.get("/doctors-stats");
