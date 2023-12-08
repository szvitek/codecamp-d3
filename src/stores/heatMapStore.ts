import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import * as d3 from 'd3'
import type { HeatMapDataset, MonthlyVariance } from '@/typings'

const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

export const useHeatMapStore = defineStore('heatMap', () => {
  const isLoading = ref(false)
  const title = ref('Monthly Global Land-Surface Temperature')
  const baseTemperature = ref(0)
  const dataset = ref<MonthlyVariance[]>([])
  const minMaxYears = ref<number[]>([])

  async function fetchData() {
    try {
      isLoading.value = true
      const { data } = await axios.get<HeatMapDataset>(url)
      baseTemperature.value = data.baseTemperature
      dataset.value = data.monthlyVariance
      minMaxYears.value = d3.extent(data.monthlyVariance, (d) => d.year) as [number, number]
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  return { title, baseTemperature, minMaxYears, dataset, isLoading, fetchData }
})
