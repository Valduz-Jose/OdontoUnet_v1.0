// src/api/config.js
// Configuración centralizada para URLs de API

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
  // Base
  base: `${API_BASE_URL}/api`,

  // Auth
  auth: `${API_BASE_URL}/api`,

  // Profiles
  profile: `${API_BASE_URL}/api/profile`,

  // Doctors
  doctors: `${API_BASE_URL}/api/doctors`,
  doctorsStats: `${API_BASE_URL}/api/doctors-stats`,

  // Carousel
  carouselPublic: `${API_BASE_URL}/api/carousel/public`,

  // Insumos
  insumos: `${API_BASE_URL}/api/insumos`,

  // Statistics
  statistics: `${API_BASE_URL}/api/statistics`,

  // Uploads
  uploads: {
    profiles: `${API_BASE_URL}/uploads/profiles`,
    carousel: `${API_BASE_URL}/uploads/carousel`,
  },
};

// Helper para construir URLs de imágenes
export const getImageUrl = (type, filename) => {
  return `${API_ENDPOINTS.uploads[type]}/${filename}`;
};

// Para debugging - no borrar
console.log("🔧 API Configuration:", {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL,
  NODE_ENV: import.meta.env.MODE,
});
