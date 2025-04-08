<template>
  <div>
    <div v-if="!accessDenied" class="dashboard-container">
      <!-- Форма створення заняття -->
      <h1>Створити нове заняття</h1>
      <form @submit.prevent="createLesson" class="lesson-form">
        <div class="form-group">
          <label>Предмет:</label>
          <select v-model="subjectId" class="form-select">
            <option v-for="subject in subjects" :key="subject._id" :value="subject._id">
              {{ subject.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Назва заняття:</label>
          <input v-model="lessonTitle" type="text" required class="form-input" />
        </div>
        <div class="form-group">
          <label>Група студентів:</label>
          <select v-model="groupId" class="form-select">
            <option v-for="group in groups" :key="group._id" :value="group._id">
              {{ group.name }}
            </option>
          </select>
        </div>
        <button type="submit" class="btn-submit">Створити заняття</button>
      </form>
      <div v-if="lessonCreated" class="lesson-created">
        <p>Заняття створено. Перейти до live-сторінки заняття:</p>
        <router-link :to="`/lesson/${lessonCreated.lessonId}`" class="lesson-link">
          Перейти до заняття
        </router-link>
      </div>
      <!-- Секція для перегляду останніх занять за останні 7 днів -->
      <div class="recent-lessons" v-if="Object.keys(groupedLessons).length">
        <h1>Останні заняття</h1>
        <div v-for="(lessons, label) in groupedLessons" :key="label" class="lesson-group">
          <h2>{{ label }}</h2>
          <ul>
            <li v-for="lesson in lessons" :key="lesson._id">
              <router-link :to="`/lesson/${lesson._id}`">{{
                lesson.title || 'Без назви'
              }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="accessDenied" class="warning">
      <p>
        Увага! Вам не надано доступу для вибору предметів та груп студентів. Зверніться до
        адміністратора.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '../axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

const groupId = ref('')
const subjectId = ref('')
const lessonTitle = ref('')
const groups = ref([])
const subjects = ref([])
const lessonCreated = ref(null)
const recentLessons = ref([])

const authStore = useAuthStore()
const accessDenied = computed(() => {
  if (authStore.user && authStore.user.role === 'teacher') {
    return (
      !authStore.user.allowedSubjects ||
      authStore.user.allowedSubjects.length === 0 ||
      !authStore.user.allowedGroups ||
      authStore.user.allowedGroups.length === 0
    )
  }
  return false
})

const fetchAllowedSubjects = async () => {
  try {
    const response = await axios.get('/api/teacher/allowed-subjects')
    subjects.value = response.data
    if (subjects.value.length > 0) {
      subjectId.value = subjects.value[0]._id
    }
  } catch (error) {
    console.error('Error fetching allowed subjects:', error)
  }
}

const fetchAllowedGroups = async () => {
  try {
    const response = await axios.get('/api/teacher/allowed-groups')
    groups.value = response.data
    if (groups.value.length > 0) {
      groupId.value = groups.value[0]._id
    }
  } catch (error) {
    console.error('Error fetching allowed groups:', error)
  }
}

const createLesson = async () => {
  try {
    const response = await axios.post('/api/lessons/create', {
      subjectId: subjectId.value,
      lessonTitle: lessonTitle.value,
      groupId: groupId.value,
    })

    router.push(`/lesson/${response.data.lessonId}`)
  } catch (error) {
    console.error('Error creating lesson:', error)
  }
}

const fetchRecentLessons = async () => {
  try {
    const response = await axios.get('/api/lessons/teacher/last7')
    recentLessons.value = response.data
  } catch (error) {
    console.error('Error fetching recent lessons:', error)
  }
}

const groupedLessons = computed(() => {
  const groups = {}
  recentLessons.value.forEach((lesson) => {
    const lessonDate = new Date(lesson.createdAt)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)
    const formatDate = (d) => d.toISOString().split('T')[0]
    const lessonDateStr = formatDate(lessonDate)
    const todayStr = formatDate(today)
    const yesterdayStr = formatDate(yesterday)
    let label = lessonDateStr
    if (lessonDateStr === todayStr) label = 'Сьогодні'
    else if (lessonDateStr === yesterdayStr) label = 'Вчора'
    if (!groups[label]) groups[label] = []
    groups[label].push(lesson)
  })
  return groups
})

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toISOString().split('T')[0]
}

onMounted(() => {
  fetchAllowedSubjects()
  fetchAllowedGroups()
  fetchRecentLessons()
})
</script>

<style scoped>
.stats-page-container,
.dashboard-container {
  color: #e0e0e0;
  margin: 1rem;
  border-radius: 8px;
}
.warning {
  background-color: #ff9800;
  color: #2c2c2c;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  margin: 1rem;
  font-weight: bold;
}

.selection-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  /* max-width: 400px; */
}

label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #424242;
  color: #e0e0e0;
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
}

.btn-submit:hover {
  background-color: hsla(160, 100%, 33%, 1);
}

.stats-result {
  background-color: #424242;
  padding: 1rem;
  border-radius: 4px;
}

.stats-result p {
  margin: 0.5rem 0;
}

.lesson-form {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;
  margin-bottom: 2rem;
  margin-top: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-select,
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
  margin-top: 1rem;
}

.btn-submit:hover {
  background-color: hsla(160, 100%, 33%, 1);
}

.lesson-link {
  display: inline-block;
  color: hsla(160, 100%, 37%, 1);
  font-weight: bold;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-bottom 0.3s ease;
  padding: 1rem;
  margin-top: 0.5rem;
}

.lesson-link:hover {
  border-bottom: 1px solid hsla(160, 100%, 37%, 1);
}

/* Стилі для секції останніх занять */
.recent-lessons {
  margin-top: 2rem;
}
.lesson-group {
  margin-bottom: 1rem;
}
.lesson-group h3 {
  margin-bottom: 0.5rem;
  text-align: start;
}
.lesson-group ul {
  list-style: none;
  padding: 0;
}
.lesson-group li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #555;
}
.lesson-date {
  font-size: 0.9rem;
  color: #ccc;
}
</style>
