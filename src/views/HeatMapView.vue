<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia';
import ChartTitle from '@/components/ChartTitle.vue'
import DefaultLayout from '@/components/DefaultLayout.vue'
import HeatMap from '@/components/HeatMap.vue'
import { useHeatMapStore } from '@/stores/heatMapStore';

const store = useHeatMapStore()
const { title: chartTitle, baseTemperature, minMaxYears, isLoading } = storeToRefs(store)

onMounted(async () => {
  await store.fetchData()
})
</script>

<template>
  <DefaultLayout title="Visualize Data with a Heat Map" :isLoading="isLoading">
    <ChartTitle
      :title="chartTitle"
      :description="`${minMaxYears[0]} - ${minMaxYears[1]}: base temperature ${baseTemperature}℃`"
    />
    <HeatMap />
  </DefaultLayout>
</template>
