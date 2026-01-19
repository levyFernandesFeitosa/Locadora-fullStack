import { route } from 'quasar/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

export default route(function () {
  const Router = createRouter({
    history: createWebHistory(process.env.VUE_ROUTER_BASE),
    routes
  })

  // Guard global de autenticação
  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('authToken')

    // Lista de rotas públicas (que não exigem token)
    const publicRouteNames = ['login', 'forgot-password', 'reset-password']
    const publicRoutePaths = ['/', '/forgot-password', '/reset-password']

    const isPublic = publicRouteNames.includes(to.name) || publicRoutePaths.includes(to.path)

    // Se não tem token e a rota destino não é pública -> redireciona para login
    if (!token && !isPublic) {
      next('/')
    } else {
      next()
    }
  })

  return Router
})
