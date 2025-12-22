import { api } from 'boot/axios'; 

const endpoint = '/renter';

export const locatarioService = {

  async getAll() {
    try {
      const response = await api.get(endpoint);
      return response.data; 
    } catch (error) {
      if (error.response?.status === 403) {
          throw new Error('Acesso negado. Verifique suas credenciais.');
      }
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async update(id, data) {
    try {
      const response = await api.put(`${endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      await api.delete(`${endpoint}/${id}`);
    } catch (error) {
      throw error;
    }
  }
};