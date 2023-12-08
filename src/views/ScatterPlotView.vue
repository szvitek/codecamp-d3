<script setup lang="ts">
import DefaultLayout from '@/components/DefaultLayout.vue'
import ChartTitle from '@/components/ChartTitle.vue'
import ScatterPlot from '@/components/ScatterPlot.vue'
import { useScatterPlotStore } from '@/stores/scatterPlotStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const store = useScatterPlotStore()
const { title: chartTitle, description,  isLoading } = storeToRefs(store)

onMounted(async () => {
  await store.fetchData()
})
</script>

<template>
  <DefaultLayout title="Visualize Data with a Scatterplot Graph" :isLoading="isLoading">
    <ChartTitle
      :title="chartTitle"
      :description="description"
    />
    <ScatterPlot />
  </DefaultLayout>
</template>
