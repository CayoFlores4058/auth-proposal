<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="mb-10 max-w-3xl">
    <p v-if="eyebrow" class="mb-2 text-sm font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
      {{ eyebrow }}
    </p>
    <h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
      {{ title }}
    </h1>
    <p v-if="subtitle" class="mt-4 text-lg leading-relaxed text-slate-500 dark:text-slate-400">
      {{ subtitle }}
    </p>
  </div>
</template>
