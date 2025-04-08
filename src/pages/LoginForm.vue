<template>
  <div class="auth-container">
    <h2>Вхід</h2>
    <form @submit.prevent="login" class="auth-form">
      <div class="form-group">
        <label>Пошта:</label>
        <input v-model="email" type="email" required class="form-input" />
      </div>
      <div class="form-group">
        <label>Пароль:</label>
        <input v-model="password" type="password" required class="form-input" />
      </div>
      <button type="submit" class="btn-submit">Увійти</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '../axios'
import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const login = async () => {
  try {
    const response = await axios.post('/users/login', {
      email: email.value,
      password: password.value,
    })
    authStore.setToken(response.data.token)
    authStore.setUser(response.data.user)
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (error) {
    console.error('Login error:', error)
  }
}
</script>

<style scoped>
.auth-container {
  color: #e0e0e0;
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
}

h2 {
  color: hsla(160, 100%, 37%, 1);
  text-align: center;
  margin-bottom: 1rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-input {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #424242;
  color: #e0e0e0;
}

.btn-submit {
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: hsla(160, 100%, 37%, 1);
  color: #2c2c2c;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-submit:hover {
  background-color: hsla(160, 100%, 33%, 1);
}
</style>
