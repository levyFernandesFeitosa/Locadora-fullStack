import { api } from 'boot/axios' 

const RESOURCE_URL = '/rent'
const RESOURCE_RENTERS = '/renter'
const RESOURCE_BOOKS = '/book'

const aluguelService = {
    async getAllAlugueis() {
        try {
            const response = await api.get(RESOURCE_URL)
            return response.data
        } catch (error) {
            console.error('Erro ao buscar aluguéis:', error.response?.data || error.message)
            throw error
        }
    },

    async createAluguel(novoAluguel) {
        try {
            const response = await api.post(RESOURCE_URL, novoAluguel)
            return response.data
        } catch (error) {
            console.error('Erro ao cadastrar aluguel:', error.response?.data || error.message)
            throw error
        }
    },

    async updateAluguel(id, dadosAtualizados) {
        try {
            // Alterado para PATCH para atualização parcial (extensão de prazo)
            const response = await api.patch(`${RESOURCE_URL}/${id}`, dadosAtualizados)
            return response.data
        } catch (error) {
            console.error(`Erro ao atualizar aluguel ${id}:`, error.response?.data || error.message)
            throw error
        }
    },

    async returnBook(id) {
        try {
            const response = await api.put(`${RESOURCE_URL}/return/${id}`)
            return response.data
        } catch (error) {
            console.error(`Erro ao registrar devolução ${id}:`, error.response?.data || error.message)
            throw error
        }
    },

    async deleteAluguel(id) {
        try {
            const response = await api.delete(`${RESOURCE_URL}/${id}`)
            return response.data
        } catch (error) {
            console.error(`Erro ao excluir aluguel ${id}:`, error.response?.data || error.message)
            throw error
        }
    },

    async getDependencies() {
        try {
            const [resLocatarios, resLivros] = await Promise.all([
                api.get(RESOURCE_RENTERS),
                api.get(RESOURCE_BOOKS)
            ])
            return {
                locatarios: resLocatarios.data,
                livros: resLivros.data
            }
        } catch (error) {
            console.error('Erro ao carregar locatários/livros:', error.response?.data || error.message)
            throw error
        }
    }
}

export default aluguelService