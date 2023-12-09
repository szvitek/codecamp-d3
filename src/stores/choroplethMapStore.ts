import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import * as d3 from 'd3'
import type { CountiesDataset, EducationDataset } from '@/typings'

const urlEdu =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
const urlCounties =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

export const useChoroplethMapStore = defineStore('choroplethMap', () => {
  const isLoading = ref(false)
  const title = ref('United States Educational Attainment')
  const description = ref(
    "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
  )

  const datasetEdu = ref<EducationDataset>()
  const datasetCounties = ref<CountiesDataset>()

  async function fetchData() {
    try {
      isLoading.value = true
      const eduReq = await axios.get<EducationDataset>(urlEdu)
      const countiesReq = await axios.get<CountiesDataset>(urlCounties)
      const [{ data: dataEdu }, { data: dataCounties }] = await Promise.all([eduReq, countiesReq])

      datasetEdu.value = dataEdu
      datasetCounties.value = dataCounties
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  return { title, description, datasetEdu, datasetCounties, isLoading, fetchData }
})
