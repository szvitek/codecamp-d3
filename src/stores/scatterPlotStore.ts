import { defineStore } from 'pinia'
import axios from 'axios'
import { computed, ref } from 'vue'
import type { CyclistData } from '@/typings'

const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

export const useScatterPlotStore = defineStore('scatterPlot', () => {
  const title = ref('Doping in Professional Bicycle Racing')
  const dataset = ref<CyclistData[]>([])
  const isLoading = ref(false)
  
  const description = computed(() => `${dataset.value.length} Fastest times up Alpe d'Huez`)

  async function fetchData() {
    try {
      isLoading.value = true
      const { data } = await axios.get(url)
      dataset.value = data
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  return { title, dataset, isLoading, description, fetchData }
})
