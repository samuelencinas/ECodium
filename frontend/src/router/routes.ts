/**
 * ECodium - TFG Samuel Encinas
 * Fichero de rutas del frontend
 */
import { Router } from 'express'
import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [

  {
    path: '/',
    component: () => import('layouts/LandingLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Landing.vue') }
    ]
  },
  {
    path: '/inicio',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/reto/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Reto.vue') }
    ]
  },
  {
    path: '/retos',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Retos.vue') }
    ]
  },
  {
    path: '/eventos',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Eventos.vue') }
    ]
  },
  {
    path: '/evento/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Evento.vue') }
    ]
  },
  {
    path: '/logros',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Logros.vue') }
    ]
  },
  {
    path: '/talleres',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Talleres.vue') }
    ]
  },
  {
    path: '/taller/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Taller.vue') }
    ]
  },
  {
    path: '/banco',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Banco.vue') }
    ]
  },
  {
    path: '/comunidad',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Comunidad.vue') }
    ]
  },
  {
    path: '/info',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Informacion.vue') }
    ]
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]
export default routes

