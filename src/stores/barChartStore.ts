import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

type Dataset = [string, number][]

const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

// dummy placeholder store
export const useBarChartStore = defineStore('barChart', () => {
  const dataset = ref<Dataset>([])
  const isLoading = ref(false)

  async function fetchData() {
    try {
      isLoading.value = true
      const { data } = await axios.get(url)
      dataset.value = data.data
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  return { dataset, fetchData }
})
