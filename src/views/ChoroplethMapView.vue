<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import ChartTitle from '@/components/ChartTitle.vue'
import DefaultLayout from '@/components/DefaultLayout.vue'
import { useChoroplethMapStore } from '@/stores/choroplethMapStore'
import ChoroplethMap from '@/components/ChoroplethMap.vue'

const store = useChoroplethMapStore()
const { title: chartTitle, description, isLoading } = storeToRefs(store)

onMounted(async () => {
  await store.fetchData()
})
</script>

<template>
  <DefaultLayout title="Visualize Data with a Choropleth Map" :isLoading="isLoading">
    <ChartTitle :title="chartTitle" :description="description" />
    <ChoroplethMap />
  </DefaultLayout>
</template>
