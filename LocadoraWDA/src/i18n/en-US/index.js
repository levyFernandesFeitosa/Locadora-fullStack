export default {
  login: {
    welcome_to: 'Welcome to the',
    app_name: 'Book Rental Store',
    make_your_login: 'Log in here',
    happy_to_see_you_again: 'Happy to see you again!',
    // Form fields and buttons
    email_label: 'Email',
    password_label: 'Password',
    enter_button: 'Sign In',
    // Notification and error messages
    success_message: 'Login successful!',
    error_message_default: 'Invalid email or password. Please try again.',

    "error_message_default": "Invalid email or password. Please try again.",
    "error_message_network": "API/Network error. Check your connection.",
    "error_message_server_generic": "Internal server error. Please try again later.",
    "error_message_credentials": "Incorrect email or password.",
    "error_message_bad_request": "Invalid request. Please check your data."
  },

  DashboardPage: {
    Rental_Distribution: 'Rental Distribution',
    Most_Rented_Books: 'Most Rented Books',
    Total_Rentals: 'Total Rentals',
    Total_Renters: 'Total Renters',
    Renter: 'Renter',
    Total_Loans: 'Total Loans',
    Rentals_Returned: 'Rentals Returned',
    Returned: 'Returned',
    Pending: 'Pending',
    Rentals: 'Rentals',
    Late: 'Late'
  },
  "RentersPage": {
    "title": "Renters",
    "register_button": "Register",
    "search_placeholder": "Search (Name, Email, CPF)",
    "actions_header": "Actions",
    "loading_renters": "Loading renters...",
    "column_name": "Name",
    "column_email": "Email",
    "column_phone": "Phone",
    "column_cpf": "CPF",
    "column_address": "Address",
    "modal_register_title": "Register New Renter",
    "modal_update_title": "Edit Renter",
    "input_name_label": "Full Name",
    "input_email_label": "Email",
    "input_phone_label": "Phone",
    "input_cpf_label": "CPF",
    "input_address_label": "Address",
    "cancel_button": "Cancel",
    "update_button": "Update",
    "close_button": "Close",
    "confirm_delete_q1": "Are you sure you want to delete this renter?",
    "confirm_delete_q2": "This action cannot be undone.",
    "delete_button": "Delete",
    "back_button": "Back",

    "success_register": "Renter registered successfully!",
    "success_update": "Renter updated successfully!",
    "success_delete": "Renter deleted successfully!",
    "validation_fill_all": "Please fill in all required fields.",
    "validation_required": "Required field.",

    "error_load_default": "Error loading renters. ",
    "error_update_default": "Failed to update renter. ",
    "error_delete_default": "Failed to delete renter. ",
    "error_connection": "Connection error with the server.",
    "error_unknown": "An unknown error occurred.",
    "error_validation": "Validation error: Check the data entered.",
    "error_delete_linked": "Cannot delete: Renter has rented books or linked records.",
    "error_unexpected": "An unexpected error occurred during deletion.",

    "error_permission_register": "You do not have permission (USER) to register renters.",
    "error_permission_update": "You do not have permission (USER) to edit renters.",
    "error_permission_delete": "You do not have permission (USER) to delete renters.",
    "error_permission_register_backend": "Action denied (403). You are not an administrator.",
    "error_permission_update_backend": "Action denied (403). Cannot perform update.",
    "error_permission_delete_backend": "Action denied (403). Cannot perform deletion."
  },
  PublishersPage: {
    title: 'Publishers',
    register_button: 'Reg.',
    update_button: 'Update',
    delete_button: 'Delete',
    cancel_button: 'Cancel',
    close_button: 'Close',
    back_button: 'Go Back',
    search_placeholder: 'Search Publishers',
    actions_header: 'Actions',

    // Table Columns
    column_name: 'Name',
    column_email: 'Email',
    column_phone: 'Phone',
    column_website: 'Website',

    // Modals and Inputs
    modal_register_title: 'Register Publisher',
    modal_update_title: 'Update Publisher',
    input_name_label: 'Publisher Name',
    input_email_label: 'Publisher Email',
    input_phone_label: 'Phone',
    input_website_label: 'Publisher Website',

    // Deletion Confirmation
    confirm_delete_q1: 'Are you sure you want to delete this Publisher?',
    confirm_delete_q2: 'This action cannot be undone.',

    // Notifications (Success)
    success_register: 'Publisher successfully registered!',
    success_update: 'Publisher successfully updated!',
    success_delete: 'Publisher successfully deleted!',

    // Notifications (Validation/Error)
    validation_required: 'Required field',
    validation_fill_all: 'Please fill in all required fields.',
    error_load_default: 'Error loading publishers list.',
    error_connection: 'Check your connection or access token.',
    error_register_default: 'Failed to register publisher. Please try again.',
    error_update_default: 'Failed to update publisher.',
    error_delete_default: 'Failed to delete publisher.',
    error_delete_linked: 'This publisher cannot be deleted because it is linked to one or more books.',
  },
  BooksPage: {
    title: 'Books',
    register_button: 'Reg.',
    update_button: 'Update',
    delete_button: 'Delete',
    cancel_button: 'Cancel',
    back_button: 'Go Back',
    search_placeholder: 'Search Book',
    actions_header: 'Actions',
    not_applicable: 'N/A',
    loading_books: 'Loading books...',

    // Table Columns
    column_title: 'Title',
    column_author: 'Author',
    column_launch_date: 'Launch Date',
    column_total: 'Total',
    column_in_use: 'In Use',
    column_publisher: 'Publisher',

    // Modals and Inputs
    modal_register_title: 'Register Book',
    modal_update_title: 'Update Book',
    input_title_label: 'Book Title',
    input_author_label: 'Author',
    input_launch_date_label: 'Launch Date',
    input_total_quantity_label: 'Total Quantity',
    input_publisher_label: 'Publisher',

    // Deletion Confirmation
    confirm_delete_q1: 'Are you sure you want to delete this Book?',
    confirm_delete_q2: 'This action cannot be undone.',

    // Notifications (Success)
    success_register: 'Book successfully registered!',
    success_update: 'Book successfully updated!',
    success_delete: 'Book successfully deleted!',

    // Notifications (Validation/Error)
    validation_fill_all: 'Please fill in all required fields to save.',
    error_load_default: 'Error loading books list.',
    error_connection: 'Error loading API data. Check server/network.',
    error_save_default: 'Error saving the book.',
    error_delete_default: 'Error deleting the book.',
    error_delete_linked: 'Could not delete the book. It is linked to one or more active rentals.',
  },
  RentalsPage: {
    title: 'Rentals',
    register_button: 'Reg.',
    update_button: 'Update',
    delete_button: 'Delete',
    cancel_button: 'Cancel',
    confirm_button: 'Confirm',
    back_button: 'Go Back',
    search_placeholder: 'Search Rental',
    actions_header: 'Actions',
    not_applicable_short: '-',
    loading_rentals: 'Loading rentals...',

    // Rental Status
    status_rented: 'Rented',
    status_in_time: 'In Time',
    status_late: 'Late',
    status_delivered_on_time: 'Returned On Time',
    status_delivered_with_delay: 'Returned With Delay',

    // Table Columns
    column_renter: 'Renter',
    column_book: 'Book',
    column_rent_date: 'Rented Date',
    column_deadline: 'Deadline',
    column_devolution_date: 'Return Date',
    column_status: 'Status',

    // Tooltips
    tooltip_receive: 'Mark as Received',
    tooltip_edit: 'Edit Return Deadline',

    // Modals and Inputs
    modal_register_title: 'Register Rental',
    modal_update_title: 'Update Rental',
    input_renter_label: 'Renter',
    input_book_label: 'Book',
    input_rent_date_label: 'Rent Date',
    input_deadline_label: 'Return Deadline',
    available_caption: 'Available',

    // Receive Confirmation
    confirm_receive_title: 'Confirm Reception',
    confirm_receive_q1: 'Do you want to mark the book',
    confirm_receive_q2: 'as received? Today\'s date will be registered as the return date.',

    // Notifications (Success)
    success_register: 'Rental successfully registered!',
    success_update: 'Rental successfully updated!',
    success_receive: 'Book successfully received! Status updated.',

    // Notifications (Validation/Error)
    validation_fill_all: 'Please fill in all required fields to save.',
    error_load_default: 'Error loading data. Check your connection and permissions.',
    error_save_default: 'Error saving the rental.',
    error_receive_default: 'Error registering reception. Check the server.',
  },
  "UsersPage": {
    "title": "User",
    "register_button": "Register",
    "search_placeholder": "Search (Name, Email, Role)",
    "actions_header": "Actions",
    "tooltip_edit": "Edit User",
    "tooltip_delete": "Delete User",
    "loading_users": "Loading users...",
    "role_user": "User",
    "role_admin": "Admin",
    "column_name": "Name",
    "column_email": "Email",
    "column_role": "Role",
    "modal_register_title": "Register New User",
    "modal_update_title": "Edit User",
    "input_name_label": "Name",
    "input_email_label": "Email",
    "input_password_label": "Password",
    "input_new_password_label": "New Password (optional)",
    "input_confirm_password_label": "Confirm New Password",
    "input_role_label": "Role",
    "cancel_button": "Cancel",
    "update_button": "Update",
    "close_button": "Close",
    "confirm_delete_q1": "Are you sure you want to delete this user",
    "confirm_delete_q2": "This action cannot be undone.",
    "delete_button": "Delete",
    "back_button": "Back",

    "success_register": "User registered successfully!",
    "success_update": "User updated successfully!",
    "success_delete": "User deleted successfully!",
    "validation_fill_all": "Please fill in all required fields.",
    "validation_password_mismatch": "Passwords do not match.",
    "validation_name_email_required": "Name and Email are required.",

    "error_load_default": "Error loading users: ",
    "error_register_default": "Failed to register user. ",
    "error_update_default": "Failed to update user. ",
    "error_delete_default": "Failed to delete user. ",
    "error_network": "Network/API error.",
    "error_check_console": "Check the console for more details.",

    "error_permission_register": "You do not have permission (USER) to register users.",
    "error_permission_update": "You do not have permission (USER) to edit users.",
    "error_permission_delete": "You do not have permission (USER) to delete users.",
    "error_permission_register_backend": "Action denied (403). You are not an administrator.",
    "error_permission_update_backend": "Action denied (403). Cannot perform update.",
    "error_permission_delete_backend": "Action denied (403). Cannot perform deletion."
  },
  MainLayout: {
    app_title: 'Book Rental Service',
    menu_aria_label: 'Main Menu',
    logout_button: 'Logout',
    language_selector: 'Language',

    // User Dropdown Menu
    user_short_label: 'Me',
    user_full_label: 'User',
    user_info_title: 'Information:',
    user_name_label: 'Username',
    user_email_label: 'Email',
    user_permission_label: 'Permission',

    // Sidebar Menu Links
    link_dashboard: 'Dashboard',
    link_renters: 'Renters',
    link_publishers: 'Publishers',
    link_books: 'Books',
    link_rentals: 'Rentals',
    link_users: 'Users',
    logout_button: 'Logout',
    logout_success_message: 'Session successfully ended!',
  },
  general: {
    data_load_error: 'Failed to load Dashboard data.',
    language_updated: 'Language updated.',
  },
};