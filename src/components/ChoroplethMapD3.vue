<script setup lang="ts">
import { useChoroplethMapStore } from '@/stores/choroplethMapStore'
import { storeToRefs } from 'pinia'
import * as d3 from 'd3'
import { onMounted, ref } from 'vue'
import * as topojson from 'topojson-client'
import type { EducationData } from '@/typings'

type CountyData = {
  feature: typeof topojson.feature
  education: EducationData
}

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

const selectedDataPoint = ref<CountyData | null>(null)
const tooltipRef = ref<HTMLDivElement>()

// STORE
const store = useChoroplethMapStore()
const { datasetCounties, datasetEdu } = storeToRefs(store)

onMounted(() => {
  if (!datasetCounties.value || !datasetEdu.value) return

  const countyData = topojson
    .feature(datasetCounties.value, datasetCounties.value.objects.counties)
    .features.map((feature) => {
      const education = datasetEdu.value!.find((data) => data.fips === feature.id)!
      return {
        feature,
        education
      } as unknown as CountyData
    })

  const projection = d3
    .geoIdentity()
    .fitSize(
      [width, height],
      topojson.feature(datasetCounties.value!, datasetCounties.value!.objects.counties)
    )
  const pathGenerator = d3.geoPath().projection(projection)

  // color scale for label and fill colors
  const [minEducation, maxEducation] = d3.extent(
    datasetEdu.value!.map((d) => d.bachelorsOrHigher)
  ) as [number, number]
  const colorScale = d3.scaleQuantile([minEducation, maxEducation], d3.schemeYlGn[9])

  // x scale for label
  const x = d3
    .scaleLinear()
    .domain([-1, colorScale.range().length - 1])
    .rangeRound([labelMarginLeft, labelWidth - labelMarginRight])

  // MAP
  const counties = d3.select('#counties')
  counties
    .selectAll('path')
    .data(countyData)
    .join('path')
    .attr('class', 'county')
    .attr('data-fips', (countyData: CountyData) => countyData.education.fips)
    .attr('data-education', (countyData: CountyData) => countyData.education.bachelorsOrHigher)
    .attr('d', (countyData: CountyData) =>
      pathGenerator(countyData.feature as unknown as d3.GeoGeometryObjects)
    )
    .attr('fill', (countyData: CountyData) => colorScale(countyData.education.bachelorsOrHigher))
    .on('mouseover', (event: MouseEvent, data: CountyData) => {
      tooltipRef.value!.style.top = `${event.clientY - 50}px`
      tooltipRef.value!.style.left = `${event.clientX}px`
      selectedDataPoint.value = data
    })
    .on('mouseout', () => {
      selectedDataPoint.value = null
    })
    .on('mousemove', (event: MouseEvent) => {
      tooltipRef.value!.style.top = `${event.clientY - 50}px`
      tooltipRef.value!.style.left = `${event.clientX}px`
    })

  // STATE BORDERS
  d3.select('svg')
    .append('path')
    .datum(
      topojson.mesh(datasetCounties.value, datasetCounties.value.objects.states, (a, b) => a !== b)
    )
    .attr('d', (d) => pathGenerator(d))
    .attr('transform', `translate(0,${margin})`)
    .attr('fill', 'none')
    .attr('stroke', 'darkgreen')

  // LEGEND
  const thresholds = colorScale.quantiles()
  const thresholdFormat = d3.format('.1f')
  const ticks = labelWidth / 64
  const tickValues = d3.range(thresholds.length)
  const tickFormat = (_domain: d3.NumberValue, i: number) => thresholdFormat(thresholds[i]) + '%'
  const tickAdjust = (g: d3.Selection<SVGGElement, unknown, HTMLElement, any>) =>
    g.selectAll('.tick line').attr('y1', labelMarginTop + labelMarginBottom - labelHeight)

  d3.select('#legend')
    .append('g')
    .selectAll('rect')
    .data(colorScale.range())
    .join('rect')
    .attr('x', (d, i) => x(i - 1))
    .attr('y', labelMarginTop)
    .attr('width', (d, i) => x(i) - x(i - 1))
    .attr('height', labelHeight - labelMarginTop - labelMarginBottom)
    .attr('fill', (d) => d)

  d3.select('#legend')
    .append('g')
    .attr('transform', `translate(0,${labelHeight - labelMarginBottom})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(ticks, tickFormat)
        .tickFormat(tickFormat)
        .tickSize(6)
        .tickValues(tickValues)
    )
    .call(tickAdjust)
    .call((g) => g.select('.domain').remove())
})
</script>

<template>
  <div class="chart-container relative" v-if="datasetCounties && datasetEdu!.length > 0">
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
      :width="width + margin * 2"
      :height="height + margin * 2"
      :view-box="[0, 0, width, height]"
      class="border-2 border-dashed border-green-500 bg-slate-100"
    >
      <g id="counties" :transform="`translate(0, ${margin})`" />
      <g id="legend" :transform="`translate(700, ${10})`" />
    </svg>
  </div>
</template>

<style scoped></style>
