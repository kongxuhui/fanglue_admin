import Cookies from 'js-cookie';

const user = {
    state: {
        userInfo: {},
    },
    mutations: {
        logout(state) {
            Cookies.remove('userInfo');
            state.userInfo = {};
        },
        login(state, userInfo) {
            state.userInfo = userInfo;         
        }
    }
};

export default user;