<script setup lang="ts">
import { useTreeMapStore } from '@/stores/treemapStore'
import { storeToRefs } from 'pinia'

const store = useTreeMapStore()
const { dataset } = storeToRefs(store)
</script>

<template>
  <div>treemap goes here...</div>
  <div>
    <pre>
      {{ dataset }}
    </pre>
  </div>
</template>

<style scoped></style>
