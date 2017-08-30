// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import vueRouter from "vue-router"
import vueResource from "vue-resource"
import goods from "./components/goods/goods.vue"
import ratings from "./components/ratings/ratings.vue"
import seller from "./components/seller/seller.vue"

Vue.use(vueRouter);
Vue.use(vueResource);
Vue.config.productionTip = false

const routes=[
	{path:"/goods",component:goods},
	{path:"/ratings",component:ratings},
	{path:"/seller",component:seller},
	{path:"/",redirect:"/goods"}
]
const router=new vueRouter({
	routes
})

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
})
