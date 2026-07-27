<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    tone?: 'default' | 'warning' | 'danger' | 'success'
  }>(),
  { tone: 'default' },
)

const toneClasses: Record<string, string> = {
  default: 'border-slate-200 dark:border-slate-800',
  warning: 'border-amber-300/70 dark:border-amber-700/60',
  danger: 'border-rose-300/70 dark:border-rose-700/60',
  success: 'border-emerald-300/70 dark:border-emerald-700/60',
}
</script>

<template>
  <div
    class="rounded-xl border bg-white p-5 shadow-sm dark:bg-slate-900/60"
    :class="toneClasses[tone]"
  >
    <h4 v-if="title" class="mb-2 font-semibold text-slate-900 dark:text-slate-100">
      {{ title }}
    </h4>
    <div class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
      <slot />
    </div>
  </div>
</template>
