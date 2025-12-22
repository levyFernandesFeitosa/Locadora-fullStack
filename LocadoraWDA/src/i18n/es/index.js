export default {
  login: {
    welcome_to: 'Bienvenido a la',
    app_name: 'Tienda de Alquiler de Libros',
    make_your_login: 'Inicie sesión aquí',
    happy_to_see_you_again: '¡Felices de verte de nuevo!',
    // Form fields and buttons
    email_label: 'Correo Electrónico',
    password_label: 'Contraseña',
    enter_button: 'Entrar',
    // Notification and error messages
    success_message: '¡Inicio de sesión exitoso!',
    error_message_default: 'Correo electrónico o contraseña inválidos. Inténtalo de nuevo.',

    "error_message_default": "Correo electrónico o contraseña no válidos. Inténtalo de nuevo.",
    "error_message_network": "Error de conexión API/Red. Verifica tu conexión.",
    "error_message_server_generic": "Error interno del servidor. Inténtalo de nuevo más tarde.",
    "error_message_credentials": "Correo electrónico o contraseña incorrectos.",
    "error_message_bad_request": "Solicitud no válida. Por favor, verifica tus datos."
  },

  DashboardPage: {
    Rental_Distribution: 'Distribución de Alquileres',
    Most_Rented_Books: 'Libros Más Alquilados',
    Total_Rentals: 'Alquileres Totales',
    Total_Renters: 'Total de Inquilinos',
    Renter: 'Inquilino',
    Total_Loans: 'Préstamos Totales',
    Rentals_Returned: 'Alquileres Devueltos',
    Returned: 'Devueltos',
    Pending: 'Pendientes',
    Rentals: 'Alquileres',
    Late: 'Retrasados',
  },
  "RentersPage": {
    "title": "Inquilinos",
    "register_button": "Registrar",
    "search_placeholder": "Buscar (Nombre, Correo, CPF)",
    "actions_header": "Acciones",
    "loading_renters": "Cargando inquilinos...",
    "column_name": "Nombre",
    "column_email": "Correo Electrónico",
    "column_phone": "Teléfono",
    "column_cpf": "CPF",
    "column_address": "Dirección",
    "modal_register_title": "Registrar Nuevo Inquilino",
    "modal_update_title": "Editar Inquilino",
    "input_name_label": "Nombre Completo",
    "input_email_label": "Correo Electrónico",
    "input_phone_label": "Teléfono",
    "input_cpf_label": "CPF",
    "input_address_label": "Dirección",
    "cancel_button": "Cancelar",
    "update_button": "Actualizar",
    "close_button": "Cerrar",
    "confirm_delete_q1": "¿Está seguro de que desea eliminar a este inquilino?",
    "confirm_delete_q2": "Esta acción no se puede deshacer.",
    "delete_button": "Eliminar",
    "back_button": "Volver",

    "success_register": "¡Inquilino registrado exitosamente!",
    "success_update": "¡Inquilino actualizado exitosamente!",
    "success_delete": "¡Inquilino eliminado exitosamente!",
    "validation_fill_all": "Por favor, rellene todos los campos obligatorios.",
    "validation_required": "Campo obligatorio.",

    "error_load_default": "Error al cargar inquilinos. ",
    "error_update_default": "Fallo al actualizar inquilino. ",
    "error_delete_default": "Fallo al eliminar inquilino. ",
    "error_connection": "Error de conexión con el servidor.",
    "error_unknown": "Ocurrió un error desconocido.",
    "error_validation": "Error de validación: Verifique los datos ingresados.",
    "error_delete_linked": "No se puede eliminar: El inquilino tiene libros alquilados o registros vinculados.",
    "error_unexpected": "Ocurrió un error inesperado durante la eliminación.",

    "error_permission_register": "No tiene permiso (USER) para registrar inquilinos.",
    "error_permission_update": "No tiene permiso (USER) para editar inquilinos.",
    "error_permission_delete": "No tiene permiso (USER) para eliminar inquilinos.",
    "error_permission_register_backend": "Acción denegada (403). No es un administrador.",
    "error_permission_update_backend": "Acción denegada (403). No es posible actualizar.",
    "error_permission_delete_backend": "Acción denegada (403). No es posible eliminar."
  },
  PublishersPage: {
    title: 'Editoriales',
    register_button: 'Reg.',
    update_button: 'Actua.',
    delete_button: 'Eliminar',
    cancel_button: 'Cancelar',
    close_button: 'Cerrar',
    back_button: 'Volver',
    search_placeholder: 'Buscar Editoriales',
    actions_header: 'Acciones',

    // Columnas de la Tabla
    column_name: 'Nombre',
    column_email: 'Correo Electrónico',
    column_phone: 'Teléfono',
    column_website: 'Sitio Web',

    // Modales y Inputs
    modal_register_title: 'Registrar Editorial',
    modal_update_title: 'Actualizar Editorial',
    input_name_label: 'Nombre de la Editorial',
    input_email_label: 'Correo Electrónico de la Editorial',
    input_phone_label: 'Teléfono',
    input_website_label: 'Sitio Web de la Editorial',

    // Confirmación de Eliminación
    confirm_delete_q1: '¿Está seguro que desea eliminar esta Editorial?',
    confirm_delete_q2: 'Esta acción no se puede deshacer.',

    // Notificaciones (Éxito)
    success_register: 'Editorial registrada con éxito!',
    success_update: 'Editorial actualizada con éxito!',
    success_delete: 'Editorial eliminada con éxito!',

    // Notificaciones (Validación/Error)
    validation_required: 'Campo obligatorio',
    validation_fill_all: 'Rellene todos los campos obligatorios.',
    error_load_default: 'Error al cargar la lista de editoriales.',
    error_connection: 'Verifique su conexión o token de acceso.',
    error_register_default: 'Error al registrar la editorial. Inténtelo de nuevo.',
    error_update_default: 'Error al actualizar la editorial.',
    error_delete_default: 'Error al eliminar la editorial.',
    error_delete_linked: 'Esta editorial no puede ser eliminada porque está vinculada a uno o más libros.',
  },
  BooksPage: {
    title: 'Libros',
    register_button: 'Reg.',
    update_button: 'Actua.',
    delete_button: 'Eliminar',
    cancel_button: 'Cancelar',
    back_button: 'Volver',
    search_placeholder: 'Buscar Libro',
    actions_header: 'Acciones',
    not_applicable: 'N/A',
    loading_books: 'Cargando libros...',

    // Columnas de la Tabla
    column_title: 'Título',
    column_author: 'Autor',
    column_launch_date: 'Lanzamiento',
    column_total: 'Total',
    column_in_use: 'En Uso',
    column_publisher: 'Editorial',

    // Modales y Campos de Saisie
    modal_register_title: 'Registrar Libro',
    modal_update_title: 'Actualizar Libro',
    input_title_label: 'Título del Libro',
    input_author_label: 'Autor',
    input_launch_date_label: 'Fecha de Lanzamiento',
    input_total_quantity_label: 'Cantidad Total',
    input_publisher_label: 'Editorial',

    // Confirmación de Eliminación
    confirm_delete_q1: '¿Está seguro que desea eliminar este Libro?',
    confirm_delete_q2: 'Esta acción no se puede deshacer.',

    // Notificaciones (Éxito)
    success_register: 'Libro registrado con éxito!',
    success_update: 'Libro actualizado con éxito!',
    success_delete: 'Libro eliminado con éxito!',

    // Notificaciones (Validación/Error)
    validation_fill_all: 'Rellene todos los campos obligatorios para guardar.',
    error_load_default: 'Error al cargar la lista de libros.',
    error_connection: 'Error al cargar datos de la API. Verifique el servidor/red.',
    error_save_default: 'Error al guardar el libro.',
    error_delete_default: 'Error al eliminar el libro.',
    error_delete_linked: 'No fue posible eliminar el libro. Está vinculado a uno o más alquileres activos.',
  },
  RentalsPage: {
    title: 'Alquileres',
    register_button: 'Reg.',
    update_button: 'Actua.',
    delete_button: 'Eliminar',
    cancel_button: 'Cancelar',
    confirm_button: 'Confirmar',
    back_button: 'Volver',
    search_placeholder: 'Buscar Alquiler',
    actions_header: 'Acciones',
    not_applicable_short: '-',
    loading_rentals: 'Cargando alquileres...',

    // Status del Alquiler
    status_rented: 'Alquilado',
    status_in_time: 'A Tiempo',
    status_late: 'Atrasado',
    status_delivered_on_time: 'Devuelto a Tiempo',
    status_delivered_with_delay: 'Devuelto con Retraso',

    // Columnas de la Tabla
    column_renter: 'Inquilino',
    column_book: 'Libro',
    column_rent_date: 'Alquilado',
    column_deadline: 'Plazo',
    column_devolution_date: 'Devolución',
    column_status: 'Estado',

    // Tooltips
    tooltip_receive: 'Marcar como Recibido',
    tooltip_edit: 'Editar Plazo de Devolución',

    // Modales y Campos de Saisie
    modal_register_title: 'Registrar Alquiler',
    modal_update_title: 'Actualizar Alquiler',
    input_renter_label: 'Inquilino',
    input_book_label: 'Libro',
    input_rent_date_label: 'Fecha de Alquiler',
    input_deadline_label: 'Plazo de Devolución',
    available_caption: 'Disponible',

    // Confirmación de Recepción
    confirm_receive_title: 'Confirmar Recepción',
    confirm_receive_q1: '¿Desea marcar el libro',
    confirm_receive_q2: 'como recibido? La fecha de hoy se registrará como devolución.',

    // Notificaciones (Éxito)
    success_register: 'Alquiler registrado con éxito!',
    success_update: 'Alquiler actualizado con éxito!',
    success_receive: 'Libro recibido con éxito! Estado actualizado.',

    // Notificaciones (Validación/Error)
    validation_fill_all: 'Rellene todos los campos obligatorios para guardar.',
    error_load_default: 'Error al cargar datos. Verifique su conexión y permisos.',
    error_save_default: 'Error al guardar el alquiler.',
    error_receive_default: 'Error al registrar la recepción. Verifique el servidor.',
  },
  "UsersPage": {
    "title": "Usuarios",
    "register_button": "Registrar",
    "search_placeholder": "Buscar (Nombre, Correo, Rol)",
    "actions_header": "Acciones",
    "tooltip_edit": "Editar Usuario",
    "tooltip_delete": "Eliminar Usuario",
    "loading_users": "Cargando usuarios...",
    "role_user": "Usuario",
    "role_admin": "Administrador",
    "column_name": "Nombre",
    "column_email": "Correo Electrónico",
    "column_role": "Rol",
    "modal_register_title": "Registrar Nuevo Usuario",
    "modal_update_title": "Editar Usuario",
    "input_name_label": "Nombre",
    "input_email_label": "Correo Electrónico",
    "input_password_label": "Contraseña",
    "input_new_password_label": "Nueva Contraseña (opcional)",
    "input_confirm_password_label": "Confirmar Nueva Contraseña",
    "input_role_label": "Rol",
    "cancel_button": "Cancelar",
    "update_button": "Actualizar",
    "close_button": "Cerrar",
    "confirm_delete_q1": "¿Está seguro de que desea eliminar este usuario",
    "confirm_delete_q2": "Esta acción no se puede deshacer.",
    "delete_button": "Eliminar",
    "back_button": "Volver",

    "success_register": "¡Usuario registrado exitosamente!",
    "success_update": "¡Usuario actualizado exitosamente!",
    "success_delete": "¡Usuario eliminado exitosamente!",
    "validation_fill_all": "Por favor, rellene todos los campos obligatorios.",
    "validation_password_mismatch": "Las contraseñas no coinciden.",
    "validation_name_email_required": "Nombre y Correo Electrónico son obligatorios.",

    "error_load_default": "Error al cargar usuarios: ",
    "error_register_default": "Fallo al registrar usuario. ",
    "error_update_default": "Fallo al actualizar usuario. ",
    "error_delete_default": "Fallo al eliminar usuario. ",
    "error_network": "Error de red/API.",
    "error_check_console": "Compruebe la consola para más detalles.",

    "error_permission_register": "No tiene permiso (USER) para registrar usuarios.",
    "error_permission_update": "No tiene permiso (USER) para editar usuarios.",
    "error_permission_delete": "No tiene permiso (USER) para eliminar usuarios.",
    "error_permission_register_backend": "Acción denegada (403). No es un administrador.",
    "error_permission_update_backend": "Acción denegada (403). No es posible actualizar.",
    "error_permission_delete_backend": "Acción denegada (403). No es posible eliminar."
  },
  MainLayout: {
    app_title: 'Biblioteca de Alquiler',
    menu_aria_label: 'Menú Principal',
    logout_button: 'Cerrar Sesión',
    language_selector: 'Idioma',

    // Menú Desplegable del Usuario
    user_short_label: 'Yo',
    user_full_label: 'Usuario',
    user_info_title: 'Información:',
    user_name_label: 'Usuario',
    user_email_label: 'Correo',
    user_permission_label: 'Permiso',

    // Enlaces del Menú Lateral
    link_dashboard: 'Dashboard',
    link_renters: 'Inquilinos',
    link_publishers: 'Editoriales',
    link_books: 'Libros',
    link_rentals: 'Alquileres',
    link_users: 'Usuarios',
    logout_button: 'Cerrar Sesión',
    logout_success_message: '¡Sesión finalizada con éxito!',
  },
  general: {
    data_load_error: 'Error al cargar los datos del Panel.',
    language_updated: 'Idioma actualizado.',
  },
};