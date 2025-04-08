<!-- src/components/Header.vue -->
<template>
  <header class="app-header">
    <nav class="nav-left">
      <ul v-if="!isAuthenticated || isStudent">
        <li>
          <RouterLink to="/">Домашня сторінка</RouterLink>
        </li>
      </ul>
      <ul v-if="isTeacher">
        <li>
          <RouterLink to="/dashboard">Домашня сторінка</RouterLink>
        </li>
        <li>
          <RouterLink to="/teacher-statistics">Статистика</RouterLink>
        </li>
      </ul>
      <ul v-if="isAdmin">
        <li>
          <RouterLink to="/admin">Панель адміністратора</RouterLink>
        </li>
        <li>
          <RouterLink to="/teacher-search">Робота з викладачами</RouterLink>
        </li>
      </ul>
    </nav>
    <div class="nav-right-desktop" v-if="isAuthenticated">
      <div class="user-info" @click="handleUserClick">
        <img class="avatar" :src="avatarUrl" alt="Avatar" />
        <div class="user-details">
          <span v-if="authStore.user.group" class="role">
            {{ userRole }} | {{ authStore.user.group.name }}
          </span>
          <span v-else class="role">{{ userRole }}</span>
          <span class="email">{{ authStore.user.email }}</span>
        </div>
      </div>
      <button class="logout-btn-desktop" @click="logout">Вийти</button>
    </div>
    <nav class="nav-right-desktop" v-else>
      <ul>
        <li><RouterLink to="/login">Вхід</RouterLink></li>
        <li><RouterLink to="/register">Реєстрація</RouterLink></li>
      </ul>
    </nav>
    <!-- Кнопка для мобільного меню -->
    <button class="mobile-menu-toggle" @click="toggleMobileMenu">☰</button>
    <!-- Мобільне меню -->
    <div v-if="isMobileMenuOpen" class="mobile-menu">
      <div class="nav-right-mobile" v-if="isAuthenticated">
        <div class="user-info" @click="handleUserClick">
          <img class="avatar" :src="avatarUrl" alt="Avatar" />
          <div class="user-details">
            <span v-if="authStore.user.group" class="role">
              {{ userRole }} | {{ authStore.user.group.name }}
            </span>
            <span v-else class="role">{{ userRole }}</span>
            <span class="email">{{ authStore.user.email }}</span>
          </div>
        </div>
        <button class="logout-btn-desktop" @click="logout">Вийти</button>
      </div>
      <ul>
        <li v-if="!isAuthenticated || isStudent">
          <RouterLink @click="closeMobileMenu" to="/">Домашня сторінка</RouterLink>
        </li>
        <li v-if="isTeacher">
          <RouterLink @click="closeMobileMenu" to="/dashboard">Домашня сторінка</RouterLink>
        </li>
        <li v-if="isTeacher">
          <RouterLink @click="closeMobileMenu" to="/teacher-statistics">Статистика</RouterLink>
        </li>
        <li v-if="isAdmin">
          <RouterLink @click="closeMobileMenu" to="/admin">Панель адміністратора</RouterLink>
        </li>
        <li v-if="isAdmin">
          <RouterLink @click="closeMobileMenu" to="/teacher-search"
            >Робота з викладачами</RouterLink
          >
        </li>
        <li v-if="!isAuthenticated">
          <RouterLink @click="closeMobileMenu" to="/login">Вхід</RouterLink>
        </li>
        <li v-if="!isAuthenticated">
          <RouterLink @click="closeMobileMenu" to="/register">Реєстрація</RouterLink>
        </li>
        <li v-if="isAuthenticated">
          <button class="logout-btn-mobile" @click="logout">Вийти</button>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => !!authStore.token)
const isTeacher = computed(() => authStore.user && authStore.user.role === 'teacher')
const isAdmin = computed(() => authStore.user && authStore.user.role === 'admin')
const isStudent = computed(() => authStore.user && authStore.user.role === 'student')
const userRole = computed(() => {
  const roles = {
    student: 'Студент',
    teacher: 'Викладач',
    admin: 'Адміністратор',
  }
  return roles[authStore.user.role]
})

const avatarUrl =
  'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'

const logout = () => {
  authStore.logout()
  router.push('/')
}

const handleUserClick = () => {
  if (isStudent.value) {
    router.push('/profile')
  }
}

const isMobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid hsla(160, 100%, 37%, 1);
  position: relative;
}
.nav-left ul,
.nav-right-mobile ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 1rem;
}
.nav-left li,
.nav-right-mobile li {
  display: inline;
}
.nav-right-desktop {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.logout-btn-desktop,
.logout-btn-mobile {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  background-color: hsla(160, 100%, 37%, 1);
  color: black;
  padding: 1rem;
  text-decoration: none;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 0.5rem;
}
.user-details {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}
@media screen and (max-width: 720px) {
  .logout-btn-desktop {
    display: none;
  }

  .avatar {
    margin: 0;
  }
  /* При мобільному розмірі приховуємо стандартні меню */
  .nav-left ul,
  .nav-right ul {
    display: none;
  }
}
.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  text-decoration: none;
}

.mobile-menu {
  display: none;
}

@media screen and (max-width: 720px) {
  .mobile-menu {
    display: block;
  }

  .mobile-menu-toggle {
    display: block;
    padding: 0;
    margin-left: 0.5rem;
    color: hsla(160, 100%, 37%, 1);
  }
  .mobile-menu {
    position: absolute;
    top: 3.5rem;
    right: 0;
    background-color: #424242;
    width: 100%;
    padding: 1rem 0;
    z-index: 100;
  }
  .mobile-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  .mobile-menu li {
    padding: 0.5rem 0;
  }
  .mobile-menu a {
    color: hsla(160, 100%, 37%, 1);
    text-decoration: none;
    font-size: 1.2rem;
  }
  .app-header {
    justify-content: end;
    padding: 0.5rem 0;
  }

  .nav-right-desktop {
    display: none;
  }

  .nav-right-mobile {
    justify-content: center;
    padding-bottom: 1rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;

    border-bottom: 1px solid #555;
  }

  .user-info {
    justify-content: center;
  }

  .user-details {
    margin-left: 0.5rem;
  }

  .email {
    word-break: break-all;
  }
}
</style>
