import { createRouter, createWebHistory } from 'vue-router'
import ProblemaView from '@/views/ProblemaView.vue'
import ArquitecturaView from '@/views/ArquitecturaView.vue'
import ModeloDatosView from '@/views/ModeloDatosView.vue'
import FlujoAutenticacionView from '@/views/FlujoAutenticacionView.vue'
import MigracionView from '@/views/MigracionView.vue'
import TradeoffsView from '@/views/TradeoffsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'problema',
      component: ProblemaView,
      meta: { title: 'Inicio / Problema', short: 'Problema' },
    },
    {
      path: '/arquitectura',
      name: 'arquitectura',
      component: ArquitecturaView,
      meta: { title: 'Arquitectura propuesta', short: 'Arquitectura' },
    },
    {
      path: '/modelo-datos',
      name: 'modelo-datos',
      component: ModeloDatosView,
      meta: { title: 'Modelo de datos BD_AUTH', short: 'Modelo de datos' },
    },
    {
      path: '/flujo-autenticacion',
      name: 'flujo-autenticacion',
      component: FlujoAutenticacionView,
      meta: { title: 'Flujo de autenticación', short: 'Flujo de auth' },
    },
    {
      path: '/migracion',
      name: 'migracion',
      component: MigracionView,
      meta: { title: 'Estrategia de migración', short: 'Migración' },
    },
    {
      path: '/trade-offs',
      name: 'trade-offs',
      component: TradeoffsView,
      meta: { title: 'Decisiones abiertas', short: 'Trade-offs' },
    },
  ],
})

export default router
