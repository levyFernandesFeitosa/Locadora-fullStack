// src/services/livrosService.js
import { api } from 'boot/axios';
import EditorasService from './editorasService'; // Importa o serviço de Editoras

// Variável local do módulo que armazena o mapeamento nomeEditora -> objeto Editora completo.
let editorasMap = {};

const LivrosService = {
    async carregarEditorasMap() {
        try {
            const editoras = await EditorasService.buscarTodas(); 
            
            // Limpa e recria o mapa nome -> objeto Publisher
            editorasMap = {};
            editoras.forEach(ed => {
                editorasMap[ed.publishersName] = ed; // Mapeia o nome para o objeto completo
            });
            return editoras;
        } catch (error) {
            console.error('Erro ao carregar editoras:', error.response?.data || error.message);
            throw new Error(`Falha ao carregar editoras: ${error.response?.status || 'Erro de rede'}`);
        }
    },

    async buscarTodos() {
        try {
            const response = await api.get('/book');
            return Array.isArray(response.data) ? response.data : [response.data];
        } catch (error) {
            console.error('Erro ao buscar livros:', error.response?.data || error.message);
            throw new Error(`Falha ao buscar livros: ${error.response?.status || 'Erro de rede'}`);
        }
    },

    /**
     * Monta o payload no formato esperado pelo BookDto (Java).
     */
    buildPayload(livroForm, isUpdate = false) {
        // 1. Encontra o objeto Publisher COMPLETO.
        const editoraSelecionada = editorasMap[livroForm.publisherName];
        if (!editoraSelecionada) {
            // Lança um erro que será capturado no Vue para notificar o usuário
            throw new Error("Erro de validação: A editora selecionada é inválida ou o mapa não foi carregado corretamente.");
        }

        // 2. Cria o payload com os NOMES DE CAMPO CORRETOS esperados pelo BookDto (Java).
        return {
            id: isUpdate ? livroForm.id : null,
            bookTitle: livroForm.bookTitle,
            bookAuthor: livroForm.bookAuthor,
            bookLaunch: livroForm.bookLaunch, // Data em formato 'YYYY-MM-DD'
            bookTotal: parseInt(livroForm.bookTotal),
            // Se for atualização, usa o valor existente. Se for cadastro, começa com 0.
            bookInUse: isUpdate ? parseInt(livroForm.bookInUse) : 0, 
            publisher: editoraSelecionada // ENVIA O OBJETO COMPLETO
        };
    },

    async cadastrar(livroForm) {
        const payload = this.buildPayload(livroForm, false);
        await api.post("/book", payload);
    },

    async atualizar(idLivro, livroForm) {
        // O ID do livro será incluído no payload dentro do método buildPayload
        const payload = this.buildPayload(livroForm, true);
        await api.put(`/book/${idLivro}`, payload);
    },

    async deletar(id) {
        try {
            await api.delete(`/book/${id}`);
        } catch (error) {
            console.error(`Erro ao deletar livro ${id}:`, error.response?.data || error);
            throw error;
        }
    }
};

export default LivrosService;