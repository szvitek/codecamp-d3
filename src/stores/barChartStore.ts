import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'

type Dataset = [string, number][]

const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

// dummy placeholder store
export const useBarChartStore = defineStore('barChart', () => {
  const title = ref('United States GDP')
  const dataset = ref<Dataset>([])

  async function fetchData() {
    try {
      const { data } = await axios.get(url)
      dataset.value = data.data
    } catch (e) {
      console.log(e)
    }
  }

  return { title, dataset, fetchData }
})
