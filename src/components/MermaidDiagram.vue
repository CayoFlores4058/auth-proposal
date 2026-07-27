<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import mermaid from 'mermaid'
import { useDarkMode } from '@/composables/useDarkMode'

const props = defineProps<{
  code: string
  caption?: string
}>()

const container = ref<HTMLDivElement | null>(null)
const { isDark } = useDarkMode()
let renderToken = 0

async function render() {
  if (!container.value) return
  const token = ++renderToken

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: isDark.value ? 'dark' : 'base',
    fontFamily: 'inherit',
    flowchart: { curve: 'basis', htmlLabels: true },
    themeVariables: isDark.value
      ? {
          primaryColor: '#0f172a',
          primaryTextColor: '#e2e8f0',
          primaryBorderColor: '#38bdf8',
          lineColor: '#64748b',
          secondaryColor: '#1e293b',
          tertiaryColor: '#1e293b',
          background: '#0f172a',
          mainBkg: '#1e293b',
          nodeTextColor: '#e2e8f0',
          textColor: '#e2e8f0',
          clusterBkg: '#0f172a',
          clusterBorder: '#334155',
          edgeLabelBackground: '#0f172a',
        }
      : {
          primaryColor: '#eff6ff',
          primaryTextColor: '#0f172a',
          primaryBorderColor: '#0284c7',
          lineColor: '#64748b',
          secondaryColor: '#f8fafc',
          tertiaryColor: '#f1f5f9',
          background: '#ffffff',
          mainBkg: '#f8fafc',
          nodeTextColor: '#0f172a',
          textColor: '#0f172a',
          clusterBkg: '#f8fafc',
          clusterBorder: '#cbd5e1',
          edgeLabelBackground: '#ffffff',
        },
  })

  const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`
  try {
    const { svg } = await mermaid.render(id, props.code.trim())
    if (token === renderToken && container.value) {
      container.value.innerHTML = svg
    }
  } catch (err) {
    if (token === renderToken && container.value) {
      container.value.innerHTML = `<pre class="text-sm text-red-500">Error al renderizar el diagrama: ${String(err)}</pre>`
    }
  }
}

onMounted(render)
watch(isDark, render)
watch(() => props.code, render)
</script>

<template>
  <figure
    class="not-prose overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40"
  >
    <div class="mermaid-diagram flex justify-center overflow-x-auto p-6" ref="container" />
    <figcaption
      v-if="caption"
      class="border-t border-slate-200 bg-white px-4 py-2.5 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>
