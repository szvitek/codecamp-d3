<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
</script>

<template>
  <NavBar />
  <main class="min-h-[calc(100vh-4rem)]">
    <div class="max-w-[1200px] mx-auto">
      <RouterView />
    </div>
  </main>
</template>

<style scoped></style>
