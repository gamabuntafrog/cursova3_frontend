<!-- src/pages/TeacherAccess.vue -->
<template>
  <div class="teacher-access-container">
    <h1>
      Керування доступом викладача
      <strong style="font-weight: bold">{{ teacher.email }}</strong>
    </h1>
    <div class="access-form">
      <div class="form-group">
        <label>Дозволені предмети:</label>
        <ul class="selection-list">
          <li
            v-for="subject in subjects"
            :key="subject._id"
            :class="{ selected: selectedSubjects.includes(subject._id) }"
            @click="toggleSubject(subject._id)"
          >
            {{ subject.name }}
          </li>
        </ul>
      </div>
      <div class="form-group">
        <label>Дозволені групи:</label>
        <ul class="selection-list">
          <li
            v-for="group in groups"
            :key="group._id"
            :class="{ selected: selectedGroups.includes(group._id) }"
            @click="toggleGroup(group._id)"
          >
            {{ group.name }}
          </li>
        </ul>
      </div>
      <button @click="assignAccess" class="btn-submit">Зберегти доступ</button>
    </div>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '../axios'

const route = useRoute()
const teacherId = route.params.teacherId

const teacher = ref({})
const subjects = ref([])
const groups = ref([])
const selectedSubjects = ref([])
const selectedGroups = ref([])
const message = ref('')

const fetchTeacher = async () => {
  try {
    const response = await axios.get(`/api/admin/teachers/search/${teacherId}`)
    const found = response.data || {}
    teacher.value = found

    if (found.allowedSubjects && Array.isArray(found.allowedSubjects)) {
      selectedSubjects.value = found.allowedSubjects.map((item) =>
        item._id ? item._id.toString() : item.toString(),
      )
    }
    if (found.allowedGroups && Array.isArray(found.allowedGroups)) {
      selectedGroups.value = found.allowedGroups.map((item) =>
        item._id ? item._id.toString() : item.toString(),
      )
    }
  } catch (error) {
    console.error('Error fetching teacher:', error)
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

const fetchGroups = async () => {
  try {
    const response = await axios.get('/api/public/groups')
    groups.value = response.data
  } catch (error) {
    console.error('Error fetching groups:', error)
  }
}

const toggleSubject = (id) => {
  const index = selectedSubjects.value.indexOf(id)
  if (index === -1) {
    selectedSubjects.value.push(id)
  } else {
    selectedSubjects.value.splice(index, 1)
  }
}

const toggleGroup = (id) => {
  const index = selectedGroups.value.indexOf(id)
  if (index === -1) {
    selectedGroups.value.push(id)
  } else {
    selectedGroups.value.splice(index, 1)
  }
}

const assignAccess = async () => {
  try {
    const response = await axios.put(`/api/admin/teachers/${teacherId}/assign`, {
      allowedSubjects: selectedSubjects.value,
      allowedGroups: selectedGroups.value,
    })
    message.value = response.data.message
  } catch (error) {
    console.error('Error assigning access:', error)
    message.value = 'Сталася помилка'
  }
}

onMounted(() => {
  fetchTeacher()
  fetchSubjects()
  fetchGroups()
})
</script>

<style scoped>
.teacher-access-container {
  color: #e0e0e0;
  max-width: 1280px;
  margin: 1rem;
  border-radius: 8px;
}
.access-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
}
label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.selection-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.selection-list li {
  padding: 0.5rem 1rem;
  border: 1px solid #555;
  border-radius: 4px;
  background-color: #424242;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.selection-list li.selected {
  background-color: hsla(160, 100%, 37%, 0.3);
  border-color: hsla(160, 100%, 37%, 1);
}
.btn-submit {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: hsla(160, 100%, 37%, 1);
  color: #2c2c2c;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  align-self: flex-start;
}
.btn-submit:hover {
  background-color: hsla(160, 100%, 33%, 1);
}
.message {
  text-align: start;
  margin-top: 1rem;
  font-weight: bold;
  color: hsla(160, 100%, 37%, 1);
}
</style>
