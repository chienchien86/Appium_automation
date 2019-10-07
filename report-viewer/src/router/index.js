import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/MainPage'
import ReportViewerPage from '@/page/ReportViewerPage.vue'
import ControlPage from '@/page/ControlPage.vue'


Vue.use(Router)

export default new Router({
    mode: 'history',
    base: __dirname,
    routes: [
        {
            path: '/',
            name: 'main-page',
            component: MainPage,
            children: [
                {
                    path: '/',
                    name: 'report-view-page',
                    component: ReportViewerPage,
                },
                {
                    path: '/control',
                    name: 'control-page',
                    component: ControlPage,
                }
            ]
        }
    ]
})
