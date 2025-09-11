import axios from './axios';

export const getInsumos = async () => {
  try {
    const response = await axios.get('/insumos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener insumos:', error);
    throw error;
  }
};
