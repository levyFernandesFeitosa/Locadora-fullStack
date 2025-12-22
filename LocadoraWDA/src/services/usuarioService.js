import { api } from 'boot/axios';

/**
 * Módulo de Serviço para a API de Usuários.
 * Abstrai as chamadas HTTP.
 */

export const usuarioService = {
  /**
   * Obtém a lista de todos os usuários.
   * @returns {Promise<Array<Object>>} A lista de usuários.
   */
  async listarUsuarios() {
    try {
      const response = await api.get('/user');
      // A resposta da API pode ser um array direto, ou um objeto com a propriedade 'data'.
      // Adapte esta linha se necessário:
      return response.data; 
    } catch (error) {
      console.error('Erro ao listar usuários:', error.response?.data || error.message);
      // Rejeita a Promise para que o componente possa lidar com o erro
      throw error; 
    }
  },

  /**
   * Cadastra um novo usuário.
   * @param {Object} dados - Dados do novo usuário (name, email, password, role).
   * @returns {Promise<Object>} O usuário recém-criado.
   */
  async criarUsuario(dados) {
    try {
      const response = await api.post('/user', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Atualiza um usuário existente.
   * @param {number|string} id - ID do usuário.
   * @param {Object} dados - Dados a serem atualizados.
   * @returns {Promise<Object>} O usuário atualizado.
   */
  async atualizarUsuario(id, dados) {
    try {
      const response = await api.put(`/user/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar usuário ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Deleta um usuário.
   * @param {number|string} id - ID do usuário.
   * @returns {Promise<void>}
   */
  async deletarUsuario(id) {
    try {
      await api.delete(`/user/${id}`);
    } catch (error) {
      console.error(`Erro ao deletar usuário ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }
};