<template>
  <div class="mb-5">
    <h1 id="title" class="text-center text-3xl font-bold text-green-500">
      {{ title }}
    </h1>
    <h2 v-if="description" id="description" class="text-center text-xl font-bold text-green-400">
      {{ description }}
    </h2>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<style scoped></style>
