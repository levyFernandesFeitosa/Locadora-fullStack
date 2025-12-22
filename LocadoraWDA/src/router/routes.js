const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'), 
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') }
    ]
  },
  {
    path: '/', 
    component: () => import('layouts/MainLayout.vue'), 
    children: [
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: 'locatario', component: () => import('pages/LocatarioPage.vue') },
      { path: 'editoras', component: () => import('pages/EditorasPage.vue') },
      { path: 'livros', component: () => import('pages/LivrosPage.vue') },
      { path: 'alugueis', component: () => import('pages/AlugueisPage.vue') },
      { path: 'usuario', component: () => import('pages/UsuarioPage.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes