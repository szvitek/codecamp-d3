import type { TreemapDataset } from '@/typings'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import axios from 'axios'

const urls = [
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json',
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json',
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
]

export const useTreeMapStore = defineStore('treeMap', () => {
  const isLoading = ref(false)
  const selectedDataSet = ref<keyof typeof datasets>()
  const datasets = reactive({
    videogame: {},
    movie: {},
    kickstarter: {}
  })

  const infos = reactive({
    videogame: {
      title: 'Video Game Sales',
      description: 'Top 100 Most Sold Video Games Grouped by Platform'
    },
    movie: {
      title: 'Movie Sales',
      description: 'Top 100 Highest Grossing Movies Grouped By Genre'
    },
    kickstarter: {
      title: 'Kickstarter Pledges',
      description: 'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category'
    }
  })

  const dataset = computed(() => {
    if (!selectedDataSet.value) return
    return datasets[selectedDataSet.value]
  })

  const info = computed(() => {
    if (!selectedDataSet.value) return

    return infos[selectedDataSet.value]
  })

  async function fetchData() {
    try {
      isLoading.value = true
      const [{ data: dataKickstarter }, { data: dataMovie }, { data: dataVideogame }] =
        await Promise.all(urls.map((url) => axios.get<TreemapDataset>(url)))

      datasets.videogame = dataVideogame
      datasets.movie = dataMovie
      datasets.kickstarter = dataKickstarter

      selectedDataSet.value = 'videogame'
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, dataset, info, selectedDataSet, fetchData }
})
