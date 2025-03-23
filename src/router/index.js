import { createRouter, createWebHistory } from 'vue-router'
import FlightList from '@/components/FlightList.vue'
import SeatSelection from '@/components/SeatSelection.vue'

const routes = [
    {
        path: '/',
        name: 'FlightList',
        component: FlightList
    },
    {
        path: '/seats/:airplaneId',
        name: 'SeatSelection',
        component: SeatSelection,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
