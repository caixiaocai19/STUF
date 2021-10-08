//我的关注vuex
import { getUserMes, setNoticeIt, setUnnoticeIt } from "../axios/square/square"
export default {
    namespaced: true,
    state: {
        FolloweeData: []
    },
    mutations: {
        //初始化我的关注数据
        setFolloweeData(state, payload) {
            state.FolloweeData = payload;
        },
        //增加一个我的关注
        addFollowee(state, followee) {
            state.FolloweeData.push(followee);
        },
        //取消一个我的关注
        delFollowee(state, uid) {
            state.FolloweeData = state.FolloweeData.filter(foll => {
                return foll.uid !== uid;
            })
        }
    },
    getters: {
        getFollweeId(state){
            return state.FolloweeData.map(item=>item.uid);
        }
    },
    actions: {
        //增加一个我的关注
        async addFollowee(content, uid) {
			uni.showLoading({
				title:"加载中111",
				mask:true
			})
            try {
                let res = await setNoticeIt({ followId: uid });
                if (res.data.state !== 200) {//关注失败
                    uni.showToast({
                        title: '关注失败',
                        duration: 2000,
                        icon: "none"
                    });
                } else {//关注成功
                    uni.showToast({
                        title: '关注成功',
                        duration: 2000,
                        icon: "none"
                    });
                    getUserMes(uid).then(res => {
                        content.commit("addFollowee", res.data.data)
                    })
                }
            } catch (error) {
                uni.showToast({
                    title: '网络出错 同步失败',
                    duration: 2000,
                    icon: "none"
                });
            }
        },
        //取消一个我的关注
        delFollowee(content, uid) {
            setUnnoticeIt({ followId: uid }).then(res => {
                if (res.data.state !== 200) {//关注失败
                    uni.showToast({
                        title: '取消关注失败',
                        duration: 2000,
                        icon: "none"
                    });
                } else {//关注成功
                    uni.showToast({
                        title: '取消关注成功',
                        duration: 2000,
                        icon: "none"
                    });
                    content.commit("delFollowee", uid);
                }
            }).catch(err => {
                uni.showToast({
                    title: '网络出错 同步失败',
                    duration: 2000,
                    icon: "none"
                });
            })
        }
    },
};
