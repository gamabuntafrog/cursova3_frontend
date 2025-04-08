<!-- src/App.vue -->
<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'
import router from './router'
import Header from './components/Header.vue'

const authStore = useAuthStore()
</script>

<template>
  <div>
    <Header />
    <RouterView />
  </div>
</template>

<style>
/* Глобальні стилі */
header {
  padding: 1rem;
}
nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}
button {
  background: none;
  border: none;
  cursor: pointer;
  color: blue;
  text-decoration: underline;
}
</style>
