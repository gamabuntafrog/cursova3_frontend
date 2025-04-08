<!-- src/pages/StudentMark.vue -->
<template>
  <div>
    <h1 style="color: white" v-if="message">
      <p>{{ message }}</p>
    </h1>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../axios'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const message = ref('')

onMounted(async () => {
  const lessonId = route.query.id
  const token = route.query.token

  if (!authStore.token) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
    return
  }

  try {
    const response = await axios.get(`/mark?id=${lessonId}&token=${token}`)
    message.value = response.data
  } catch (error) {
    if (error.response && error.response.data) {
      message.value = error.response.data
    } else {
      message.value = 'Error marking attendance.'
    }
  }
})
</script>
