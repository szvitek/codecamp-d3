import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectView from '../views/ProjectView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/project1',
      name: 'project1',
      component: ProjectView
    },
    {
      path: '/project2',
      name: 'project2',
      component: ProjectView
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
