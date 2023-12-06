<script setup lang="ts">
import { useBarChartStore } from '@/stores/barChartStore'
import { computed, onMounted, ref, watchEffect } from 'vue'
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'

// CONSTS
const width = 900
const height = 460
const margin = { top: 40, bottom: 40, left: 40, right: 40 }
const parseTime = d3.timeParse('%Y-%m-%d')

// STORE
const store = useBarChartStore()
const { dataset } = storeToRefs(store)

// REFS
const displayTooltip = ref(false)
const axisLeftRef = ref<SVGGElement>()
const axisBottomRef = ref<SVGGElement>()
const tooltipRef = ref<HTMLDivElement>()

//METHODS
function showTooltip(x: string, y: number) {
  displayTooltip.value = true
  const formattedDate = d3.timeFormat('%Y Q%q')(new Date(x))
  tooltipRef.value!.setAttribute('data-date', x)
  tooltipRef.value!.style.left = `${xScale.value(parseTime(x) as Date)}px`
  tooltipRef.value!.innerHTML = `
    <h2 class="font-bold">${formattedDate}</h2>
    <div class="text-sm">$${y} Billion</div>
  `
}

function hideTooltip() {
  displayTooltip.value = false
}

// COMPUTED PROPS
const dataMax = computed(() => {
  return d3.max(dataset.value, (d) => d[1]) as number
})

const dataMin = computed(() => {
  return d3.min(dataset.value, (d) => d[1]) as number
})

const yScale = computed(() => {
  return d3
    .scaleLinear()
    .domain([dataMin.value > 0 ? 0 : dataMin.value, dataMax.value])
    .range([height, 0])
})

const xScale = computed(() => {
  return d3
    .scaleUtc()
    .domain(
      /* d3.extent = get min and max values from an dataset:
      d3.extent(dataset.value, (d) => d[1])
      ===
      [d3.min(dataset.value, (d) => d[1]), d3.max(dataset.value, (d) => d[1])]
      */
      d3.extent(dataset.value, (d) => {
        return parseTime(d[0])
      }) as [Date, Date]
    )
    .range([0, width])
})

// LIFECYCLE HOOKS
onMounted(async () => {
  await store.fetchData()
  const yMax = d3.max(dataset.value, (d) => d[1])
  console.log('ym', yMax)

  watchEffect(() => {
    if (!axisLeftRef.value) return
    d3.select(axisLeftRef.value).call(d3.axisLeft(yScale.value))
  })
  watchEffect(() => {
    if (!axisBottomRef.value) return
    d3.select(axisBottomRef.value).call(d3.axisBottom(xScale.value))
  })
})
</script>

<template>
  <div class="chart-container relative">
    <div
      ref="tooltipRef"
      id="tooltip"
      v-show="displayTooltip"
      class="absolute top-[370px] flex w-40 translate-x-16 flex-col items-center justify-center rounded-md border bg-white py-4 opacity-90 shadow-lg"
    ></div>
    <svg :width="width + margin.left + margin.right" :height="height + margin.top + margin.bottom">
      <g :transform="`translate(${margin.left}, ${margin.top})`">
        <rect
          class="bar fill-green-600"
          v-for="d of dataset"
          :key="d[0]"
          :x="xScale(parseTime(d[0]) as Date)"
          :y="yScale(d[1])"
          :width="width / dataset.length"
          :height="height - yScale(d[1])"
          :data-date="d[0]"
          :data-gdp="d[1]"
          @mouseenter="showTooltip(d[0], d[1])"
          @mouseleave="hideTooltip"
        />
        <g id="y-axis" ref="axisLeftRef" />
        <g id="x-axis" ref="axisBottomRef" :transform="`translate(0, ${height})`" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.bar:hover {
  fill: white;
}
</style>
