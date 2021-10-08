//登陆提示的通用配置
const LoginNoticeMixin = {
    data() {
        return {
            loginContent: "你还没有登陆现在去登陆吗？",
            loginConform: "马上登陆",
            loginCancel: "先逛逛",
        }
    },
    onShow() {
        //取消关注
        this.$bus.$on("loginNotice", (uid) => {
            this.$refs.loginNotice.open("center");
        });
    },
    onHide() {
        this.$bus.$off("loginNotice");
    },
    methods: {
        //确定
        loginConformBandle() {
            this.$refs.loginNotice.close();
            uni.reLaunch({
                url: "/src/pages/level1/login/login",
                success() {
                    console.log("跳转成功");
                },
                fail(data) {
                    console.log("跳转失败", data);
                },
            });
        },
        //取消
        loginCancelBandle() {
            this.$refs.loginNotice.close();
        },
    }
}

export default LoginNoticeMixin;
