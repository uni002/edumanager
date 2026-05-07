import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes = [
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { guest: true } },
  { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue'), meta: { guest: true } },
  { path: '/', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { requiresAuth: true } },
  { path: '/students', name: 'students', component: () => import('../views/StudentsView.vue'), meta: { requiresAuth: true } },
  { path: '/students/:id', name: 'studentDetail', component: () => import('../views/StudentDetailView.vue'), meta: { requiresAuth: true } },
  { path: '/attendance', name: 'attendance', component: () => import('../views/AttendanceView.vue'), meta: { requiresAuth: true } },
  { path: '/payments', name: 'payments', component: () => import('../views/PaymentsView.vue'), meta: { requiresAuth: true } },
  { path: '/unpaid', name: 'unpaid', component: () => import('../views/UnpaidView.vue'), meta: { requiresAuth: true } },
  { path: '/consultations', name: 'consultations', component: () => import('../views/ConsultationsView.vue'), meta: { requiresAuth: true } },
  { path: '/makeup', name: 'makeup', component: () => import('../views/MakeupClassesView.vue'), meta: { requiresAuth: true } },
  { path: '/classes', name: 'classes', component: () => import('../views/ClassesView.vue'), meta: { requiresAuth: true } },
  { path: '/payments/checkout/:paymentId', name: 'checkout', component: () => import('../views/CheckoutView.vue'), meta: { requiresAuth: true } },
  { path: '/payments/success', name: 'paymentSuccess', component: () => import('../views/PaymentSuccessView.vue'), meta: { requiresAuth: true } },
  { path: '/payments/fail', name: 'paymentFail', component: () => import('../views/PaymentFailView.vue'), meta: { requiresAuth: true } },
  { path: '/payment-history', name: 'paymentHistory', component: () => import('../views/PaymentHistoryView.vue'), meta: { requiresAuth: true } }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login' }
  }
  if (to.meta.guest && authStore.isLoggedIn) {
    return { name: 'dashboard' }
  }
})

export default router
