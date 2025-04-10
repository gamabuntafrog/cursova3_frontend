<template>
  <div class="home-container">
    <!-- Якщо користувач не авторизований -->
    <div v-if="!isAuthenticated">
      <h1>🎓 Система контролю відвідуваності студентів</h1>
      <p>
        Наш додаток допомагає викладачам швидко та зручно фіксувати присутність студентів на
        заняттях за допомогою динамічних QR-кодів. Студенти відмічають свою присутність, просто
        скануючи код зі смартфона.
      </p>
      <h2>✅ Можливості:</h2>
      <ul>
        <li>Викладачі створюють заняття та генерують QR-коди.</li>
        <li>Студенти сканують код та автоматично відмічаються.</li>
        <li>Відвідуваність фіксується в реальному часі.</li>
        <li>Статистика доступна в особистому кабінеті викладача.</li>
      </ul>
      <p style="margin-top: 1rem">🔐 Щоб скористатися можливостями додатку, будь ласка:</p>
      <div class="auth-links">
        <a href="/login">🔑 Увійти</a>
        <a href="/register">📝 Зареєструватися</a>
      </div>
    </div>

    <!-- Якщо користувач увійшов як студент -->
    <div v-else-if="user && user.role === 'student'">
      <h1>👋 Вітаємо в системі контролю відвідуваності!</h1>
      <p>
        Цей додаток створений для того, щоб зробити процес відмітки присутності швидким, зручним і
        прозорим.
      </p>
      <h2>📱 Як користуватись:</h2>
      <ol style="margin: 1rem 0">
        <li>Скануй QR-код, який показує викладач на початку заняття.</li>
        <li>Після сканування тебе буде автоматично перенаправлено на сторінку відмітки.</li>
        <li>
          Якщо ти увійшов у свій акаунт — твоя присутність буде зафіксована автоматично. Якщо ні —
          спочатку виконай вхід, і система поверне тебе на сторінку відмітки.
        </li>
      </ol>
      <h2>👥 Зміна групи:</h2>
      <h3>Якщо ти перейшов у нову групу або змінив спеціальність:</h3>
      <ol style="margin: 1rem 0">
        <li>Перейди у свій профіль.</li>
        <li>Вибери актуальну групу зі списку.</li>
        <li>Збережи зміни.</li>
      </ol>
      <p>🛠 Якщо щось не працює — звернись до свого викладача або адміністратора системи.</p>
    </div>

    <!-- Якщо користувач увійшов, але не студент (викладач або адміністратор) -->
    <div v-else>
      <h1>Вітаємо!</h1>
      <p>Ласкаво просимо до системи контролю відвідуваності студентів.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => !!authStore.token)
const user = computed(() => authStore.user)
</script>

<style scoped>
.home-container {
  color: #e0e0e0;
  padding: 2rem;
  max-width: 800px;
  border-radius: 8px;
  text-align: start;
}
h1 {
  color: hsla(160, 100%, 37%, 1);
  margin-bottom: 1rem;
}
h2 {
  color: hsla(160, 100%, 37%, 1);
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
p {
  line-height: 1.5;
  margin-bottom: 1rem;
}
ul {
  padding: 0;
  max-width: 600px;
  text-align: left;
  margin-left: 2rem;
}
li {
  margin-bottom: 0.5rem;
}
.auth-links {
  display: flex;
  justify-content: start;
  gap: 1rem;
  margin-top: 1rem;
}
.auth-links a {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  font-weight: bold;
  border: 1px solid hsla(160, 100%, 37%, 1);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
.auth-links a:hover {
  background-color: hsla(160, 100%, 33%, 1);
  color: #2c2c2c;
}
</style>
