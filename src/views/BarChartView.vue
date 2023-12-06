<script setup lang="ts">
import BarChart from '@/components/BarChart.vue'
import ChartTitle from '@/components/ChartTitle.vue'
import DefaultLayout from '@/components/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout title="Visualize Data with a Bar Chart">
    <ChartTitle title="United States GDP" />
    <BarChart />
  </DefaultLayout>
</template>
