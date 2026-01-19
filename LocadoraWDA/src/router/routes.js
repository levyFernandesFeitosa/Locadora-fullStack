const routes = [
  // Bloco de Login e Recuperação (LoginLayout)
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { name: 'login', path: '', component: () => import('pages/LoginPage.vue'), meta: { requiresAuth: false } },
      { name: 'forgot-password', path: 'forgot-password', component: () => import('pages/ForgotPasswordPage.vue'), meta: { requiresAuth: false } },
      { name: 'reset-password', path: 'reset-password', component: () => import('pages/ResetPasswordPage.vue'), meta: { requiresAuth: false } }
    ]
  },

  // Bloco de Páginas Internas (MainLayout)
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'dashboard', path: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      { name: 'locatario', path: 'locatario', component: () => import('pages/LocatarioPage.vue') },
      { name: 'editoras', path: 'editoras', component: () => import('pages/EditorasPage.vue') },
      { name: 'livros', path: 'livros', component: () => import('pages/LivrosPage.vue') },
      { name: 'alugueis', path: 'alugueis', component: () => import('pages/AlugueisPage.vue') },
      { name: 'usuario', path: 'usuario', component: () => import('pages/UsuarioPage.vue') }
    ]
  },

  // Catch-all para erros 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes