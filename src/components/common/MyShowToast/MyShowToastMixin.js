//Myshowtoast的通用配置
const MyShowToastMixin = {
    data() {
        return {
            content: "确定不再关注TA了吗？",
            conform: "不关注",
            cancel: "继续关注",
            cancelUid: 0//取消关注的ID
        }
    },
    onShow() {
        //取消关注
        this.$bus.$on("myShowToast", (uid) => {
            this.cancelUid = uid;
            console.log(uid)
            this.$refs.myShowToast.open("center");
        });
    },
    onHide() {
        this.$bus.$off("myShowToast");
    },
    methods: {
      //确定
    conformBandle(){
        this.$store.dispatch("Followee/delFollowee", this.cancelUid);
        this.$refs.myShowToast.close();
      },
      //取消
      cancelBandle(){
        this.$refs.myShowToast.close();
      },
    }
}

export default MyShowToastMixin;
