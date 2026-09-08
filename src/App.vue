<template>
  <div id="piccolo-app" :class="{ 'dark-mode': isDark }">
    <LayoutHeader v-if="showLayout" />
    <main class="main-content" :class="{ 'with-header': showLayout }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
  <BirthdayEffect />
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import LayoutHeader from '@/components/LayoutHeader.vue'
import BirthdayEffect from '@/components/BirthdayEffect.vue'

const route = useRoute()
const isDark = ref(false)

// 登录/注册页面不显示头部
const showLayout = computed(() => {
  return !['login', 'register'].includes(route.name)
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
