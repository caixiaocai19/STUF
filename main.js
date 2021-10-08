import Vue from 'vue'
import App from './src/App'
import store from './src/store'
import "./src/utils/dateFormat"//格式化日期的全局方法引入
// 注册全局组件
import MescrollBody from "./src/components/common/mescroll-uni/mescroll-body.vue"
import MescrollUni from "./src/components/common/mescroll-uni/mescroll-uni.vue"
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)
Vue.config.productionTip = false

Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	store,
	...App,
	beforeCreate() {
		Vue.prototype.$bus = this;//安装全局事件总线
	}
})
app.$mount()