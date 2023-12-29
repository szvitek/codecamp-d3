<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import ChartTitle from '@/components/ChartTitle.vue'
import DefaultLayout from '@/components/DefaultLayout.vue'
import { useTreeMapStore } from '@/stores/treemapStore'
import TreeMap from '@/components/TreeMap.vue'

const store = useTreeMapStore()
const { info, selectedDataSet, isLoading } = storeToRefs(store)

onMounted(async () => {
  await store.fetchData()
})
</script>

<template>
  <DefaultLayout
    title="Visualize Data with a Choropleth Map"
    :isLoading="isLoading || !info || !selectedDataSet"
  >
    <div class="flex w-1/2 items-center justify-evenly pb-5 text-center">
      <div
        class="cursor-pointer hover:underline"
        :class="[selectedDataSet === 'videogame' ? 'text-green-500 underline' : 'text-slate-400']"
        @click="selectedDataSet = 'videogame'"
      >
        Video Game Data Set
      </div>
      <div
        class="cursor-pointer hover:underline"
        :class="[selectedDataSet === 'movie' ? 'text-green-500 underline' : 'text-slate-400']"
        @click="selectedDataSet = 'movie'"
      >
        Movies Data Set
      </div>
      <div
        class="cursor-pointer hover:underline"
        :class="[selectedDataSet === 'kickstarter' ? 'text-green-500 underline' : 'text-slate-400']"
        @click="selectedDataSet = 'kickstarter'"
      >
        Kickstarter Data Set
      </div>
    </div>
    <ChartTitle :title="info!.title" :description="info!.description" />
    <TreeMap />
  </DefaultLayout>
</template>
