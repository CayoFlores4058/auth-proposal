<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  tabs: string[]
}>()

const active = ref(0)
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60">
    <div
      class="flex flex-wrap gap-1 border-b border-slate-200 px-2 pt-2 dark:border-slate-800"
      role="tablist"
    >
      <button
        v-for="(tab, i) in props.tabs"
        :key="tab"
        type="button"
        role="tab"
        :aria-selected="active === i"
        class="rounded-t-lg px-4 py-2 text-sm font-medium transition-colors"
        :class="
          active === i
            ? 'bg-sky-50 text-sky-700 dark:bg-slate-800 dark:text-sky-400'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
        "
        @click="active = i"
      >
        {{ tab }}
      </button>
    </div>
    <div class="p-5">
      <slot :name="`tab-${active}`" />
    </div>
  </div>
</template>
