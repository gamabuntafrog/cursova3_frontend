<template>
  <div class="profile-container">
    <h1 style="margin-bottom: 2rem">Мій профіль</h1>
    <div class="profile-info">
      <h3><strong>Пошта:</strong> {{ authStore.user.email }}</h3>
      <h3><strong>Статус:</strong> {{ userRole }}</h3>
      <h3><strong>Поточна група:</strong> {{ currentGroupName }}</h3>
    </div>

    <h3>Змінити групу</h3>
    <div class="group-form">
      <select v-model="selectedGroup" class="form-select">
        <option v-for="group in groups" :key="group._id" :value="group._id">
          {{ group.name }}
        </option>
      </select>
      <button @click="updateGroup" class="btn-submit">Оновити групу</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '../axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const groups = ref([])
const selectedGroup = ref(
  authStore.user.group && authStore.user.group._id ? authStore.user.group._id : '',
)

const userRole = computed(() => {
  const roles = {
    student: 'Студент',
    teacher: 'Викладач',
    admin: 'Адміністратор',
  }

  return roles[authStore.user.role] || 'Не визначено'
})

const fetchGroups = async () => {
  try {
    const response = await axios.get('/api/public/groups')
    groups.value = response.data
    if (authStore.user.group && authStore.user.group._id) {
      selectedGroup.value = authStore.user.group._id
    } else if (groups.value.length > 0) {
      selectedGroup.value = groups.value[0]._id
    }
  } catch (error) {
    console.error('Error fetching groups:', error)
  }
}

onMounted(() => {
  fetchGroups()
})

const currentGroupName = computed(() => {
  if (authStore.user.group && authStore.user.group.name) {
    return authStore.user.group.name
  }
  const group = groups.value.find((g) => g._id === selectedGroup.value)
  return group ? group.name : 'Не вибрано'
})

const updateGroup = async () => {
  try {
    const response = await axios.put('/users/update-group', { groupId: selectedGroup.value })

    authStore.setUser(response.data.user)
  } catch (error) {
    console.error('Error updating group:', error)
  }
}
</script>

<style scoped>
.profile-container {
  color: #e0e0e0;
  max-width: 500px;
  margin: 1rem;
  border-radius: 8px;
}

h2,
h3 {
  text-align: start;
}

h2 {
  color: hsla(160, 100%, 37%, 1);
}

.profile-info p {
  margin: 0.5rem 0;
}

.profile-info {
  margin-bottom: 1rem;
}

.group-form {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
}

.form-select {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #424242;
  color: #e0e0e0;
}

.btn-submit {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: hsla(160, 100%, 37%, 1);
  color: #2c2c2c;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 200px;
}

.btn-submit:hover {
  background-color: hsla(160, 100%, 33%, 1);
}
</style>
