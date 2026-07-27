import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'cognito-auth-docs:theme'

function getInitialTheme(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const isDark = ref(false)
let initialized = false

export function useDarkMode() {
  if (!initialized) {
    isDark.value = getInitialTheme()
    watchEffect(() => {
      document.documentElement.classList.toggle('dark', isDark.value)
      localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    })
    initialized = true
  }

  function toggle() {
    isDark.value = !isDark.value
  }

  return { isDark, toggle }
}
