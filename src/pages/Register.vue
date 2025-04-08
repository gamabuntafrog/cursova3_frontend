<template>
  <div class="auth-container">
    <h2>Реєстрація</h2>
    <form @submit.prevent="register" class="auth-form">
      <div class="form-group">
        <label>Пошта:</label>
        <input v-model="email" type="email" required class="form-input" />
      </div>
      <div class="form-group">
        <label>Пароль:</label>
        <input v-model="password" type="password" required class="form-input" />
      </div>
      <!-- <div class="form-group">
        <label>Статус:</label>
        <select v-model="role" class="form-select">
          <option value="student">Студент</option>
          <option value="teacher">Викладач</option>
        </select>
      </div>
      <div v-if="role === 'student'" class="form-group">
        <label>Група:</label>
        <select v-model="groupId" class="form-select">
          <option v-for="group in groups" :key="group._id" :value="group._id">
            {{ group.name }}
          </option>
        </select>
      </div> -->
      <button type="submit" class="btn-submit">Зареєструватися</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from '../axios'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const role = ref('student')
const groupId = ref('')
const groups = ref([])
const authStore = useAuthStore()
const router = useRouter()

const fetchGroups = async () => {
  try {
    const response = await axios.get('/api/public/groups')
    groups.value = response.data
    if (groups.value.length > 0) {
      groupId.value = groups.value[0]._id
    }
  } catch (error) {
    console.error('Error fetching groups:', error)
  }
}

onMounted(() => {
  if (role.value === 'student') {
    fetchGroups()
  }
})

watch(role, (newRole) => {
  if (newRole === 'student') {
    fetchGroups()
  }
})

const register = async () => {
  try {
    const payload = {
      email: email.value,
      password: password.value,
    }
    if (role.value === 'student') {
      payload.group = groupId.value
    }

    await axios.post('/users/register', payload)

    const response = await axios.post('/users/login', {
      email: email.value,
      password: password.value,
    })

    authStore.setToken(response.data.token)
    authStore.setUser(response.data.user)
    router.push('/')
  } catch (error) {
    console.error('Registration error:', error)
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

.form-input,
.form-select {
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
