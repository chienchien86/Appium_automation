import Vue from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import router from './router'
import VueMaterial from 'vue-material'
import VueLodash from 'vue-lodash'
import 'vue-material/dist/vue-material.min.css'
// import 'vue-material/dist/theme/default.css'

Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.use(VueLodash)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
