<template>
  <div class="dashboard-container">
    <h1>Статистика відвідуваності</h1>

    <div class="containers-wrapper">
      <div class="top-container">
        <!-- Форма вибору групи та предмету -->
        <div class="selection-form">
          <div class="form-group">
            <label for="group-select">Оберіть групу:</label>
            <select id="group-select" v-model="selectedGroup" class="form-select">
              <option v-for="group in groups" :key="group._id" :value="group._id">
                {{ group.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="subject-select">Оберіть предмет:</label>
            <select id="subject-select" v-model="selectedSubject" class="form-select">
              <option v-for="subject in subjects" :key="subject._id" :value="subject._id">
                {{ subject.name }}
              </option>
            </select>
          </div>
          <button class="btn-submit" @click="fetchStats">Отримати статистику</button>
        </div>

        <!-- Результати загальної статистики -->
        <div v-if="overallStats?.lessonCount" class="overall-stats">
          <h3>Загальна статистика</h3>
          <p><strong>Кількість проведених занять:</strong> {{ overallStats.lessonCount }}</p>
          <p><strong>Кількість студентів в групі:</strong> {{ overallStats.studentCount }}</p>
          <p>
            <strong>Фактична відвідуваність:</strong> {{ overallStats.totalActualAttendance }} /
            {{ overallStats.maxAttendance }}
          </p>
          <p>
            <strong>Відсоток відвідуваності групи:</strong> {{ overallStats.attendancePercentage }}%
          </p>
        </div>
      </div>

      <!-- Результати детальної статистики -->
      <template v-if="detailedStats?.totalLessons">
        <h1 class="stats-title">Детальна статистика по студентам</h1>
        <div class="detailed-stats">
          <table class="result-table">
            <thead>
              <tr>
                <th>Ім'я студента</th>
                <th>Кількість відвідувань</th>
                <th>Кількість пропусків</th>
                <th>Відсоток відвідуваності</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in detailedStats.studentStats" :key="student.studentId">
                <td>{{ student.name }}</td>
                <td>{{ student.attendanceCount }}</td>
                <td>{{ student.absenceCount }}</td>
                <td>{{ student.attendancePercentage }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <h1
        style="text-align: center; margin: 5rem 1rem"
        v-if="detailedStats && !detailedStats.totalLessons"
      >
        Із заданою групою не проведено жодної пари по даному предмету
      </h1>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '../axios'

const groups = ref([])
const subjects = ref([])
const selectedGroup = ref('')
const selectedSubject = ref('')
const overallStats = ref(null)
const detailedStats = ref(null)
const groupId = ref('')
const subjectId = ref('')

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

const fetchStats = async () => {
  try {
    const overallResponse = await axios.get('/api/stats/group-subject', {
      params: {
        groupId: selectedGroup.value,
        subjectId: selectedSubject.value,
      },
    })
    overallStats.value = overallResponse.data

    const detailedResponse = await axios.get('/api/stats/attendance-detail', {
      params: {
        groupId: selectedGroup.value,
        subjectId: selectedSubject.value,
      },
    })

    detailedStats.value = detailedResponse.data
  } catch (error) {
    console.error('Error fetching statistics:', error)
  }
}

fetchAllowedSubjects()
fetchAllowedGroups()
</script>

<style scoped>
.dashboard-container {
  color: #e0e0e0;
  margin: 1rem 1rem;
  border-radius: 8px;
}

.containers-wrapper {
  border-radius: 8px;
}

.stats-title {
  text-align: start;
  margin-top: 1rem;
}

.top-container {
  display: flex;
}

h3 {
  text-align: center;
  margin-bottom: 1rem;
  color: hsla(160, 100%, 37%, 1);
}
.selection-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  flex: 1;
  padding: 2rem;
  background-color: #424242;
  border-radius: 4px;
  margin-right: 0.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
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
.overall-stats,
.detailed-stats {
  background-color: #424242;
  padding: 1rem;
  border-radius: 4px;
  flex: 1;
}

.overall-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 0.5rem;
  justify-content: center;
}

.result-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.result-table th,
.result-table td {
  border: 1px solid #555;
  padding: 0.5rem;
  text-align: center;
}
.result-table th {
  background-color: #2c2c2c;
}
</style>
