<script setup lang="ts">
import { computed } from 'vue'
import type { SlaZone } from '@/types'

interface Props {
  zone: SlaZone
  progress: number
  minutes: number
}

const props = defineProps<Props>()

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const dashOffset = computed(() => {
  return CIRCUMFERENCE - (props.progress / 100) * CIRCUMFERENCE
})

const label = computed(() => (props.minutes > 60 ? '60+' : String(props.minutes)))
</script>

<template>
  <div class="sla-indicator" :class="`sla-indicator--${zone}`">
    <svg class="sla-indicator__ring" viewBox="0 0 48 48" width="48" height="48">
      <circle class="sla-indicator__track" cx="24" cy="24" :r="RADIUS" />
      <circle
        class="sla-indicator__arc"
        cx="24"
        cy="24"
        :r="RADIUS"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <span class="sla-indicator__value">{{ label }}</span>
  </div>
</template>

<style src="./style.scss" lang="scss"></style>
