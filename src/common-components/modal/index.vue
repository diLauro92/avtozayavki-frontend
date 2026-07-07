<script setup lang="ts">
import { ref, watch } from "vue";
import Icon from '@/common-components/icon/index.vue'

interface Props {
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

watch(
  () => props.open,
  (isOpen) => {
    const dialog = dialogRef.value

    if (!dialog) return

    if (isOpen) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }
)

function close(): void {
  emit('update:open', false)
}

function handleBackdropClick(event: MouseEvent): void {
  if (event.target === event.currentTarget) {
    close()
  }
}
</script>

<template>
  <dialog
    ref="dialogRef"
    class="modal"
    @close="close"
    @click="handleBackdropClick"
  >
    <div class="modal__box" @click.stop>
      <button class="modal__close" type="button" @click="close">
        <Icon icon-name="close" :size="20" />
      </button>
      <slot />
    </div>
  </dialog>
</template>

<style src="./style.scss" lang="scss"></style>
