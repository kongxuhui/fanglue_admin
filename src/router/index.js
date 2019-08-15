import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './router'
import Cookies from 'js-cookie'

Vue.use(Router)

const router = new Router({
	mode: 'history',
    base: __dirname,
	routes: routes
})

router.beforeEach((to, from, next) => {
	let userInfo = Cookies.getJSON('userInfo') || {};

	if (userInfo.userId) {
		next();
	} else {
		if (to.name === 'login') {
			next();
		} else {
			next({
				name: 'login'
			});
		}
	}
})
export default router
