<template>
  <div class="admin-container">
    <h2>Адмін панель</h2>

    <!-- Розділ для роботи з групами -->
    <section class="admin-section">
      <h3 style="margin: 1rem 0">Групи студентів</h3>
      <form @submit.prevent="createGroup" class="admin-form">
        <input v-model="newGroupName" placeholder="Назва групи" class="form-input" required />
        <button type="submit" class="btn-submit">Створити групу</button>
      </form>
      <ul class="admin-list">
        <li v-for="group in groups" :key="group._id">
          <span>{{ group.name }}</span>
          <button @click="deleteGroup(group._id)" class="btn-delete">Видалити</button>
        </li>
      </ul>
    </section>

    <!-- Розділ для роботи з предметами -->
    <section class="admin-section">
      <h3 style="margin: 1rem 0">Предмети</h3>
      <form @submit.prevent="createSubject" class="admin-form">
        <input v-model="newSubjectName" placeholder="Назва предмета" class="form-input" required />
        <button type="submit" class="btn-submit">Створити предмет</button>
      </form>
      <ul class="admin-list">
        <li v-for="subject in subjects" :key="subject._id">
          <span>{{ subject.name }}</span>
          <button @click="deleteSubject(subject._id)" class="btn-delete">Видалити</button>
        </li>
      </ul>
    </section>

    <!-- Розділ для створення викладача -->
    <section class="admin-section">
      <h3 style="margin: 1rem 0">Створити викладача</h3>
      <form @submit.prevent="createTeacher" class="admin-form">
        <input
          v-model="newTeacherEmail"
          placeholder="Email викладача"
          class="form-input"
          required
        />
        <button type="submit" class="btn-submit">Створити викладача</button>
      </form>
      <div v-if="createdTeacher" class="teacher-info">
        <p><strong>Викладача створено:</strong></p>
        <p><strong>Email:</strong> {{ createdTeacher.email }}</p>
        <p><strong>Пароль:</strong> {{ createdTeacher.password }}</p>
        <button class="btn-copy" @click="copyTemplate">Скопіювати шаблон</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '../axios'

const newGroupName = ref('')
const groups = ref([])
const newSubjectName = ref('')
const subjects = ref([])
const newTeacherEmail = ref('')
const createdTeacher = ref(null)

const fetchGroups = async () => {
  try {
    const response = await axios.get('/api/public/groups')
    groups.value = response.data
  } catch (error) {
    console.error('Error fetching groups:', error)
  }
}

const fetchSubjects = async () => {
  try {
    const response = await axios.get('/api/public/subjects')
    subjects.value = response.data
  } catch (error) {
    console.error('Error fetching subjects:', error)
  }
}

const createGroup = async () => {
  try {
    const response = await axios.post('/api/admin/groups/create', { name: newGroupName.value })
    console.log(response.data.message)
    await fetchGroups()
    newGroupName.value = ''
  } catch (error) {
    console.error('Error creating group:', error)
  }
}

const deleteGroup = async (id) => {
  try {
    const response = await axios.delete(`/api/admin/groups/${id}`)
    console.log(response.data.message)
    await fetchGroups()
  } catch (error) {
    console.error('Error deleting group:', error)
  }
}

const createSubject = async () => {
  try {
    const response = await axios.post('/api/admin/subjects/create', { name: newSubjectName.value })
    console.log(response.data.message)
    await fetchSubjects()
    newSubjectName.value = ''
  } catch (error) {
    console.error('Error creating subject:', error)
  }
}

const deleteSubject = async (id) => {
  try {
    const response = await axios.delete(`/api/admin/subjects/${id}`)
    console.log(response.data.message)
    await fetchSubjects()
  } catch (error) {
    console.error('Error deleting subject:', error)
  }
}

const createTeacher = async () => {
  try {
    const response = await axios.post('/api/admin/teachers/create', {
      email: newTeacherEmail.value,
    })
    createdTeacher.value = response.data.teacher
    newTeacherEmail.value = ''
  } catch (error) {
    console.error('Error creating teacher:', error)
  }
}

const copyTemplate = async () => {
  const template = `Вітаємо!\nВаш акаунт викладача створено.\nEmail: ${createdTeacher.value.email}\nПароль: ${createdTeacher.value.password}\nБудь ласка, змініть пароль після першого входу.`
  try {
    await navigator.clipboard.writeText(template)
    alert('Шаблон скопійовано в буфер обміну!')
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

fetchGroups()
fetchSubjects()
</script>

<style scoped>
.admin-container {
  color: #e0e0e0;
  margin: 2rem 1rem;
  border-radius: 8px;
}
.admin-section {
  margin-bottom: 2rem;
  border-bottom: 1px solid #555;
  padding-bottom: 1rem;
}
.admin-form {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}
.form-input {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #424242;
  color: #e0e0e0;
  flex: 1;
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
.admin-list {
  list-style: none;
  padding: 0;
}
.admin-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #424242;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}
.btn-delete {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: hsla(160, 100%, 37%, 1);
  color: #2c2c2c;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn-delete:hover {
  background-color: hsla(160, 100%, 33%, 1);
}
.teacher-info {
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
}
.teacher-info p {
  margin: 0.5rem 0;
}
.btn-copy {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: hsla(160, 100%, 37%, 1);
  color: #2c2c2c;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 0.5rem;
}
.btn-copy:hover {
  background-color: hsla(160, 100%, 33%, 1);
}
</style>
