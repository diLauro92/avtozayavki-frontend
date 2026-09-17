<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { LEGAL_DOCUMENTS, type LegalSlug } from './documents'

const props = defineProps<{ slug: LegalSlug }>()

const legalDocument = computed(() => LEGAL_DOCUMENTS[props.slug])

onMounted(() => {
  document.title = `${legalDocument.value.title} — LeadHub`
})
</script>

<template>
  <article class="legal-page">
    <h1 class="legal-page__title">{{ legalDocument.title }}</h1>
    <p class="legal-page__updated">Редакция от {{ legalDocument.updated }}</p>

    <section
      v-for="section in legalDocument.sections"
      :key="section.title"
      class="legal-page__section"
    >
      <h2 class="legal-page__section-title">{{ section.title }}</h2>

      <template v-for="(block, index) in section.blocks" :key="index">
        <p v-if="block.type === 'p'" class="legal-page__text">{{ block.text }}</p>

        <ul v-else class="legal-page__list">
          <li v-for="item in block.items" :key="item" class="legal-page__item">{{ item }}</li>
        </ul>
      </template>
    </section>
  </article>
</template>

<style src="./style.scss" lang="scss"></style>
