// src/i18n/pt-BR.js

// import DashboardPage from "src/pages/DashboardPage.vue";

export default {
  // Uma estrutura de namespaces ajuda a organizar. 'login' é o namespace aqui.
  login: {
    welcome_to: 'Bem Vindo à',
    app_name: 'Locadora de Livros',
    make_your_login: 'Faça aqui o seu Login',
    happy_to_see_you_again: 'feliz em vê-lo novamente!',
    // Campos do formulário e botões
    email_label: 'Email',
    password_label: 'Senha',
    enter_button: 'Entrar',
    // Mensagens de notificação e erro
    success_message: 'Login bem-sucedido!',

    error_message_default: "Email ou senha inválidos. Tente novamente.",
    error_message_network: "Erro de conexão com a API. Verifique sua rede.",
    error_message_server_generic: "Erro interno do servidor. Tente novamente mais tarde.",
    error_message_credentials: "Email ou senha incorretos.",
    error_message_bad_request: "Requisição inválida. Verifique seus dados.",

    forgot_password: 'Esqueceu sua senha?'
  },

  DashboardPage: {
    Rental_Distribution: 'Distribuição de Aluguéis',
    Most_Rented_Books: 'Livros Mais Alugados',
    Total_Rentals: 'Total de Aluguéis',
    Total_Renters: 'Total de Locatários',
    Renter: 'Locatário',
    Total_Loans: 'Total de Empréstimos',
    Rentals_Returned: 'Aluguéis Devolvidos',
    Returned: 'Devolvidos',
    Pending: 'Pendentes',
    Rentals: 'Aluguéis',
    Late: 'Atrasados',
  },
  "RentersPage": {
    "title": "Locatários",
    "register_button": "Cadastrar",
    "search_placeholder": "Pesquisar (Nome, Email, CPF)",
    "actions_header": "Ações",
    "loading_renters": "Carregando locatários...",
    "column_name": "Nome",
    "column_email": "Email",
    "column_phone": "Telefone",
    "column_cpf": "CPF",
    "column_address": "Endereço",
    "modal_register_title": "Cadastrar Novo Locatário",
    "modal_update_title": "Editar Locatário",
    "input_name_label": "Nome Completo",
    "input_email_label": "Email",
    "input_phone_label": "Telefone",
    "input_cpf_label": "CPF",
    "input_address_label": "Endereço",
    "cancel_button": "Cancelar",
    "update_button": "Atualizar",
    "close_button": "Fechar",
    "confirm_delete_q1": "Tem certeza que deseja excluir o locatário?",
    "confirm_delete_q2": "Esta ação não pode ser desfeita.",
    "delete_button": "Excluir",
    "back_button": "Voltar",

    "success_register": "Locatário cadastrado com sucesso!",
    "success_update": "Locatário atualizado com sucesso!",
    "success_delete": "Locatário deletado com sucesso!",
    "validation_fill_all": "Preencha todos os campos obrigatórios.",
    "validation_required": "Campo obrigatório.",

    "error_load_default": "Erro ao carregar locatários. ",
    "error_update_default": "Falha ao atualizar locatário. ",
    "error_delete_default": "Falha ao deletar locatário. ",
    "error_connection": "Erro de conexão com o servidor.",
    "error_unknown": "Ocorreu um erro desconhecido.",
    "error_validation": "Erro de validação: Verifique os dados inseridos.",
    "error_delete_linked": "Não é possível excluir: O locatário possui livros alugados ou registros vinculados.",
    "error_unexpected": "Ocorreu um erro inesperado na exclusão.",

    "error_permission_register": "Você não tem permissão (USER) para cadastrar locatários.",
    "error_permission_update": "Você não tem permissão (USER) para editar locatários.",
    "error_permission_delete": "Você não tem permissão (USER) para deletar locatários.",
    "error_permission_register_backend": "Ação negada (403). Você não é um administrador.",
    "error_permission_update_backend": "Ação negada (403). Não é possível atualizar.",
    "error_permission_delete_backend": "Ação negada (403). Não é possível deletar."
  },
  PublishersPage: {
    title: 'Editoras',
    register_button: 'Cadas.',
    update_button: 'Atualizar',
    delete_button: 'Excluir',
    cancel_button: 'Cancelar',
    close_button: 'Fechar',
    back_button: 'Voltar',
    search_placeholder: 'Pesquisar Editoras',
    actions_header: 'Ações',

    // Colunas da Tabela
    column_name: 'Nome',
    column_email: 'E-mail',
    column_phone: 'Telefone',
    column_website: 'Site',

    // Modais e Inputs
    modal_register_title: 'Cadastrar Editora',
    modal_update_title: 'Atualizar Editora',
    input_name_label: 'Nome da Editora',
    input_email_label: 'Email da Editora',
    input_phone_label: 'Telefone',
    input_website_label: 'Site da Editora',

    // Confirmação de Exclusão
    confirm_delete_q1: 'Certeza que deseja excluir essa Editora?',
    confirm_delete_q2: 'Após essa ação não haverá retorno.',

    // Notificações (Sucesso)
    success_register: 'Editora cadastrada com sucesso!',
    success_update: 'Editora atualizada com sucesso!',
    success_delete: 'Editora excluída com sucesso!',

    // Notificações (Validação/Erro)
    validation_required: 'Campo obrigatório',
    validation_fill_all: 'Preencha todos os campos obrigatórios.',
    error_load_default: 'Erro ao carregar lista de editoras.',
    error_connection: 'Verifique sua conexão ou token de acesso.',
    error_register_default: 'Falha ao cadastrar editora. Tente novamente.',
    error_update_default: 'Falha ao atualizar editora.',
    error_delete_default: 'Falha ao excluir editora.',
    error_delete_linked: 'Esta editora não pode ser excluída, pois está vinculada a um ou mais livros.',
  },

  BooksPage: {
    title: 'Livros',
    register_button: 'Cadas.',
    update_button: 'Atualizar',
    delete_button: 'Excluir',
    cancel_button: 'Cancelar',
    back_button: 'Voltar',
    search_placeholder: 'Pesquisar Livro',
    actions_header: 'Ações',
    not_applicable: 'N/A',
    loading_books: 'Carregando livros...',

    // Colunas da Tabela
    column_title: 'Título',
    column_author: 'Autor',
    column_launch_date: 'Lançamento',
    column_total: 'Total',
    column_in_use: 'Em Uso',
    column_publisher: 'Editora',

    // Modais e Inputs
    modal_register_title: 'Cadastrar Livro',
    modal_update_title: 'Atualizar Livro',
    input_title_label: 'Título do Livro',
    input_author_label: 'Autor',
    input_launch_date_label: 'Data de Lançamento',
    input_total_quantity_label: 'Quantidade Total',
    input_publisher_label: 'Editora',

    // Confirmação de Exclusão
    confirm_delete_q1: 'Certeza que deseja excluir esse Livro?',
    confirm_delete_q2: 'Após essa ação não haverá retorno.',

    // Notificações (Sucesso)
    success_register: 'Livro cadastrado com sucesso!',
    success_update: 'Livro atualizado com sucesso!',
    success_delete: 'Livro deletado com sucesso!',

    // Notificações (Validação/Erro)
    validation_fill_all: 'Preencha todos os campos obrigatórios para salvar.',
    error_load_default: 'Erro ao carregar lista de livros.',
    error_connection: 'Erro ao carregar dados da API. Verifique o servidor/rede.',
    error_save_default: 'Erro ao salvar o livro.',
    error_delete_default: 'Erro ao deletar o livro.',
    error_delete_linked: 'Não foi possível deletar o livro. Ele está vinculado a um ou mais aluguéis ativos.',
  },
  RentalsPage: {
    title: 'Aluguéis',
    register_button: 'Cadas.',
    update_button: 'Atualizar',
    delete_button: 'Excluir', // Mantido para consistência, apesar de não ser usado
    cancel_button: 'Cancelar',
    confirm_button: 'Confirmar',
    back_button: 'Voltar',
    search_placeholder: 'Pesquisar Aluguel',
    actions_header: 'Ações',
    not_applicable_short: '-',
    loading_rentals: 'Carregando aluguéis...',

    // Status do Aluguel
    status_rented: 'Alugado',
    status_in_time: 'No Prazo',
    status_late: 'Atrasado',
    status_delivered_on_time: 'Devolvido no Prazo',
    status_delivered_with_delay: 'Devolvido com Atraso',

    // Colunas da Tabela
    column_renter: 'Locatário',
    column_book: 'Livro',
    column_rent_date: 'Alugado',
    column_deadline: 'Prazo',
    column_devolution_date: 'Devolução',
    column_status: 'Status',

    // Tooltips
    tooltip_receive: 'Marcar como Recebido',
    tooltip_edit: 'Editar Prazo de Devolução',

    // Modais e Inputs
    modal_register_title: 'Cadastrar Aluguel',
    modal_update_title: 'Atualizar Aluguel',
    input_renter_label: 'Locatário',
    input_book_label: 'Livro',
    input_rent_date_label: 'Data de Aluguel',
    input_deadline_label: 'Prazo de Devolução',
    available_caption: 'Disponível',

    // Confirmação de Recebimento
    confirm_receive_title: 'Confirmar Recebimento',
    confirm_receive_q1: 'Deseja marcar o livro',
    confirm_receive_q2: 'como recebido? A data de hoje será registrada como devolução.',

    // Notificações (Sucesso)
    success_register: 'Aluguel cadastrado com sucesso!',
    success_update: 'Aluguel atualizado com sucesso!',
    success_receive: 'Livro recebido com sucesso! Status atualizado.',

    // Notificações (Validação/Erro)
    validation_fill_all: 'Preencha todos os campos obrigatórios para salvar.',
    error_load_default: 'Erro ao carregar dados. Verifique sua conexão e permissões.',
    error_save_default: 'Erro ao salvar o aluguel.',
    error_receive_default: 'Erro ao registrar recebimento. Verifique o servidor.',
  },
  "UsersPage": {
    "title": "Usuários",
    "register_button": "Cadastrar",
    "search_placeholder": "Pesquisar (Nome, Email, Função)",
    "actions_header": "Ações",
    "tooltip_edit": "Editar Usuário",
    "tooltip_delete": "Deletar Usuário",
    "loading_users": "Carregando usuários...",
    "role_user": "Usuário",
    "role_admin": "Administrador",
    "column_name": "Nome",
    "column_email": "Email",
    "column_role": "Função",
    "modal_register_title": "Cadastrar Novo Usuário",
    "modal_update_title": "Editar Usuário",
    "input_name_label": "Nome",
    "input_email_label": "Email",
    "input_password_label": "Senha",
    "input_new_password_label": "Nova Senha (opcional)",
    "input_confirm_password_label": "Confirmar Nova Senha",
    "input_role_label": "Função",
    "cancel_button": "Cancelar",
    "update_button": "Atualizar",
    "close_button": "Fechar",
    "confirm_delete_q1": "Tem certeza que deseja excluir este usuário",
    "confirm_delete_q2": "Esta ação não pode ser desfeita.",
    "delete_button": "Excluir",
    "back_button": "Voltar",

    "success_register": "Usuário cadastrado com sucesso!",
    "success_update": "Usuário atualizado com sucesso!",
    "success_delete": "Usuário deletado com sucesso!",
    "validation_fill_all": "Preencha todos os campos obrigatórios.",
    "validation_password_mismatch": "As senhas não coincidem.",
    "validation_name_email_required": "Nome e Email são obrigatórios.",

    "error_load_default": "Erro ao carregar usuários: ",
    "error_register_default": "Falha ao cadastrar usuário. ",
    "error_update_default": "Falha ao atualizar usuário. ",
    "error_delete_default": "Falha ao deletar usuário. ",
    "error_network": "Erro de rede/API.",
    "error_check_console": "Verifique o console para mais detalhes.",

    "error_permission_register": "Você não tem permissão (USER) para cadastrar usuários.",
    "error_permission_update": "Você não tem permissão (USER) para editar usuários.",
    "error_permission_delete": "Você não tem permissão (USER) para deletar usuários.",
    "error_permission_register_backend": "Ação negada (403). Você não é um administrador.",
    "error_permission_update_backend": "Ação negada (403). Não é possível atualizar.",
    "error_permission_delete_backend": "Ação negada (403). Não é possível deletar."
  },
  MainLayout: {
    app_title: 'Locadora de Livros',
    menu_aria_label: 'Menu Principal',
    logout_button: 'Sair',
    language_selector: 'Idioma',

    // Menu Dropdown do Usuário
    user_short_label: 'Eu',
    user_full_label: 'Usuário',
    user_info_title: 'Informações:',
    user_name_label: 'Usuário',
    user_email_label: 'Email',
    user_permission_label: 'Permissão',

    // Links do Menu Lateral
    link_dashboard: 'Dashboard',
    link_renters: 'Locatário',
    link_publishers: 'Editoras',
    link_books: 'Livros',
    link_rentals: 'Aluguéis',
    link_users: 'Usuários',
    

    logout_button: 'Sair',
    logout_success_message: 'Sessão encerrada com sucesso!',
  },
  // Aqui você pode adicionar outros namespaces, como 'dashboard', 'settings', etc.
  general: {
    data_load_error: 'Falha ao carregar dados da Dashboard.',
    language_updated: 'Idioma atualizado.',
    guest_user: 'Usuário',
  }
}