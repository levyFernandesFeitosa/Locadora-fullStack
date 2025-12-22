export default {
  login: {
    welcome_to: 'Bienvenue à la',
    app_name: 'Boutique de Location de Livres',
    make_your_login: 'Connectez-vous ici',
    happy_to_see_you_again: 'Heureux de vous revoir!',
    // Form fields and buttons
    email_label: 'E-mail',
    password_label: 'Mot de Passe',
    enter_button: 'Entrer',
    // Notification and error messages
    success_message: 'Connexion réussie!',
    error_message_default: 'E-mail ou mot de passe invalide. Veuillez réessayer.',

    "error_message_default": "E-mail ou mot de passe invalide. Veuillez réessayer.",
    "error_message_network": "Erreur de connexion API/Réseau. Vérifiez votre connexion.",
    "error_message_server_generic": "Erreur interne du serveur. Veuillez réessayer plus tard.",
    "error_message_credentials": "E-mail ou mot de passe incorrect.",
    "error_message_bad_request": "Requête invalide. Veuillez vérifier vos données."
  },

  DashboardPage: {
    Rental_Distribution: 'Distribution des Locations',
    Most_Rented_Books: 'Livres les Plus Loués',
    Total_Rentals: 'Locations Totales',
    Total_Renters: 'Total des Locataires',
    Renter: 'Locataire',
    Total_Loans: 'Prêts Totaux',
    Rentals_Returned: 'Locations Rendués',
    Returned: 'Rendués',
    Pending: 'En Attente',
    Rentals: 'Locations',
    Late: 'En Retard'
  },
  "RentersPage": {
    "title": "Locataires",
    "register_button": "Enregistrer",
    "search_placeholder": "Rechercher (Nom, E-mail, CPF)",
    "actions_header": "Actions",
    "loading_renters": "Chargement des locataires...",
    "column_name": "Nom",
    "column_email": "E-mail",
    "column_phone": "Téléphone",
    "column_cpf": "CPF",
    "column_address": "Adresse",
    "modal_register_title": "Enregistrer un Nouveau Locataire",
    "modal_update_title": "Modifier Locataire",
    "input_name_label": "Nom Complet",
    "input_email_label": "E-mail",
    "input_phone_label": "Téléphone",
    "input_cpf_label": "CPF",
    "input_address_label": "Adresse",
    "cancel_button": "Annuler",
    "update_button": "Mettre à jour",
    "close_button": "Fermer",
    "confirm_delete_q1": "Êtes-vous sûr de vouloir supprimer ce locataire?",
    "confirm_delete_q2": "Cette action est irréversible.",
    "delete_button": "Supprimer",
    "back_button": "Retour",

    "success_register": "Locataire enregistré avec succès!",
    "success_update": "Locataire mis à jour avec succès!",
    "success_delete": "Locataire supprimé avec succès!",
    "validation_fill_all": "Veuillez remplir tous les champs obligatoires.",
    "validation_required": "Champ obligatoire.",

    "error_load_default": "Erreur lors du chargement des locataires. ",
    "error_update_default": "Échec de la mise à jour du locataire. ",
    "error_delete_default": "Échec de la suppression du locataire. ",
    "error_connection": "Erreur de connexion avec le serveur.",
    "error_unknown": "Une erreur inconnue s'est produite.",
    "error_validation": "Erreur de validation : Vérifiez les données saisies.",
    "error_delete_linked": "Impossible de supprimer : Le locataire a des livres loués ou des enregistrements liés.",
    "error_unexpected": "Une erreur inattendue s'est produite lors de la suppression.",

    "error_permission_register": "Vous n'avez pas la permission (USER) d'enregistrer des locataires.",
    "error_permission_update": "Vous n'avez pas la permission (USER) de modifier des locataires.",
    "error_permission_delete": "Vous n'avez pas la permission (USER) de supprimer des locataires.",
    "error_permission_register_backend": "Action refusée (403). Vous n'êtes pas administrateur.",
    "error_permission_update_backend": "Action refusée (403). Mise à jour impossible.",
    "error_permission_delete_backend": "Action refusée (403). Suppression impossible."
  },
  PublishersPage: {
    title: 'Éditeurs',
    register_button: 'Enreg.',
    update_button: 'Mettre à jour',
    delete_button: 'Supprimer',
    cancel_button: 'Annuler',
    close_button: 'Fermer',
    back_button: 'Retourner',
    search_placeholder: 'Rechercher des éditeurs',
    actions_header: 'Actions',

    // Colonnes du Tableau
    column_name: 'Nom',
    column_email: 'E-mail',
    column_phone: 'Téléphone',
    column_website: 'Site Web',

    // Modales et Champs de Saisie
    modal_register_title: 'Enregistrer un éditeur',
    modal_update_title: 'Mettre à jour l\'éditeur',
    input_name_label: 'Nom de l\'éditeur',
    input_email_label: 'E-mail de l\'éditeur',
    input_phone_label: 'Téléphone',
    input_website_label: 'Site Web de l\'éditeur',

    // Confirmation de Suppression
    confirm_delete_q1: 'Êtes-vous sûr de vouloir supprimer cet éditeur?',
    confirm_delete_q2: 'Cette action est irréversible.',

    // Notifications (Succès)
    success_register: 'Éditeur enregistré avec succès!',
    success_update: 'Éditeur mis à jour avec succès!',
    success_delete: 'Éditeur supprimé avec succès!',

    // Notifications (Validation/Erreur)
    validation_required: 'Champ obligatoire',
    validation_fill_all: 'Veuillez remplir tous les champs obligatoires.',
    error_load_default: 'Erreur lors du chargement de la liste des éditeurs.',
    error_connection: 'Vérifiez votre connexion ou jeton d\'accès.',
    error_register_default: 'Échec de l\'enregistrement de l\'éditeur. Veuillez réessayer.',
    error_update_default: 'Échec de la mise à jour de l\'éditeur.',
    error_delete_default: 'Échec de la suppression de l\'éditeur.',
    error_delete_linked: 'Cet éditeur ne peut pas être supprimé car il est lié à un ou plusieurs livres.',
  },
  BooksPage: {
    title: 'Livres',
    register_button: 'Enreg.',
    update_button: 'Mettre à jour',
    delete_button: 'Supprimer',
    cancel_button: 'Annuler',
    back_button: 'Retourner',
    search_placeholder: 'Rechercher un livre',
    actions_header: 'Actions',
    not_applicable: 'N/A',
    loading_books: 'Chargement des livres...',

    // Colonnes du Tableau
    column_title: 'Titre',
    column_author: 'Auteur',
    column_launch_date: 'Lancement',
    column_total: 'Total',
    column_in_use: 'En cours d\'utilisation',
    column_publisher: 'Éditeur',

    // Modales et Champs de Saisie
    modal_register_title: 'Enregistrer un livre',
    modal_update_title: 'Mettre à jour le livre',
    input_title_label: 'Titre du livre',
    input_author_label: 'Auteur',
    input_launch_date_label: 'Date de lancement',
    input_total_quantity_label: 'Quantité totale',
    input_publisher_label: 'Éditeur',

    // Confirmation de Suppression
    confirm_delete_q1: 'Êtes-vous sûr de vouloir supprimer ce livre?',
    confirm_delete_q2: 'Cette action est irréversible.',

    // Notificaciones (Succès)
    success_register: 'Livre enregistré avec succès!',
    success_update: 'Livre mis à jour avec succès!',
    success_delete: 'Livre supprimé avec succès!',

    // Notificaciones (Validation/Erreur)
    validation_fill_all: 'Veuillez remplir tous les champs obligatoires pour enregistrer.',
    error_load_default: 'Erreur lors du chargement de la liste des livres.',
    error_connection: 'Erreur lors du chargement des données de l\'API. Vérifiez le serveur/réseau.',
    error_save_default: 'Erreur lors de l\'enregistrement du livre.',
    error_delete_default: 'Erreur lors de la suppression du livre.',
    error_delete_linked: 'Impossible de supprimer le livre. Il est lié à une ou plusieurs locations actives.',
  },
  RentalsPage: {
    title: 'Locations',
    register_button: 'Enreg.',
    update_button: 'Mettre à jour',
    delete_button: 'Supprimer',
    cancel_button: 'Annuler',
    confirm_button: 'Confirmer',
    back_button: 'Retourner',
    search_placeholder: 'Rechercher une location',
    actions_header: 'Actions',
    not_applicable_short: '-',
    loading_rentals: 'Chargement des locations...',

    // Statut de la Location
    status_rented: 'Loué',
    status_in_time: 'À Temps',
    status_late: 'En Retard',
    status_delivered_on_time: 'Rendu à Temps',
    status_delivered_with_delay: 'Rendu avec Retard',

    // Colonnes du Tableau
    column_renter: 'Locataire',
    column_book: 'Livre',
    column_rent_date: 'Loué le',
    column_deadline: 'Échéance',
    column_devolution_date: 'Retour',
    column_status: 'Statut',

    // Tooltips
    tooltip_receive: 'Marquer comme Reçu',
    tooltip_edit: 'Modifier la Date Limite',

    // Modales et Champs de Saisie
    modal_register_title: 'Enregistrer une Location',
    modal_update_title: 'Mettre à jour la Location',
    input_renter_label: 'Locataire',
    input_book_label: 'Livre',
    input_rent_date_label: 'Date de Location',
    input_deadline_label: 'Date Limite de Retour',
    available_caption: 'Disponible',

    // Confirmation de Réception
    confirm_receive_title: 'Confirmer la Réception',
    confirm_receive_q1: 'Voulez-vous marquer le livre',
    confirm_receive_q2: 'comme reçu? La date d\'aujourd\'hui sera enregistrée comme date de retour.',

    // Notificaciones (Succès)
    success_register: 'Location enregistrée avec succès!',
    success_update: 'Location mise à jour avec succès!',
    success_receive: 'Livre reçu avec succès! Statut mis à jour.',

    // Notificaciones (Validation/Erreur)
    validation_fill_all: 'Veuillez remplir tous les champs obligatoires pour enregistrer.',
    error_load_default: 'Erreur lors du chargement des données. Vérifiez votre connexion et vos permissions.',
    error_save_default: 'Erreur lors de l\'enregistrement de la location.',
    error_receive_default: 'Erreur lors de l\'enregistrement de la réception. Vérifiez le serveur.',
  },
  "UsersPage": {
    "title": "Utilisateurs",
    "register_button": "S'inscrire",
    "search_placeholder": "Rechercher (Nom, E-mail, Rôle)",
    "actions_header": "Actions",
    "tooltip_edit": "Modifier l'utilisateur",
    "tooltip_delete": "Supprimer l'utilisateur",
    "loading_users": "Chargement des utilisateurs...",
    "role_user": "Utilisateur",
    "role_admin": "Administrateur",
    "column_name": "Nom",
    "column_email": "E-mail",
    "column_role": "Rôle",
    "modal_register_title": "Inscrire un Nouvel Utilisateur",
    "modal_update_title": "Modifier l'Utilisateur",
    "input_name_label": "Nom",
    "input_email_label": "E-mail",
    "input_password_label": "Mot de passe",
    "input_new_password_label": "Nouveau Mot de passe (facultatif)",
    "input_confirm_password_label": "Confirmer le Nouveau Mot de passe",
    "input_role_label": "Rôle",
    "cancel_button": "Annuler",
    "update_button": "Mettre à jour",
    "close_button": "Fermer",
    "confirm_delete_q1": "Êtes-vous sûr de vouloir supprimer cet utilisateur",
    "confirm_delete_q2": "Cette action est irréversible.",
    "delete_button": "Supprimer",
    "back_button": "Retour",

    "success_register": "Utilisateur inscrit avec succès!",
    "success_update": "Utilisateur mis à jour avec succès!",
    "success_delete": "Utilisateur supprimé avec succès!",
    "validation_fill_all": "Veuillez remplir tous les champs obligatoires.",
    "validation_password_mismatch": "Les mots de passe ne correspondent pas.",
    "validation_name_email_required": "Le Nom et l'E-mail sont obligatoires.",

    "error_load_default": "Erreur lors du chargement des utilisateurs: ",
    "error_register_default": "Échec de l'inscription de l'utilisateur. ",
    "error_update_default": "Échec de la mise à jour de l'utilisateur. ",
    "error_delete_default": "Échec de la suppression de l'utilisateur. ",
    "error_network": "Erreur réseau/API.",
    "error_check_console": "Vérifiez la console pour plus de détails.",

    "error_permission_register": "Vous n'avez pas la permission (USER) d'inscrire des utilisateurs.",
    "error_permission_update": "Vous n'avez pas la permission (USER) de modifier des utilisateurs.",
    "error_permission_delete": "Vous n'avez pas la permission (USER) de supprimer des utilisateurs.",
    "error_permission_register_backend": "Action refusée (403). Vous n'êtes pas administrateur.",
    "error_permission_update_backend": "Action refusée (403). Mise à jour impossible.",
    "error_permission_delete_backend": "Action refusée (403). Suppression impossible."
  },
  MainLayout: {
    app_title: 'Location de Livres',
    menu_aria_label: 'Menu Principal',
    logout_button: 'Déconnexion',
    language_selector: 'Langue',

    // Menu Déroulant de l'Utilisateur
    user_short_label: 'Moi',
    user_full_label: 'Utilisateur',
    user_info_title: 'Informations:',
    user_name_label: 'Nom d\'Utilisateur',
    user_email_label: 'Email',
    user_permission_label: 'Permission',

    // Liens du Menu Latéral
    link_dashboard: 'Dashboard',
    link_renters: 'Locataires',
    link_publishers: 'Éditeurs',
    link_books: 'Livres',
    link_rentals: 'Locations',
    link_users: 'Utilisateurs',
    logout_button: 'Déconnexion',
    logout_success_message: 'Session terminée avec succès !',
  },
  general: {
    data_load_error: 'Échec du chargement des données du tableau de bord.',
    language_updated: 'Langue mise à jour.',
  },
};