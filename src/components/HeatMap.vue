<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watchEffect } from 'vue'
import * as d3 from 'd3'
import { useHeatMapStore } from '@/stores/heatMapStore'
import type { MonthlyVariance } from '@/typings'

const width = 1200
const height = 456
const marginTop = 40
const marginBottom = 200
const marginLeft = 80
const marginRight = 20
const legendWidth = 300
const monthNames = Array.from(Array(12)).map((_, i) =>
  new Date(0, i + 1, 0, 0, 0, 0, 0).toLocaleString('en-US', { month: 'long' })
)

// REFS
const axisLeftRef = ref<SVGGElement>()
const axisBottomRef = ref<SVGGElement>()
const axisColorRef = ref<SVGGElement>()
const tooltipRef = ref<HTMLDivElement>()
const selectedDataPoint = ref<MonthlyVariance | null>(null)

// STORE
const store = useHeatMapStore()
const { dataset, minMaxYears, baseTemperature } = storeToRefs(store)
const minTemp = ref(
  d3.min(dataset.value, (d) => parseFloat((d.variance + baseTemperature.value).toFixed(2)))
)
const maxTemp = ref(
  d3.max(dataset.value, (d) => parseFloat((d.variance + baseTemperature.value).toFixed(2)))
)

//METHODS
async function showTooltip(data: MonthlyVariance, event: MouseEvent) {
  selectedDataPoint.value = data

  tooltipRef.value!.style.top = `${event.clientY}px`
  tooltipRef.value!.style.left = `${event.clientX}px`
}

function getMonthName(month: number) {
  return monthNames[month - 1]
}

// COMPUTED PROPS
const x = computed(() => {
  return d3
    .scaleLinear()
    .domain([minMaxYears.value[0], minMaxYears.value[1] + 1] as [number, number])
    .range([0, width])
})

// tried with linear band, but it looks better
const y = computed(() => {
  return d3
    .scaleBand()
    .domain(monthNames as string[])
    .range([0, height])
})

const color = computed(() => {
  return d3.scaleQuantile(
    //d3.extent(dataset.value, (d) => parseFloat((d.variance + baseTemperature.value).toFixed(2))),
    [minTemp.value, maxTemp.value],
    [...d3.schemeRdYlBu[10]].reverse()
  )
})

// can't create an axis with scaleQuantile, no better solution yet but to create a new linear scale... :/
// TODO: probably there is a better solution will check back later
const colorScale = computed(() => {
  return d3
    .scaleLinear(
      [d3.min(color.value.quantiles()), d3.max(color.value.quantiles())! + 2] as [number, number],
      [0, legendWidth]
    )
    .nice()
})

// LIFECYCLE HOOKS
onMounted(async () => {
  watchEffect(() => {
    if (!axisLeftRef.value) return

    d3.select(axisLeftRef.value).call(d3.axisLeft(y.value))
  })
  watchEffect(() => {
    if (!axisBottomRef.value) return
    d3.select(axisBottomRef.value).call(d3.axisBottom(x.value).tickFormat(d3.format('d')))
  })

  watchEffect(() => {
    if (!axisColorRef.value) return
    d3.select(axisColorRef.value).call(
      d3
        .axisBottom(colorScale.value)
        .tickValues(color.value.quantiles())
        .tickFormat(d3.format('.1f'))
    )
  })
})
</script>

<template>
  <div class="chart-container relative w-full" v-if="dataset.length > 0">
    <div
      ref="tooltipRef"
      id="tooltip"
      v-show="selectedDataPoint"
      class="fixed flex -translate-x-1/2 -translate-y-[120%] flex-col items-center justify-center rounded-md bg-slate-800 px-4 py-2 text-center text-sm font-semibold text-white opacity-90 shadow-lg"
      :data-year="selectedDataPoint?.year"
    >
      <template v-if="selectedDataPoint">
        <div>
          {{ selectedDataPoint.year }} -
          {{ getMonthName(selectedDataPoint.month) }}
        </div>
        <div>{{ (baseTemperature + selectedDataPoint.variance).toFixed(1) }}℃</div>
        <div>{{ selectedDataPoint.variance.toFixed(1) }}℃</div>
      </template>
    </div>
    <svg
      :viewBox="`0,0,${width + marginLeft + marginRight},${height + marginTop + marginBottom}`"
      class="border-2 border-dashed border-green-500 bg-slate-100"
    >
      <g :transform="`translate(${marginLeft}, ${marginTop})`">
        <g id="y-axis" ref="axisLeftRef" />
        <g id="x-axis" ref="axisBottomRef" :transform="`translate(0, ${height})`" />
        <g stroke-width="0">
          <rect
            class="cell stroke-black hover:stroke-black hover:stroke-2"
            v-for="(d, i) in dataset"
            :key="i"
            :x="x(d.year)"
            :y="y(monthNames[d.month - 1])"
            :width="width / (minMaxYears[1] - minMaxYears[0])"
            :height="Math.round(height / 12)"
            :fill="color(d.variance + baseTemperature)"
            :data-year="d.year"
            :data-month="d.month - 1"
            :data-temp="d.variance"
            @mouseenter="showTooltip(d, $event)"
            @mouseleave="selectedDataPoint = null"
          />
          <g id="legend" :transform="`translate(0, ${height + 70})`" stroke-width="1">
            <!-- TODO: width should be calculated based on width / arr.length but its incorrect when I do that -->
            <rect
              v-for="(c, i) in color.quantiles()"
              :key="i"
              :x="colorScale(c)"
              y="-14"
              height="14"
              width="28"
              :fill="color(c)"
              stroke="black"
            />
            <g ref="axisColorRef" />
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped></style>
