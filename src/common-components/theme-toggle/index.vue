<script setup lang="ts">
import { computed } from 'vue'

import { useTheme } from '@/composables/useTheme'
import Icon from '@/common-components/icon/index.vue'

const { theme, toggleTheme } = useTheme()

const iconName = computed(() => (theme.value === 'dark' ? 'sun' : 'moon'))
</script>

<template>
  <button class="theme-toggle" type="button" @click="toggleTheme">
    <Icon :icon-name="iconName" :size="20" />
  </button>
</template>

<style src="./style.scss" lang="scss"></style>
