<script setup lang="ts">
import { useRoute } from 'vue-router'

defineEmits<{ navigate: [] }>()

const route = useRoute()

const nav = [
  {
    to: '/',
    name: 'problema',
    label: 'Inicio / Problema',
    icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z',
  },
  {
    to: '/arquitectura',
    name: 'arquitectura',
    label: 'Arquitectura propuesta',
    icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
  },
  {
    to: '/modelo-datos',
    name: 'modelo-datos',
    label: 'Modelo de datos',
    icon: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 3.75c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125',
  },
  {
    to: '/flujo-autenticacion',
    name: 'flujo-autenticacion',
    label: 'Flujo de autenticación',
    icon: 'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244',
  },
  {
    to: '/migracion',
    name: 'migracion',
    label: 'Estrategia de migración',
    icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99',
  },
  {
    to: '/trade-offs',
    name: 'trade-offs',
    label: 'Decisiones abiertas',
    icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 17.25h.007v.008H12v-.008z',
  },
]
</script>

<template>
  <nav class="flex h-full flex-col gap-1 overflow-y-auto px-3 py-4">
    <router-link
      v-for="item in nav"
      :key="item.to"
      :to="item.to"
      class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
      :class="
        route.name === item.name
          ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100'
      "
      @click="$emit('navigate')"
    >
      <svg
        class="h-5 w-5 shrink-0"
        :class="route.name === item.name ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
      </svg>
      {{ item.label }}
    </router-link>

    <div class="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
      Propuesta de arquitectura · Auth centralizada con Cognito
    </div>
  </nav>
</template>
