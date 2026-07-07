import { onMounted, onUnmounted, ref } from "vue";

const now = ref(Date.now()) // синглтон один на всё приложение
let intervalId: ReturnType<typeof setInterval> | null = null // хэндл таймера
let subscribers = 0 // счётчик живых потребителей

export const useNow = () => {
  onMounted(() => {
    subscribers++
    if (subscribers === 1) {
      intervalId = setInterval(() => now.value = Date.now(), 30000)
    }
  })

  onUnmounted(() => {
    subscribers--
    if (subscribers === 0 && intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  })

  return { now }
}
