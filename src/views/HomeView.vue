<script setup lang="ts">
import DefaultLayout from '@/components/DefaultLayout.vue'
import { RouterLink } from 'vue-router'
import barChartSrc from '@/assets/images/bar-chart.png'
import scatterplotSrc from '@/assets/images/scatterplot.png'
import heatmapSrc from '@/assets/images/heatmap.png'
import choroplethSrc from '@/assets/images/choropleth.png'
import treemapSrc from '@/assets/images/treemap.png'

const images = [
  { id: 'bar-chart', src: barChartSrc, title: 'Bar Chart', to: '/bar-chart' },
  {
    id: 'scatterplot',
    src: scatterplotSrc,
    title: 'Scatterplot Graph',
    to: '/scatter-plot'
  },
  { id: 'heatmap', src: heatmapSrc, title: 'Heat Map', to: '/heat-map' },
  {
    id: 'choropleth',
    src: choroplethSrc,
    title: 'Choropleth Map',
    to: '/choropleth-map'
  },
  { id: 'treemap', src: treemapSrc, title: 'Treemap Diagram', to: '/tree-map' }
]
</script>

<template>
  <DefaultLayout title="D3 Data Visualization Projects">
    <div class="p-8">
      <div class="grid grid-cols-1 gap-8 text-center md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="image in images"
          :key="image.id"
          class="border border-green-500 text-green-400 hover:text-green-500 hover:shadow-xl hover:shadow-green-500"
        >
          <RouterLink :to="image.to">
            <h2 class="mb-4 text-4xl font-bold" text-center>{{ image.title }}</h2>
            <img :src="image.src" :alt="image.title" class="mx-auto w-2/3" />
          </RouterLink>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
