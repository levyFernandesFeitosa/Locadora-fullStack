import { api } from 'boot/axios';

const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });

      const token = response.data?.token;

      if (token) {
        localStorage.setItem('authToken', token);
        return response.data;
      } else {
        throw new Error('Resposta de login incompleta. Token não recebido.');
      }
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
};

export default authService;