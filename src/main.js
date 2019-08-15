import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
import http from './utils/http'
import './mixins'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype.$http = http;
Vue.prototype.$ossUrl = process.env.NODE_ENV === 'production' ? 'http://192.168.139.202:2222/' : 'http://192.168.139.202:2222/';

new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
});