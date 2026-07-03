import { ref } from "vue";

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const DEFAULT_THEME: Theme = 'dark'

// ref на уровне модуля — одно состояние на всё приложение (синглтон)
const theme = ref<Theme>(DEFAULT_THEME)

function applyTheme(value: Theme): void {
  document.documentElement.setAttribute('data-theme', value)
}

export function useTheme() {
  function setTheme(value: Theme): void {
    theme.value = value
    applyTheme(value)
    localStorage.setItem(STORAGE_KEY, value)
  }

  function toggleTheme(): void {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function initTheme(): void {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null

    setTheme(savedTheme ?? DEFAULT_THEME)
  }

  return { theme, setTheme, toggleTheme, initTheme }
}
