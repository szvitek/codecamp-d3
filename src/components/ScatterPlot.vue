<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'
import { useScatterPlotStore } from '@/stores/scatterPlotStore'
import type { CyclistData } from '@/typings'

// CONSTS
const width = 900
const height = 460
const marginTop = 40
const marginBottom = 40
const marginLeft = 80
const marginRight = 80
const parseTime = d3.timeParse('%M:%S')

// REFS
const displayTooltip = ref(false)
const axisLeftRef = ref<SVGGElement>()
const axisBottomRef = ref<SVGGElement>()
const tooltipRef = ref<HTMLDivElement>()
const selectedDataPoint = ref<CyclistData>()

// STORE
const store = useScatterPlotStore()
const { dataset } = storeToRefs(store)

//METHODS
function showTooltip(data: CyclistData) {
  const { Year, Time } = data
  selectedDataPoint.value = data
  displayTooltip.value = true
  tooltipRef.value!.style.left = `${x.value(Year) + 100}px`
  tooltipRef.value!.style.top = `${y.value(parseTime(Time.toString()) as Date)}px`
}

// COMPUTED PROPS
const y = computed(() => {
  return d3
    .scaleLinear()
    .domain(
      d3.extent(dataset.value, (d) => {
        return parseTime(d.Time)
      }) as [Date, Date]
    )
    .range([0, height])
})

const x = computed(() => {
  return d3
    .scaleTime()
    .domain([
      d3.min(dataset.value, (d) => d.Year)! - 1,
      d3.max(dataset.value, (d) => d.Year)! + 1
    ] as [number, number])
    .range([0, width])
})

const colorScale = computed(() => {
  return d3
    .scaleOrdinal()
    .domain(['positive', 'negative'])
    .range(['fill-orange-400', 'fill-lime-400'])
})

// LIFECYCLE HOOKS
onMounted(async () => {
  await store.fetchData()

  watchEffect(() => {
    if (!axisLeftRef.value) return

    // @ts-ignore
    d3.select(axisLeftRef.value).call(
      d3
        .axisLeft(y.value)
        // @ts-ignore according to d3 docs this is perfectly valid but TS throws an error here thats why the TS ignore
        .tickFormat(d3.timeFormat('%M:%S'))
    )
  })
  watchEffect(() => {
    if (!axisBottomRef.value) return
    d3.select(axisBottomRef.value).call(d3.axisBottom(x.value).tickFormat(d3.format('d')))
  })
})
</script>

<template>
  <div class="chart-container relative">
    <div
      ref="tooltipRef"
      id="tooltip"
      v-show="displayTooltip"
      class="absolute flex flex-col items-center justify-center rounded-md px-4 py-2 text-sm text-slate-800 opacity-90 shadow-lg"
      :class="[selectedDataPoint?.Doping ? 'bg-orange-400' : 'bg-green-400']"
      :data-year="selectedDataPoint?.Year"
      :data-xvalue="selectedDataPoint?.Time"
    >
      <template v-if="selectedDataPoint">
        <div class="font-bold">
          {{ selectedDataPoint.Name }} ({{ selectedDataPoint.Nationality }})
        </div>
        <div>
          <span>Year: {{ selectedDataPoint.Year }}</span>
          <span>Time: {{ selectedDataPoint.Time }}</span>
        </div>
        <div v-if="selectedDataPoint.Doping" class="mt-2">
          {{ selectedDataPoint.Doping }}
        </div>
      </template>
    </div>
    <svg
      :width="width + marginLeft + marginRight"
      :height="height + marginTop + marginBottom"
      class="border-2 border-dashed border-green-500 bg-slate-100"
    >
      <g :transform="`translate(${marginLeft}, ${marginTop})`">
        <g id="y-axis" ref="axisLeftRef" />
        <g id="x-axis" ref="axisBottomRef" :transform="`translate(0, ${height})`" />
        <text
          id="y-label"
          transform="rotate(-90)"
          :x="-height / 2"
          y="-70"
          text-anchor="middle"
          dy=".75em"
          color="red"
        >
          Time in Minutes
        </text>
        <g id="legend">
          <g :transform="`translate(${width}, ${height / 2 - 12})`" class="fill-green-600">
            <rect y="-15" x="-20" width="20" height="20" class="fill-green-400" />
            <text x="-40" text-anchor="end" dx="1em" font-size="10">No doping allegations</text>
          </g>
          <g :transform="`translate(${width}, ${height / 2 + 12})`" class="fill-orange-400">
            <rect y="-15" x="-20" width="20" height="20" />
            <text x="-40" text-anchor="end" dx="1em" font-size="10">
              Riders with doping allegations
            </text>
          </g>
        </g>
        <circle
          class="dot stroke-black opacity-80 hover:fill-yellow-300"
          :class="[colorScale(d.Doping ? 'positive' : 'negative')]"
          v-for="(d, i) in dataset"
          :key="i"
          :cx="x(d.Year)"
          :cy="y(parseTime(d.Time.toString()) as Date)"
          r="6"
          :fill="colorScale(d.Doping ? 'positive' : 'negative') as string"
          :data-xvalue="d.Year"
          :data-yvalue="parseTime(d.Time)?.toString()"
          @mouseenter="showTooltip(d)"
          @mouseleave="displayTooltip = false"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
svg g,
svg text {
  @apply text-green-600;
}

#y-label {
  @apply stroke-green-600;
}
</style>
