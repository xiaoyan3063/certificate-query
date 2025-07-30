import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'CertificateQuery',
    component: () => import('../views/CertificateQuery.vue')
  },
  {
    path: '/detail',
    name: 'CertificateDetail',
    component: () => import('../views/CertificateDetail.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router