import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/empresas',
      name: 'empresas',
      component: () => import('../views/empresas/EmpresasList.vue')
    },
    {
      path: '/empresas/nova',
      name: 'empresa-nova',
      component: () => import('../views/empresas/EmpresaForm.vue')
    },
    {
      path: '/empresas/:id',
      name: 'empresa-editar',
      component: () => import('../views/empresas/EmpresaForm.vue')
    },
    {
      path: '/funcionarios',
      name: 'funcionarios',
      component: () => import('../views/funcionarios/FuncionariosList.vue')
    },
    {
      path: '/funcionarios/novo',
      name: 'funcionario-novo',
      component: () => import('../views/funcionarios/FuncionarioForm.vue')
    },
    {
      path: '/funcionarios/:id',
      name: 'funcionario-editar',
      component: () => import('../views/funcionarios/FuncionarioForm.vue')
    },
    {
      path: '/salas',
      name: 'salas',
      component: () => import('../views/salas/SalasList.vue')
    },
    {
      path: '/salas/nova',
      name: 'sala-nova',
      component: () => import('../views/salas/SalaForm.vue')
    },
    {
      path: '/salas/:id',
      name: 'sala-editar',
      component: () => import('../views/salas/SalaForm.vue')
    },
    {
      path: '/reservas',
      name: 'reservas',
      component: () => import('../views/reservas/ReservasList.vue')
    },
    {
      path: '/reservas/nova',
      name: 'reserva-nova',
      component: () => import('../views/reservas/ReservaForm.vue')
    },
    {
      path: '/reservas/:id',
      name: 'reserva-editar',
      component: () => import('../views/reservas/ReservaForm.vue')
    }
  ]
})

export default router
