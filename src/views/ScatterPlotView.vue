<script setup lang="ts">
import DefaultLayout from '@/components/DefaultLayout.vue'
import ChartTitle from '@/components/ChartTitle.vue'
import ScatterPlot from '@/components/ScatterPlot.vue'
</script>

<template>
  <DefaultLayout title="Visualize Data with a Scatterplot Graph">
    <ChartTitle
      title="Doping in Professional Bicycle Racing"
      subtitle="35 Fastest times up Alpe d'Huez"
    />
    <ScatterPlot />
  </DefaultLayout>
</template>
