<script setup lang="ts">
import { computed } from "vue";

interface Props {
  iconName: string
  size?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
})

const symbolId = computed(() => `#icon-${props.iconName}`)
</script>

<template>
  <svg class="icon" :width="size" :height="size" aria-hidden="true">
    <use :href="symbolId" />
  </svg>
</template>

<style src="./style.scss" lang="scss"></style>
