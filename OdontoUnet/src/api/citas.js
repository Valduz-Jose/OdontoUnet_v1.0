import axios from "./axios"; // tu instancia de axios con baseURL y token
import { getPatientRequest } from "./patient";
// Crear una nueva cita
export const createCita = async (data) => {
  try {
    // Traer paciente
    const paciente = await getPatientRequest(data.pacienteId);

    // Agregar odontograma actual del paciente a la cita
    data.odontograma = paciente.odontograma;

    const response = await axios.post("/citas", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear la cita:", error);
    throw error;
  }
};

// Obtener todas las citas
export const getCitas = async () => {
  try {
    const response = await axios.get("/citas");
    return response.data;
  } catch (error) {
    console.error("Error al obtener las citas:", error);
    throw error;
  }
};

// Obtener citas por paciente
export const getCitasByPaciente = async (pacienteId) => {
  try {
    const response = await axios.get(`/citas/paciente/${pacienteId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las citas del paciente:", error);
    throw error;
  }
};

// Actualizar cita
export const updateCita = async (id, data) => {
  try {
    const response = await axios.put(`/citas/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    throw error;
  }
};

// Eliminar cita
export const deleteCita = async (id) => {
  try {
    await axios.delete(`/citas/${id}`);
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    throw error;
  }
};
export const getUltimaCitaPaciente = async (pacienteId) => {
  return await axios.get(`/citas/${pacienteId}/ultima`);
};