<template>
  <Teleport to="body">
    <!-- 彩带画布 -->
    <canvas v-if="show" ref="canvasRef" class="birthday-canvas"></canvas>

    <!-- 祝福弹窗 -->
    <Transition name="blessing">
      <div v-if="showBlessing" class="blessing-overlay" @click="closeBlessing">
        <div class="blessing-card" @click.stop>
          <div class="blessing-cake">🎂</div>
          <h1 class="blessing-title">生日快乐！</h1>
          <p class="blessing-text">亲爱的 {{ nickname }}，</p>
          <p class="blessing-text">愿你今天的每一刻都充满欢乐，</p>
          <p class="blessing-text">愿你新的一岁万事胜意！🎉</p>
          <div class="blessing-emojis">
            <span>🎈</span><span>🎁</span><span>🎊</span><span>🥳</span><span>🎈</span>
          </div>
          <el-button type="primary" round size="large" class="blessing-btn" @click="closeBlessing">
            谢谢~ 🥰
          </el-button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const canvasRef = ref(null)
const show = ref(false)
const showBlessing = ref(false)
const nickname = ref('')

let animId = null
let particles = []
const COLORS = [
  '#ff6b9d', '#c44dff', '#ffd700', '#ff4757',
  '#2ed573', '#1e90ff', '#ff6348', '#ffa502'
]

function isBirthday() {
  const user = userStore.userInfo
  if (!user || !user.birthday) return false
  const today = new Date()
  const bday = new Date(user.birthday)
  return today.getMonth() === bday.getMonth() && today.getDate() === bday.getDate()
}

class Particle {
  constructor(canvasW, canvasH) {
    this.x = Math.random() * canvasW
    this.y = Math.random() * -canvasH
    this.w = Math.random() * 10 + 5
    this.h = Math.random() * 6 + 3
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)]
    this.vy = Math.random() * 2 + 1.5
    this.vx = (Math.random() - 0.5) * 1.5
    this.angle = Math.random() * Math.PI * 2
    this.angVel = (Math.random() - 0.5) * 0.1
    this.oscillAmp = Math.random() * 1.5
    this.oscillFreq = Math.random() * 0.03 + 0.01
    this.t = Math.random() * 100
    this.opacity = Math.random() * 0.4 + 0.6
  }

  update(canvasW, canvasH) {
    this.t++
    this.x += this.vx + Math.sin(this.t * this.oscillFreq) * this.oscillAmp
    this.y += this.vy
    this.angle += this.angVel
    if (this.y > canvasH + 20) {
      this.y = -20
      this.x = Math.random() * canvasW
    }
    if (this.x < -20) this.x = canvasW + 20
    if (this.x > canvasW + 20) this.x = -20
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = this.color
    ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h)
    ctx.restore()
  }
}

function startConfetti() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const count = Math.min(120, Math.floor(window.innerWidth / 8))
  particles = Array.from({ length: count }, () => new Particle(canvas.width, canvas.height))

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const p of particles) {
      p.update(canvas.width, canvas.height)
      p.draw(ctx)
    }
    animId = requestAnimationFrame(loop)
  }
  loop()
}

function closeBlessing() {
  showBlessing.value = false
  // 彩带继续飘一会儿再停
  setTimeout(() => {
    show.value = false
    if (animId) {
      cancelAnimationFrame(animId)
      animId = null
    }
    particles = []
  }, 3000)
}

onMounted(() => {
  if (!isBirthday()) return
  nickname.value = userStore.userInfo?.nickname || userStore.userInfo?.username || ''
  show.value = true
  startConfetti()
  // 延迟 1 秒弹出祝福
  setTimeout(() => {
    showBlessing.value = true
  }, 1000)
})

onBeforeUnmount(() => {
  if (animId) {
    cancelAnimationFrame(animId)
    animId = null
  }
})
</script>

<style scoped>
.birthday-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9998;
}

.blessing-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.blessing-card {
  background: white;
  border-radius: 28px;
  padding: 40px 36px;
  text-align: center;
  max-width: 380px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(196, 77, 255, 0.25);
  position: relative;
  overflow: hidden;
}

.blessing-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff6b9d, #c44dff, #ffd700, #2ed573, #1e90ff);
}

.blessing-cake {
  font-size: 64px;
  animation: cakeBounce 1.5s ease-in-out infinite;
  margin-bottom: 8px;
}

@keyframes cakeBounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.1); }
}

.blessing-title {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #ff6b9d, #c44dff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 16px;
}

.blessing-text {
  font-size: 15px;
  color: #555;
  margin: 4px 0;
  line-height: 1.6;
}

.blessing-emojis {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 20px 0;
  font-size: 28px;
}

.blessing-emojis span {
  animation: emojiFloat 2s ease-in-out infinite;
}

.blessing-emojis span:nth-child(1) { animation-delay: 0s; }
.blessing-emojis span:nth-child(2) { animation-delay: 0.2s; }
.blessing-emojis span:nth-child(3) { animation-delay: 0.4s; }
.blessing-emojis span:nth-child(4) { animation-delay: 0.6s; }
.blessing-emojis span:nth-child(5) { animation-delay: 0.8s; }

@keyframes emojiFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.blessing-btn {
  margin-top: 8px;
  background: linear-gradient(135deg, #c44dff, #ff6b9d);
  border: none;
  font-weight: 700;
  font-size: 15px;
  padding: 12px 32px;
}

/* 弹窗动画 */
.blessing-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.blessing-leave-active {
  transition: all 0.3s ease;
}
.blessing-enter-from {
  opacity: 0;
}
.blessing-enter-from .blessing-card {
  transform: scale(0.5) translateY(40px);
}
.blessing-leave-to {
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .blessing-card {
    padding: 32px 24px;
    border-radius: 24px;
  }

  .blessing-cake {
    font-size: 48px;
  }

  .blessing-title {
    font-size: 24px;
  }

  .blessing-text {
    font-size: 14px;
  }

  .blessing-emojis {
    font-size: 24px;
    gap: 8px;
  }
}
</style>
