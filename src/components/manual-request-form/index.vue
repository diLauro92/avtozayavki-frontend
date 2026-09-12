<script setup lang="ts">
import { useManualRequestForm } from '@/composables/useManualRequestForm'
import { useRequestsStore } from '@/stores'
import { vMaska } from 'maska/vue'

const emit = defineEmits<{
  success: []
}>()

const store = useRequestsStore()
const { form, isValid, resetForm, fullPhone } = useManualRequestForm()

const phoneMask = {
  mask: '+7 (###) ###-##-##',
  preProcess: (value: string) => value.replace(/^(\+?7|8)/, ''),
}

function onMaska(event: CustomEvent) {
  form.phoneRaw = event.detail.unmasked
}

async function handleSubmit() {
  await store.createRequest({
    source: 'manual',
    phone: fullPhone.value,
    problem: form.problem,
    client_name: form.client_name || undefined,
    car_info: form.car_info || undefined,
    urgency: form.urgency || undefined,
  })

  resetForm()
  emit('success')
}
</script>

<template>
  <form class="manual-form" @submit.prevent="handleSubmit">
    <h2 class="manual-form__title">Новая заявка</h2>

    <label class="manual-form__field">
      <span class="manual-form__label">Телефон *</span>
      <input
        v-model="form.phone"
        v-maska="phoneMask"
        @maska="onMaska"
        class="manual-form__input"
        type="tel"
        placeholder="+7 900 000-00-00"
      />
    </label>

    <label class="manual-form__field">
      <span class="manual-form__label">Проблема *</span>
      <textarea
        v-model="form.problem"
        class="manual-form__input manual-form__input--area"
        rows="3"
        placeholder="Что случилось с машиной"
      />
    </label>

    <label class="manual-form__field">
      <span class="manual-form__label">Имя клиента</span>
      <input v-model="form.client_name" class="manual-form__input" type="text" placeholder="Иван" />
    </label>

    <label class="manual-form__field">
      <span class="manual-form__label">Авто</span>
      <input
        v-model="form.car_info"
        class="manual-form__input"
        type="text"
        placeholder="Toyota Camry, 2018"
      />
    </label>

    <label class="manual-form__field">
      <span class="manual-form__label">Срочность</span>
      <select v-model="form.urgency" class="manual-form__input manual-form__select">
        <option value="">Не указана</option>
        <option value="today">Сегодня</option>
        <option value="soon">1–2 дня</option>
        <option value="planned">Планово</option>
        <option value="emergency">Аварийно</option>
      </select>
    </label>

    <button class="manual-form__submit" type="submit" :disabled="!isValid">Создать заявку</button>
  </form>
</template>

<style src="./style.scss" lang="scss"></style>
