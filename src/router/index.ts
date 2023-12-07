import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BarChartView from '@/views/BarChartView.vue'
import ScatterPlotView from '@/views/ScatterPlotView.vue'
import ProjectView from '@/views/ProjectView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/bar-chart',
      name: 'bar-chart',
      component: BarChartView
    },
    {
      path: '/scatter-plot',
      name: 'scatter-plot',
      component: ScatterPlotView
    },
    {
      path: '/project3',
      name: 'project3',
      component: ProjectView
    },
    {
      path: '/project4',
      name: 'project4',
      component: ProjectView
    },
    {
      path: '/project5',
      name: 'project5',
      component: ProjectView
    },
    {
      path: '/*',
      component: HomeView
    }
  ]
})

export default router
