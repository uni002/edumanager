<template>
  <div ref="chartEl" :style="{ width: '100%', height: height + 'px' }"></div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  type: { type: String, default: 'ColumnChart' },
  data: { type: Array, required: true },
  options: { type: Object, default: () => ({}) },
  height: { type: Number, default: 300 }
})
const chartEl = ref(null)
let chart = null

const loadGoogleCharts = () => new Promise((resolve) => {
  if (window.google && window.google.charts) {
    window.google.charts.load('current', { packages: ['corechart','bar','line'] })
    window.google.charts.setOnLoadCallback(resolve)
    return
  }
  const s = document.createElement('script')
  s.src = 'https://www.gstatic.com/charts/loader.js'
  s.onload = () => {
    window.google.charts.load('current', { packages: ['corechart','bar','line'] })
    window.google.charts.setOnLoadCallback(resolve)
  }
  document.head.appendChild(s)
})

const draw = async () => {
  await nextTick()
  if (!chartEl.value || !props.data?.length) return
  const dt = window.google.visualization.arrayToDataTable(props.data)
  const Ctor = window.google.visualization[props.type]
  if (!Ctor) return
  chart = new Ctor(chartEl.value)
  chart.draw(dt, { legend: { position: 'bottom' }, ...props.options })
}

onMounted(async () => { await loadGoogleCharts(); draw() })
watch(() => props.data, draw, { deep: true })
</script>
