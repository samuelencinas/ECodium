import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import data from './data'

// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

  const Store = new Vuex.Store({
    modules: {
      auth, data
    },
    strict: !!process.env.DEBUGGING,
  })

export default function (/* { ssrContext } */) {
  return Store
}

export { Store }