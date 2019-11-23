import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './router.js'
// for async/await
import babelPolyfill from 'babel-polyfill'
// firebase
import '../node_modules/firebaseui/dist/firebaseui.js'
import '../node_modules/firebaseui/dist/firebaseui.css'
import VueFirestore from "vue-firestore";
// lib
import VueApexCharts from 'vue-apexcharts'
import VueMoment from 'vue-moment';
// UI lib
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret, faTimes, faUser, faCheckCircle, faUserCircle, faChartPie } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
// components
import App from './App.vue'

library.add(faUserSecret, faTimes, faUser, faCheckCircle, faUserCircle, faChartPie)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

Vue.use(babelPolyfill)
Vue.use(VueFirestore)
Vue.use(VueRouter)
Vue.use(VueApexCharts)
Vue.use(VueMaterial)
Vue.use(BootstrapVue)
Vue.use(VueMoment)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
