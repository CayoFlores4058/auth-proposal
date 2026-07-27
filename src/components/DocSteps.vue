<script setup lang="ts">
defineProps<{
  steps: { title: string; body: string; tag?: string }[]
}>()
</script>

<template>
  <ol class="relative border-l border-slate-200 pl-8 dark:border-slate-800">
    <li v-for="(step, i) in steps" :key="step.title" class="mb-10 last:mb-0">
      <span
        class="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full border border-sky-300 bg-sky-50 text-sm font-semibold text-sky-700 dark:border-sky-700 dark:bg-slate-900 dark:text-sky-400"
      >
        {{ i + 1 }}
      </span>
      <div class="pt-0.5">
        <div class="mb-1 flex flex-wrap items-center gap-2">
          <h4 class="font-semibold text-slate-900 dark:text-slate-100">{{ step.title }}</h4>
          <span
            v-if="step.tag"
            class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          >
            {{ step.tag }}
          </span>
        </div>
        <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{{ step.body }}</p>
      </div>
    </li>
  </ol>
</template>
