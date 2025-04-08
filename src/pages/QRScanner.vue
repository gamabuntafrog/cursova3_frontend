<template>
  <div class="qr-scanner">
    <h2>Сканування QR-коду</h2>
    <video ref="video" autoplay playsinline></video>
    <canvas ref="canvas" style="display: none"></canvas>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import jsQR from 'jsqr'
import axios from 'axios'
export default {
  name: 'QRScanner',
  data() {
    return {
      message: '',
      scanning: false,
    }
  },
  methods: {
    async startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        this.$refs.video.srcObject = stream
        this.scanning = true
        requestAnimationFrame(this.scanFrame)
      } catch (error) {
        console.error('Помилка доступу до камери:', error)
      }
    },
    scanFrame() {
      if (!this.scanning) return
      const video = this.$refs.video
      const canvas = this.$refs.canvas
      const context = canvas.getContext('2d')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, canvas.width, canvas.height)
      if (code) {
        this.scanning = false
        this.processQRCode(code.data)
      } else {
        requestAnimationFrame(this.scanFrame)
      }
    },
    async processQRCode(qrData) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(
          '/api/attendance/mark',
          { qrData },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        this.message = 'Відвідування зафіксовано: ' + response.data.message
      } catch (error) {
        console.error('Помилка фіксації відвідування:', error)
        this.message = 'Помилка сканування QR-коду'
      }
    },
  },
  mounted() {
    this.startCamera()
  },
}
</script>

<style scoped>
/* Додайте ваші стилі */
</style>
