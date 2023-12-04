<script setup lang="ts">
import { useCounterStore } from '@/stores/counterStore'
import { storeToRefs } from 'pinia'

// access the `store` variable anywhere in the component ✨
const store = useCounterStore()

const { name, doubleCount } = storeToRefs(store)
// the increment action can just be destructured
const { increment } = store
</script>

<template>
  <div class="p-8">
    <h1 class="mb-4 text-4xl font-bold text-green-500">Project Page placeholder</h1>
    <div>
      <div>Name: {{ name }}</div>
      <div>Double Count: {{ doubleCount }}</div>
      <button
        @click="increment"
        class="rounded bg-green-500 px-3 py-2 text-white transition-colors duration-200 hover:bg-green-400"
      >
        increment
      </button>
    </div>
  </div>
</template>

<style></style>
