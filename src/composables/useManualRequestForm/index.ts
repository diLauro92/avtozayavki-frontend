import type { RequestUrgency } from "@/types";
import { computed, reactive } from "vue";
import { isValidPhone } from "@/helpers/format";

interface ManualRequestForm {
  client_name: string
  phone: string // masked для инпута
  phoneRaw: string  // unmasked для payload и валидации
  problem: string
  car_info: string
  urgency: RequestUrgency | ''
}

const createEmptyForm = (): ManualRequestForm => ({
  client_name: '',
  phone: '',
  phoneRaw: '',
  problem: '',
  car_info: '',
  urgency: '',
})

export const useManualRequestForm = () => {
  const form = reactive<ManualRequestForm>(createEmptyForm())

  const resetForm = () => {
    Object.assign(form, createEmptyForm())
  }

  const isValid = computed(() => {
    return isValidPhone(form.phoneRaw) && form.problem.trim().length > 0
  })

  return { form, resetForm, isValid }
}
