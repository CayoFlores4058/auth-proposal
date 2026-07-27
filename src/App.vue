<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const route = useRoute()
const mobileOpen = ref(false)

watch(
  () => route.path,
  () => {
    mobileOpen.value = false
  },
)
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-950">
    <!-- Mobile top bar -->
    <header
      class="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-950/90"
    >
      <button
        type="button"
        class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        aria-label="Abrir navegación"
        @click="mobileOpen = true"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
        </svg>
      </button>
      <span class="text-sm font-semibold text-slate-800 dark:text-slate-100">Auth Centralizada · Cognito</span>
      <ThemeToggle />
    </header>

    <div class="mx-auto flex max-w-[1400px]">
      <!-- Desktop sidebar -->
      <aside
        class="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200 lg:block dark:border-slate-800"
      >
        <div class="flex h-16 items-center gap-2 border-b border-slate-200 px-4 dark:border-slate-800">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-sm font-bold text-white">
            A
          </div>
          <div class="leading-tight">
            <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">Auth Centralizada</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Propuesta de arquitectura</p>
          </div>
        </div>
        <div class="h-[calc(100vh-4rem)]">
          <AppSidebar />
        </div>
      </aside>

      <!-- Mobile drawer -->
      <div v-if="mobileOpen" class="fixed inset-0 z-40 lg:hidden">
        <div class="absolute inset-0 bg-slate-950/50" @click="mobileOpen = false" />
        <div class="absolute inset-y-0 left-0 w-72 bg-white shadow-xl dark:bg-slate-950">
          <div class="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-sm font-bold text-white">
                A
              </div>
              <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">Auth Centralizada</p>
            </div>
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Cerrar navegación"
              @click="mobileOpen = false"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="h-[calc(100vh-4rem)]">
            <AppSidebar @navigate="mobileOpen = false" />
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="min-w-0 flex-1">
        <header class="sticky top-0 z-20 hidden border-b border-slate-200 bg-white/90 backdrop-blur lg:block dark:border-slate-800 dark:bg-slate-950/90">
          <div class="flex h-16 items-center justify-between px-8">
            <h1 class="text-sm font-medium text-slate-500 dark:text-slate-400">
              {{ (route.meta.title as string) ?? '' }}
            </h1>
            <ThemeToggle />
          </div>
        </header>
        <main class="px-5 py-8 sm:px-8 lg:py-12">
          <router-view />
        </main>
        <footer class="border-t border-slate-200 px-5 py-6 text-xs text-slate-400 sm:px-8 dark:border-slate-800 dark:text-slate-500">
          Documento interno · Propuesta de arquitectura de autenticación centralizada
        </footer>
      </div>
    </div>
  </div>
</template>
