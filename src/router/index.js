import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
  { path: '/students', name: 'students', component: () => import('../views/StudentsView.vue') },
  { path: '/students/:id', name: 'studentDetail', component: () => import('../views/StudentDetailView.vue') },
  { path: '/attendance', name: 'attendance', component: () => import('../views/AttendanceView.vue') },
  { path: '/payments', name: 'payments', component: () => import('../views/PaymentsView.vue') },
  { path: '/unpaid', name: 'unpaid', component: () => import('../views/UnpaidView.vue') },
  { path: '/consultations', name: 'consultations', component: () => import('../views/ConsultationsView.vue') },
  { path: '/makeup', name: 'makeup', component: () => import('../views/MakeupClassesView.vue') },
  { path: '/classes', name: 'classes', component: () => import('../views/ClassesView.vue') },
  { path: '/payments/checkout/:paymentId', name: 'checkout', component: () => import('../views/CheckoutView.vue') },
  { path: '/payments/success', name: 'paymentSuccess', component: () => import('../views/PaymentSuccessView.vue') },
  { path: '/payments/fail', name: 'paymentFail', component: () => import('../views/PaymentFailView.vue') },
  { path: '/payment-history', name: 'paymentHistory', component: () => import('../views/PaymentHistoryView.vue') }
]

export default createRouter({ history: createWebHistory(), routes })
