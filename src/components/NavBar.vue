<template>
  <nav class="flex h-16 items-center justify-end bg-white shadow">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/bar-chart">Bar Chart</RouterLink>
    <RouterLink to="/project2">Project 2</RouterLink>
    <RouterLink to="/project3">Project 3</RouterLink>
    <RouterLink to="/project4">Project 4</RouterLink>
    <RouterLink to="/project5">Project 5</RouterLink>
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped>
nav a {
  @apply flex h-full items-center px-5 font-bold text-green-500 transition-colors duration-200 hover:bg-green-400 hover:text-white;
}
.router-link-active {
  @apply bg-green-500 text-white;
}
</style>
