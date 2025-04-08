<template>
  <div class="live-lesson-container">
    <h1 v-if="lessonInfo" class="lesson-title">
      {{ lessonInfo.subject }} / {{ lessonInfo.title }}
    </h1>
    <div class="attendances-container">
      <div class="qr-section">
        <h3>QR Код для відмітки</h3>
        <img :src="qrCode" alt="QR Code" class="qr-image" />
      </div>
      <div class="attendance-section">
        <h3 v-if="students.length">Відмічені студенти</h3>
        <ul class="attendance-list">
          <li v-for="(student, index) in students" :key="index">
            <span class="student-name">{{ student.name }}</span>
            <span class="attendance-time">{{ formatTime(student.time) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '../axios'
import { io } from 'socket.io-client'

const route = useRoute()
const lessonId = route.params.lessonId
const qrCode = ref('')
const students = ref([])
const lessonInfo = ref(null)

const socket = io('http://localhost:3000')

const formatTime = (time) => {
  const date = new Date(time)
  return date.toLocaleTimeString()
}

const fetchLessonData = async () => {
  try {
    const response = await axios.get(`/api/lessons/${lessonId}`)
    qrCode.value = response.data.qrCode
    lessonInfo.value = response.data
  } catch (error) {
    console.error('Error fetching lesson data:', error)
  }
}

const fetchAttendances = async () => {
  try {
    const response = await axios.get(`/api/lessons/${lessonId}/attendances`)
    students.value = response.data
  } catch (error) {
    console.error('Error fetching attendances:', error)
  }
}

onMounted(() => {
  fetchLessonData()
  fetchAttendances()
  socket.emit('joinLesson', lessonId)

  socket.on('qrUpdated', (data) => {
    qrCode.value = data.newQrCode
  })

  socket.on('studentMarked', (data) => {
    if (!students.value.some((s) => s.id.toString() === data.student.id.toString())) {
      students.value.push(data.student)
    }
  })
})

onUnmounted(() => {
  socket.disconnect()
})
</script>

<style scoped>
.live-lesson-container {
  color: #e0e0e0;
  border-radius: 8px;
  max-width: 1200px;
  margin: 1rem auto;
}

.lesson-title {
  border-bottom: 1px solid #555;
  margin-bottom: 1rem;
}

.attendances-container {
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

.qr-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
}
.qr-image {
  width: 100%;
  object-fit: contain;
}
.attendance-section {
  flex: 1;
  border-radius: 8px;
  overflow-y: auto;
  max-height: 600px;
}
.attendance-list {
  list-style: none;
  padding: 0;
}
.attendance-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 1px solid #555;
}
.student-name {
  font-weight: bold;
}
.attendance-time {
  font-size: 0.9rem;
  color: #ccc;
}

@media screen and (max-width: 720px) {
  .attendances-container {
    flex-direction: column;
  }

  .live-lesson-container {
    margin: 0;
  }
}
</style>
