//当前的用户信息
export default {
    namespaced: true,
    state: {
        UserData: {

        }
    },
    mutations: {
        //初始化登陆用户信息
        setUserData(state, payload) {
            state.UserData = payload;
        }
    },
    getters: {

    },
	actions: {
	},
}