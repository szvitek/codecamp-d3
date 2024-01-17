<template>
  <nav class="flex h-16 items-center justify-end bg-white text-xs shadow md:text-base">
    <RouterLink v-for="({ name, to }, index) in menuItems" :key="index" :to="to" class="-m-1">
      {{ name }}
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import menuItems from '@/menuItems'
</script>

<style scoped>
nav a {
  @apply flex h-full items-center px-5 font-bold text-green-500 transition-colors duration-200 hover:bg-green-400 hover:text-white;
}
.router-link-active {
  @apply bg-green-500 text-white;
}
</style>
