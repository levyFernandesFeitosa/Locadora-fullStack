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

    // Se não tem token e não está indo pro login → redireciona
    if (!token && to.path !== '/' && to.path !== '/login') {
      next('/')
    } else {
      next()
    }
  })

  return Router
})
