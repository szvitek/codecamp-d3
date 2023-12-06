<template>
  <div class="p-8">
    <h1 class="mb-4 text-4xl font-bold text-green-500">{{ title }}</h1>
  </div>
  <div class="page">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<style scoped></style>
