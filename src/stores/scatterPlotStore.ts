import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import type { CyclistData } from '@/typings'

const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

export const useScatterPlotStore = defineStore('scatterPlot', () => {
  const dataset = ref<CyclistData[]>([])
  const isLoading = ref(false)

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

  return { dataset, fetchData }
})
