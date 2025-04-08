<!-- src/pages/TeacherSearch.vue -->
<template>
  <div class="teacher-search-container">
    <h2 style="text-align: center; margin-bottom: 2rem">Пошук викладачів</h2>
    <div class="search-form">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Введіть email для пошуку"
        class="search-input"
      />
      <button @click="searchTeachers" class="btn-submit">Пошук</button>
    </div>
    <ul v-if="teachers.length" class="teacher-list">
      <li v-for="teacher in teachers" :key="teacher._id">
        <span>{{ teacher.email }}</span>
        <router-link :to="`/teacher-access/${teacher._id}`" class="btn-assign">
          Перейти до сторінки керування
        </router-link>
      </li>
    </ul>
    <p v-if="searchCompleted && !teachers.length">Не знайдено викладачів.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '../axios'
import { useRouter } from 'vue-router'

const searchQuery = ref('')
const teachers = ref([])
const router = useRouter()
const searchCompleted = ref(false)

const searchTeachers = async () => {
  try {
    const response = await axios.get('/api/admin/teachers/search', {
      params: { q: searchQuery.value },
    })

    searchCompleted.value = true
    teachers.value = response.data
  } catch (error) {
    console.error('Error searching teachers:', error)
  }
}
</script>

<style scoped>
.teacher-search-container {
  color: #e0e0e0;
  max-width: 800px;
  margin: 1rem auto;
  border-radius: 8px;
}
.search-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.search-input {
  flex: 1;
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
}
.btn-submit:hover {
  background-color: hsla(160, 100%, 33%, 1);
}
.teacher-list {
  list-style: none;
  padding: 0;
}
.teacher-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #555;
}
.btn-assign {
  padding: 0.3rem 0.7rem;
  background-color: hsla(160, 100%, 37%, 1);
  color: #2c2c2c;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}
.btn-assign:hover {
  background-color: hsla(160, 100%, 33%, 1);
}
</style>
