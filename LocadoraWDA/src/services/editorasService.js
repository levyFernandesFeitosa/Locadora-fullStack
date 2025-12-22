import { api } from 'boot/axios'; 

const EditorasService = {
    // Endpoint para buscar todas as editoras
    async buscarTodas() {
        try {
            // Seu endpoint era '/publisher'
            const response = await api.get('/publisher');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar editoras:', error);
            throw error; // Propaga o erro para ser tratado no componente Vue
        }
    },

    // Endpoint para criar uma nova editora
    async criar(editoraData) {
        try {
            // Seu endpoint era '/publisher' com método POST
            const response = await api.post('/publisher', editoraData);
            return response.data;
        } catch (error) {
            console.error('Erro ao cadastrar editora:', error);
            throw error;
        }
    },

    // Endpoint para atualizar uma editora
    async atualizar(id, editoraData) {
        try {
            // Seu endpoint era '/publisher/:id' com método PUT
            const response = await api.put(`/publisher/${id}`, editoraData);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar editora:', error);
            throw error;
        }
    },
    
    // Endpoint para deletar uma editora
    async deletar(id) {
        try {
            // Seu endpoint era '/publisher/:id' com método DELETE
            const response = await api.delete(`/publisher/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao deletar editora:', error);
            throw error;
        }
    }
};

export default EditorasService;