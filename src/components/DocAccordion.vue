<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  items: { title: string; body: string }[]
}>()

const openIndex = ref<number | null>(0)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<template>
  <div
    class="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/60"
  >
    <div v-for="(item, i) in props.items" :key="item.title">
      <button
        type="button"
        class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800/50"
        :aria-expanded="openIndex === i"
        @click="toggle(i)"
      >
        <span>{{ item.title }}</span>
        <svg
          class="h-4 w-4 shrink-0 transition-transform duration-200"
          :class="{ 'rotate-180': openIndex === i }"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div v-show="openIndex === i" class="px-5 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {{ item.body }}
      </div>
    </div>
  </div>
</template>
