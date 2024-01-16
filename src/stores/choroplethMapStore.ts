import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import type { EducationDataset, CountiesDataSet } from '@/typings'

const urlEdu =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
const urlCounties =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

export const useChoroplethMapStore = defineStore('choroplethMap', () => {
  const title = ref('United States Educational Attainment')
  const description = ref(
    "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
  )

  const datasetEdu = ref<EducationDataset>()
  const datasetCounties = ref<CountiesDataSet>()

  async function fetchData() {
    try {
      const eduReq = axios.get<EducationDataset>(urlEdu)
      const countiesReq = axios.get<CountiesDataSet>(urlCounties)
      const [{ data: dataEdu }, { data: dataCounties }] = await Promise.all([eduReq, countiesReq])

      datasetEdu.value = dataEdu
      datasetCounties.value = dataCounties
    } catch (e) {
      console.log(e)
    }
  }

  return { title, description, datasetEdu, datasetCounties, fetchData }
})
