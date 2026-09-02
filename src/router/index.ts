import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/what-is-rpm',
      name: 'what-is-rpm',
      component: () => import('../views/WhatIsRpmView.vue'),
    },
    {
      path: '/benefits',
      name: 'benefits',
      component: () => import('../views/BenefitsView.vue'),
    },
    {
      path: '/apps',
      name: 'apps',
      component: () => import('../views/AppsView.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue'),
    },
    {
      path: '/blog/:id',
      name: 'blog-detail',
      component: () => import('../views/BlogDetailView.vue'),
    },
    {
      path: '/equipment',
      name: 'equipment',
      component: () => import('../views/EquipmentView.vue'),
    },
    {
      path: '/equipment/:id',
      name: 'equipment-detail',
      component: () => import('../views/EquipmentDetailView.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyView.vue'),
    },
  ],
  // Toda navegação começa no topo (exceto voltar/avançar, que restaura a posição)
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

export default router
