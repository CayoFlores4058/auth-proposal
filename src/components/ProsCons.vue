<script setup lang="ts">
defineProps<{
  pros: string[]
  cons: string[]
}>()
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div class="rounded-xl border border-emerald-300/70 bg-emerald-50/50 p-4 dark:border-emerald-700/50 dark:bg-emerald-900/10">
      <h5 class="mb-2 flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
        Ventajas
      </h5>
      <ul class="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
        <li v-for="pro in pros" :key="pro" class="flex gap-2">
          <span class="text-emerald-500">+</span>
          <span>{{ pro }}</span>
        </li>
      </ul>
    </div>
    <div class="rounded-xl border border-rose-300/70 bg-rose-50/50 p-4 dark:border-rose-700/50 dark:bg-rose-900/10">
      <h5 class="mb-2 flex items-center gap-1.5 text-sm font-semibold text-rose-700 dark:text-rose-400">
        Desventajas
      </h5>
      <ul class="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
        <li v-for="con in cons" :key="con" class="flex gap-2">
          <span class="text-rose-500">–</span>
          <span>{{ con }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
