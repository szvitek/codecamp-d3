<script setup lang="ts">
import BarChart from '@/components/BarChart.vue'
import ChartTitle from '@/components/ChartTitle.vue'
import DefaultLayout from '@/components/DefaultLayout.vue'
import { useBarChartStore } from '@/stores/barChartStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const store = useBarChartStore()
const { title: chartTitle,  isLoading } = storeToRefs(store)

onMounted(async () => {
  await store.fetchData()
})
</script>

<template>
  <DefaultLayout title="Visualize Data with a Bar Chart" :is-loading="isLoading">
    <ChartTitle :title="chartTitle" />
    <BarChart />
  </DefaultLayout>
</template>
