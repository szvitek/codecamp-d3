<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar />
  <main class="min-h-[calc(100vh-4rem)]">
    <div class="mx-auto max-w-[1400px]">
      <RouterView />
    </div>
  </main>
</template>

<style scoped></style>
