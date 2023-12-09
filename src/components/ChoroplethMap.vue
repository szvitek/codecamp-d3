<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useChoroplethMapStore } from '@/stores/choroplethMapStore'

// STORE
const store = useChoroplethMapStore()
const { datasetCounties, datasetEdu } = storeToRefs(store)
</script>

<template>
  <div class="chart-container relative" v-if="datasetCounties && datasetEdu!.length > 0">
    Choroplet Map goes here...
  </div>
</template>

<style scoped></style>
