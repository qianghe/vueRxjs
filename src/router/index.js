import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/dynamic',
    name: 'dynamic',
    component: () => import('../views/Dynamic/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
