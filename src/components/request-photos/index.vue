<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import type { Photo } from '@/types'
import Icon from '@/common-components/icon/index.vue'

const props = defineProps<{
  photos: Photo[]
}>()

const openedIndex = ref<number | null>(null)

const opened = computed<Photo | null>(() =>
  openedIndex.value === null ? null : (props.photos[openedIndex.value] ?? null),
)

const hasMany = computed(() => props.photos.length > 1)

const counter = computed(() => `${(openedIndex.value ?? 0) + 1} / ${props.photos.length}`)

function open(index: number) {
  openedIndex.value = index
}

function close() {
  openedIndex.value = null
}

function step(delta: number) {
  if (openedIndex.value === null) {
    return
  }

  const total = props.photos.length

  openedIndex.value = (openedIndex.value + delta + total) % total
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }

  if (event.key === 'ArrowLeft') {
    step(-1)
  }

  if (event.key === 'ArrowRight') {
    step(1)
  }
}

watch(opened, (photo) => {
  if (photo) {
    window.addEventListener('keydown', onKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    window.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div v-if="photos.length" class="request-photos">
    <button
      v-for="(photo, index) in photos"
      :key="photo.id"
      type="button"
      class="request-photos__item"
      @click="open(index)"
    >
      <img
        class="request-photos__img"
        :src="photo.thumb_url"
        :width="photo.width"
        :height="photo.height"
        alt="Фото к заявке"
        loading="lazy"
      />
    </button>
  </div>

  <Teleport to="body">
    <div v-if="opened" class="photo-viewer" @click.self="close">
      <button type="button" class="photo-viewer__close" aria-label="Закрыть" @click="close">
        <Icon icon-name="close" :size="16" />
      </button>

      <button
        v-if="hasMany"
        type="button"
        class="photo-viewer__nav photo-viewer__nav--prev"
        aria-label="Предыдущее фото"
        @click="step(-1)"
      >
        <Icon icon-name="chevron" :size="16" class="photo-viewer__nav-icon" />
      </button>

      <img class="photo-viewer__img" :src="opened.url" alt="Фото к заявке" />

      <button
        v-if="hasMany"
        type="button"
        class="photo-viewer__nav photo-viewer__nav--next"
        aria-label="Следующее фото"
        @click="step(1)"
      >
        <Icon icon-name="chevron" :size="16" class="photo-viewer__nav-icon" />
      </button>

      <span v-if="hasMany" class="photo-viewer__counter">{{ counter }}</span>
    </div>
  </Teleport>
</template>

<style src="./style.scss"></style>
