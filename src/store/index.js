import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user';

import Cookies from 'js-cookie'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        //
    },
    mutations: {
        //
    },
    actions: {

    },
    modules: {
        user
    }
});

let userInfo = Cookies.getJSON('userInfo') || {};
if (userInfo.userId) {
    store.commit('login',userInfo);
}

export default store;
