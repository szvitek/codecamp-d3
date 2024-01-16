<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar />
  <main class="min-h-[calc(100vh-4rem)]">
    <div class="mx-auto min-h-[inherit] max-w-[1400px]">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Transition mode="out-in">
            <KeepAlive>
              <Suspense timeout="0">
                <template #fallback>
                  <div class="flex min-h-[inherit] items-center justify-center">
                    <span class="animate-ping text-4xl font-bold uppercase text-green-500">
                      Loading Data...
                    </span>
                  </div>
                </template>
                <template #default>
                  <component :is="Component" />
                </template>
              </Suspense>
            </KeepAlive>
          </Transition>
        </template>
      </RouterView>
    </div>
  </main>
</template>

<style scoped></style>
