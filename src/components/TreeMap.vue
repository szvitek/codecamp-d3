<script setup lang="ts">
import { useTreeMapStore } from '@/stores/treemapStore'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import * as d3 from 'd3'
import type { TreemapDataset } from '@/typings'

// #CONSTS
const width = 900
const height = 460
const marginTop = 40
const marginBottom = 140
const marginLeft = 80
const marginRight = 80

// #DATA (refs)
const store = useTreeMapStore()
const { dataset } = storeToRefs(store)
const selectedNode = ref<d3.HierarchyRectangularNode<TreemapDataset> | null>(null)
const tooltipRef = ref<HTMLDivElement>()
const legendCols = ref(6)

// #COMPUTED PROPS
const color = computed(() => {
  return d3.scaleOrdinal(
    dataset.value!.children.map((d) => d.name),
    d3.schemeTableau10
  )
})

const hierarchy = computed(() => {
  const hierarchy = d3.hierarchy(dataset.value!)

  hierarchy.sum((d) => d.value).sort((a, b) => b.value! - a.value!)
  return hierarchy
})

const root = computed(() => {
  return d3.treemap<TreemapDataset>().size([width, height]).padding(1)(hierarchy.value)
})

const legendRows = computed(() => {
  return chunk(color.value.domain(), legendCols.value)
})

// #METHODS
// calculate legend rows/cols
function chunk<I>(array: I[], size: number): I[][] {
  if (!array.length) {
    return []
  }
  const head = array.slice(0, size)
  const tail = array.slice(size)

  return [head, ...chunk(tail, size)]
}

function getColor(tile: d3.HierarchyRectangularNode<TreemapDataset>) {
  while (tile.depth > 1) tile = tile.parent!

  return color.value(tile.data.name)
}

function getTileTextArray(tile: d3.HierarchyRectangularNode<TreemapDataset>) {
  const format = d3.format(',d')
  return tile.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(tile.value!))
}

async function showTooltip(tile: d3.HierarchyRectangularNode<TreemapDataset>, event: MouseEvent) {
  selectedNode.value = tile
  tooltipRef.value!.style.top = `${event.clientY}px`
  tooltipRef.value!.style.left = `${event.clientX + 10}px`
}

async function moveTooltip(event: MouseEvent) {
  tooltipRef.value!.style.top = `${event.clientY}px`
  tooltipRef.value!.style.left = `${event.clientX + 10}px`
}
</script>

<template>
  <div class="chart-container relative">
    <div
      ref="tooltipRef"
      id="tooltip"
      v-show="selectedNode"
      class="fixed flex -translate-y-1/2 flex-col items-center justify-center rounded-md bg-yellow-400 px-4 py-2 text-center text-sm font-semibold text-slate-800 opacity-90 shadow-lg"
      :data-value="selectedNode?.value"
    >
      <template v-if="selectedNode">
        <div>Name: {{ selectedNode.data.name }}</div>
        <div>Category: {{ selectedNode.data.category }}</div>
        <div>Value: {{ selectedNode.value }}</div>
      </template>
    </div>
    <svg
      :width="width + marginLeft + marginRight"
      :height="height + marginTop + marginBottom"
      class="border-2 border-dashed border-green-500 bg-slate-100"
    >
      <g :transform="`translate(${marginLeft}, ${marginTop})`">
        <g
          v-for="(leaf, idx) in root.leaves()"
          :key="leaf.id"
          :transform="`translate(${leaf.x0}, ${leaf.y0})`"
        >
          <rect
            :id="`leaf${idx}`"
            class="tile"
            :data-name="leaf.data.name"
            :data-category="leaf.data.category"
            :data-value="leaf.data.value"
            :width="leaf.x1 - leaf.x0"
            :height="leaf.y1 - leaf.y0"
            :fill="getColor(leaf)"
            @mouseenter="showTooltip(leaf, $event)"
            @mouseleave="selectedNode = null"
            @mousemove="moveTooltip"
          />
          <clipPath :id="`clip${idx}`">
            <rect :width="leaf.x1 - leaf.x0" :height="leaf.y1 - leaf.y0" />
          </clipPath>
          <text :clip-path="`url(#clip${idx})`" class="font-sans text-[10px]">
            <template
              v-for="(titleTexts, ti) in [getTileTextArray(leaf)]"
              :key="`titleTexts-${ti}`"
            >
              <tspan
                v-for="(txt, i) in titleTexts"
                :key="`tspan-${i}`"
                x="3"
                :y="`${Number(i === titleTexts.length - 1) * 0.3 + 1.1 + i * 0.9}em`"
                :fill-opacity="`${i === titleTexts.length - 1 ? 0.7 : null}`"
              >
                {{ txt }}
              </tspan>
            </template>
          </text>
        </g>
      </g>
      <g id="legend" :transform="`translate(${marginLeft + 20}, ${marginTop + height + 30})`">
        <template v-for="(legendRow, i) in legendRows" :key="`legend-row-${i}`">
          <g
            v-for="(legendItem, j) in legendRow"
            :key="`legend-item-${j}`"
            :transform="`translate(${j * 150}, ${25 * i})`"
          >
            <rect width="15" height="15" class="legend-item" :fill="color(legendItem) as string" />
            <text x="18" y="13">{{ legendItem }}</text>
          </g>
        </template>
      </g>
    </svg>
  </div>
</template>

<style scoped></style>
