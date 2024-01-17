<script setup lang="ts">
import DefaultLayout from '@/components/DefaultLayout.vue'
import { RouterLink } from 'vue-router'

const images = [
  { id: 'bar-chart', src: '/images/bar-chart.png', title: 'Bar Chart', to: '/bar-chart' },
  {
    id: 'scatterplot',
    src: '/images/scatterplot.png',
    title: 'Scatterplot Graph',
    to: '/scatter-plot'
  },
  { id: 'heatmap', src: '/images/heatmap.png', title: 'Heat Map', to: '/heat-map' },
  {
    id: 'choropleth',
    src: '/images/choropleth.png',
    title: 'Choropleth Map',
    to: '/choropleth-map'
  },
  { id: 'treemap', src: '/images/treemap.png', title: 'Treemap Diagram', to: '/tree-map' }
]
</script>

<template>
  <DefaultLayout title="D3 Data Visualization Projects">
    <div class="p-8">
      <div class="grid grid-cols-1 gap-8 text-center md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="image in images"
          :key="image.id"
          class="border border-green-800 text-green-500 hover:text-green-800 hover:shadow-xl hover:shadow-green-800"
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
