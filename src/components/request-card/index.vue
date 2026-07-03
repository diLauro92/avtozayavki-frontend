<script setup lang="ts">
import type { Request } from '@/types'
import { computed } from "vue";
import { formatDateTime, formatPhone } from "@/helpers/format";
import { getSourceIcon, getSourceText, getUrgencyText } from "@/helpers/request";
import Icon from '@/common-components/icon/index.vue'
import StatusSelect from '@/components/status-select/index.vue'

interface Props {
  request: Request
}

const props = defineProps<Props>()

const clientName = computed(() => props.request.client_name ?? 'Без имени')

const metaText = computed(() => {
  const phone = formatPhone(props.request.phone)
  const car = props.request.car_info

  return car ? `${car} · ${phone}` : phone
})

const isEmergency = computed(() => props.request.urgency === 'emergency')

const urgencyText = computed(() => {
  if (!props.request.urgency)
    return null

  return getUrgencyText(props.request.urgency)
})

const sourceText = computed(() => getSourceText(props.request.source))
const sourceIcon = computed(() => getSourceIcon(props.request.source))
const timeText = computed(() => formatDateTime(props.request.created_at))
</script>

<template>
  <article class="request-card">
    <div class="request-card__top">
      <span class="request-card__id">#{{ request.id }}</span>
      <StatusSelect :request-id="request.id" :status="request.status" />

      <span
        v-if="urgencyText"
        class="request-card__urgency"
        :class="{ 'request-card__urgency--emergency': isEmergency }"
      >
        <Icon v-if="isEmergency" icon-name="alert" :size="14" />
        {{ urgencyText }}
      </span>
    </div>

    <p class="request-card__name">{{ clientName }}</p>
    <p class="request-card__meta">{{ metaText }}</p>
    <p class="request-card__problem">{{ request.problem }}</p>

    <div class="request-card__foot">
      <span class="request-card__source">
        <Icon :icon-name="sourceIcon" :size="15" />
        {{ sourceText }} · {{ timeText }}
      </span>
    </div>
  </article>
</template>

<style src="./style.scss" lang="scss"></style>
