
/**
 * ECodium - TFG Samuel Encinas
 * Fichero de configuración del router del frontend
 */
import { route } from 'quasar/wrappers'
import axios from "axios"
import VueRouter from 'vue-router'
import routes from './routes'
import store from '../store/index';
import { UPDATE_USER } from 'src/store/auth/mutations'


async function checkUser(): Promise<any> {

}

export default route(function ({ Vue, store }) {
  Vue.use(VueRouter);

  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })
  // Comprobar si el usuario está logueado para acceder a la funcionalidad de la página
  Router.beforeEach(async (to, from, next) => {
    let userData = {};
    await store.dispatch('CHECK');
    userData = store.state.auth.user;
    await store.dispatch('OBJETIVO');
    const isLoggedIn = !!userData;

    // Si el usuario intenta acceder a una sección específica de la plataforma y no está logueado, se le redirige a la página Landing
    if (to.path != '/') {
      isLoggedIn ? next() : next('/');
      // Si el usuario intenta acceder a la Landing estando logueado, se le redirige a la página de Inicio
    } else {
      isLoggedIn ? next('/inicio') : next();
    }
  })
  return Router
})


