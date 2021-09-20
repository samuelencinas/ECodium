import Particles from "particles.vue";
import Vue from 'vue'

declare module "particles.vue";
Vue.use(Particles);

export default async ({ app, router, Vue, store }) => {
  console.info('boot: init entered', store)
  store.dispatch('CHECK').then(() => {
  console.info('boot: init exited')
  })
}