<template>
  <div>
    <div class="p-8">
      <h1 class="mb-4 text-4xl font-bold text-green-500">{{ title }}</h1>
    </div>
    <div class="page">
      <slot v-if="!isLoading" />
      <div v-else class="animate-ping text-4xl font-bold uppercase text-green-500">
        Loading Data...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; isLoading: boolean }>()
</script>

<style scoped></style>
