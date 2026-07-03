<script setup lang="ts">
import { computed } from 'vue'

import type { RequestStatus } from '@/types'
import { getStatusText, getStatusColor } from '@/helpers/request'

interface Props {
  status: RequestStatus
}

const props = defineProps<Props>()

const text = computed(() => getStatusText(props.status))
const color = computed(() => getStatusColor(props.status))
</script>

<template>
  <span class="status-badge" :class="`status-badge--${color}`">
    {{ text }}
  </span>
</template>

<style src="./style.scss" lang="scss"></style>
