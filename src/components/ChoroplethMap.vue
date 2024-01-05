<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useChoroplethMapStore } from '@/stores/choroplethMapStore'
import { computed, onMounted, ref, watchEffect } from 'vue'
import * as topojson from 'topojson-client'
import * as d3 from 'd3'
import type { EducationData } from '@/typings'

// this componnent loads slowly because it has to draw 3142 paths in the svg
// did not find quicker solution yet...

// svg props
const width = 1200
const height = 600
const margin = 25

// lebel props
const labelMarginTop = 18
const labelMarginBottom = 22
const labelMarginLeft = 0
const labelMarginRight = 0
const labelWidth = 320
const labelHeight = 50

type CountyData = {
  feature: typeof topojson.feature
  education: EducationData
}

const selectedDataPoint = ref<CountyData | null>(null)
const statesPath = ref<string>()
const legendAxisBottomRef = ref<SVGGElement>()
const tooltipRef = ref<HTMLDivElement>()

// STORE
const store = useChoroplethMapStore()
const { datasetCounties, datasetEdu } = storeToRefs(store)

//METHODS
async function showTooltip(county: CountyData, event: MouseEvent) {
  selectedDataPoint.value = county
  tooltipRef.value!.style.top = `${event.clientY - 50}px`
  tooltipRef.value!.style.left = `${event.clientX}px`
}

async function moveTooltip(event: MouseEvent) {
  tooltipRef.value!.style.top = `${event.clientY - 50}px`
  tooltipRef.value!.style.left = `${event.clientX}px`
}

// COMPUTED PROPS
const counties = computed(() => {
  if (!datasetCounties.value) return
  return topojson
    .feature(datasetCounties.value, datasetCounties.value.objects.counties)
    .features.map((feature) => {
      const education = datasetEdu.value?.find((data) => data.fips === feature.id)
      return {
        feature,
        education
      }
    })
})

const projection = computed(() => {
  if (!datasetCounties.value?.objects?.counties) return null

  return d3
    .geoIdentity()
    .fitSize(
      [width, height],
      topojson.feature(datasetCounties.value, datasetCounties.value.objects.counties)
    )
})

const pathGenerator = d3.geoPath().projection(projection.value)

const colorScale = computed(() => {
  const [minEducation, maxEducation] = d3.extent(
    datasetEdu.value!.map((d) => d.bachelorsOrHigher)
  ) as [number, number]
  return d3.scaleQuantile([minEducation, maxEducation], d3.schemeGreens[9])
})

const x = computed(() => {
  return d3
    .scaleLinear()
    .domain([-1, colorScale.value.range().length - 1])
    .rangeRound([labelMarginLeft, labelWidth - labelMarginRight])
})

// LIFECYCLE HOOKS
onMounted(() => {
  // generate state borders
  watchEffect(() => {
    if (!datasetCounties.value) return
    const geoJsonDataStates = topojson.mesh(
      datasetCounties.value!,
      datasetCounties.value!.objects.states,
      (a, b) => a !== b
    )
    statesPath.value = pathGenerator(geoJsonDataStates) as string
  })

  // lebel axis setuup
  watchEffect(() => {
    if (!legendAxisBottomRef.value) return
    let tickAdjust = (g: d3.Selection<SVGGElement, unknown, null, undefined>) =>
      g!.selectAll('.tick line').attr('y1', labelMarginTop + labelMarginBottom - labelHeight)

    const thresholds = colorScale.value.quantiles()
    const thresholdFormat = d3.format('.1f')
    const ticks = labelWidth / 64
    const tickValues = d3.range(thresholds.length)
    const tickFormat = (_domain: d3.NumberValue, i: number) => thresholdFormat(thresholds[i]) + '%'

    d3.select(legendAxisBottomRef.value)
      .call(
        d3
          .axisBottom(x.value)
          .ticks(ticks, tickFormat)
          .tickFormat(tickFormat)
          .tickSize(6)
          .tickValues(tickValues)
      )
      .call(tickAdjust)
      .call((g) => g.select('.domain').remove())
  })
})
</script>

<template>
  <div class="chart-container relative w-full" v-if="datasetCounties && datasetEdu!.length > 0">
    <div
      ref="tooltipRef"
      id="tooltip"
      v-show="selectedDataPoint"
      class="fixed flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-yellow-400 px-4 py-2 text-center text-sm font-semibold text-slate-800 opacity-90 shadow-lg"
      :data-education="selectedDataPoint?.education.bachelorsOrHigher"
    >
      <template v-if="selectedDataPoint">
        <div>
          {{ selectedDataPoint.education.area_name }}, {{ selectedDataPoint.education.state }}:
          {{ selectedDataPoint.education.bachelorsOrHigher }}%
        </div>
      </template>
    </div>
    <svg
      :viewBox="`0 0 ${width + margin * 2} ${height + margin * 2}`"
      class="border-2 border-dashed border-green-500 bg-slate-100"
    >
      <g id="legend" :transform="`translate(700, ${10})`">
        <rect
          v-for="(d, i) in colorScale.range()"
          :key="d"
          :x="x(i - 1)"
          :y="labelMarginTop"
          :width="x(i) - x(i - 1)"
          :height="labelHeight - labelMarginTop - labelMarginBottom"
          :fill="d"
        />
        <g
          ref="legendAxisBottomRef"
          :transform="`translate(0,${labelHeight - labelMarginBottom})`"
        ></g>
      </g>
      <g class="counties" :transform="`translate(0, ${margin})`">
        <path
          v-for="(county, index) in counties"
          :key="index"
          class="county"
          :d="d3.geoPath().projection(projection)(county.feature)!"
          :data-fips="county.education?.fips"
          :data-education="county.education?.bachelorsOrHigher"
          :fill="colorScale(county.education?.bachelorsOrHigher!)"
          @mouseenter="showTooltip(county as unknown as CountyData, $event)"
          @mouseleave="selectedDataPoint = null"
          @mousemove="moveTooltip"
        />
      </g>
      <path
        :transform="`translate(0, ${margin})`"
        fill="none"
        class="stroke-white"
        strokeWidth="1.5"
        :d="statesPath"
      />
    </svg>
  </div>
</template>

<style scoped></style>
