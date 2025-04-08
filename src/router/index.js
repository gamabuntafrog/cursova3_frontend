import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginForm from '../pages/LoginForm.vue'
import Register from '../pages/Register.vue'
import TeacherDashboard from '../pages/TeacherDashboard.vue'
import LessonPage from '../pages/LessonPage.vue'
import StudentMark from '../pages/StudentMark.vue'
import AdminPanel from '../pages/AdminPanel.vue'
import StudentProfile from '../pages/StudentProfile.vue'
import HomeView from '@/views/HomeView.vue'
import TeacherStatistics from '@/pages/TeacherStatistics.vue'
import TeacherAccess from '@/pages/TeacherAccess.vue'
import TeacherSearch from '@/pages/TeacherSearch.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginForm, meta: { requiresGuest: true } },
  { path: '/register', name: 'Register', component: Register, meta: { requiresGuest: true } },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: TeacherDashboard,
    meta: { requiresAuth: true, role: 'teacher' },
  },
  {
    path: '/teacher-statistics',
    name: 'TeacherStatistics',
    component: TeacherStatistics,
    meta: { requiresAuth: true, role: 'teacher' },
  },
  {
    path: '/lesson/:lessonId',
    name: 'LessonPage',
    component: LessonPage,
    meta: { requiresAuth: true, role: 'teacher' },
  },
  {
    path: '/mark',
    name: 'StudentMark',
    component: StudentMark,
    meta: { requiresAuth: true, role: 'student' },
  },
  {
    path: '/profile',
    name: 'StudentProfile',
    component: StudentProfile,
    meta: { requiresAuth: true, role: 'student' },
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/teacher-access/:teacherId',
    name: 'TeacherAccess',
    component: TeacherAccess,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/teacher-search',
    name: 'TeacherSearch',
    component: TeacherSearch,
    meta: { requiresAuth: true, role: 'admin' },
  },
  { path: '/', name: 'HomeView', component: HomeView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = !!authStore.token

  function redirectToHome() {
    if (authStore.user?.role === 'student') {
      return next({ name: 'HomeView' })
    }

    if (authStore.user?.role === 'admin') {
      return next({ name: 'AdminPanel' })
    }

    if (authStore.user?.role === 'teacher') {
      return next({ name: 'Dashboard' })
    }
  }

  if (to.path === '/' && isAuthenticated && authStore.user?.role !== 'student') {
    return redirectToHome()
  }

  if (!to.meta?.role && !to.meta?.requiresGuest && !to.meta?.requiresAuth) {
    return next()
  }

  if (to.meta.role && !isAuthenticated) {
    return next({ name: 'Login' })
  }

  if (authStore.user?.role !== to.meta.role || (to.meta.requiresGuest && isAuthenticated)) {
    return redirectToHome()
  }

  next()
})

export default router
