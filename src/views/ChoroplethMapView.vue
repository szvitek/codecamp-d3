<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import ChartTitle from '@/components/ChartTitle.vue'
import DefaultLayout from '@/components/DefaultLayout.vue'
import { useChoroplethMapStore } from '@/stores/choroplethMapStore'
import ChoroplethMap from '@/components/ChoroplethMap.vue'
import ChoroplethMapD3 from '@/components/ChoroplethMapD3.vue'

const store = useChoroplethMapStore()
const { title: chartTitle, description, isLoading } = storeToRefs(store)

const selectedMode = ref<'d3' | 'vue'>('d3')

onMounted(async () => {
  await store.fetchData()
})
</script>

<template>
  <DefaultLayout title="Visualize Data with a Choropleth Map" :isLoading="isLoading">
    <div class="flex w-1/2 items-center justify-evenly text-center">
      <div
        class="cursor-pointer hover:underline"
        :class="[selectedMode === 'd3' ? 'text-green-500' : 'text-slate-400']"
        @click="selectedMode = 'd3'"
      >
        <div>D3 Render</div>
        <div class="text-sm">Map rendered by D3</div>
        <div class="text-xs italic">(faster)</div>
      </div>
      <div
        class="cursor-pointer hover:underline"
        :class="[selectedMode === 'vue' ? 'text-green-500' : 'text-slate-400']"
        @click="selectedMode = 'vue'"
      >
        <div>Vue Render</div>
        <div class="text-sm">Map rendered by Vue</div>
        <div class="text-xs italic">(it works but the performance is poor)</div>
      </div>
    </div>
    <ChartTitle :title="chartTitle" :description="description" />

    <ChoroplethMap v-if="selectedMode === 'vue'" />
    <ChoroplethMapD3 v-else />
  </DefaultLayout>
</template>
