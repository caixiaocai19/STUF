//删除的通用配置
const DeleteConformMixin = {
    data() {
        return {
            deleteContent: "确定删除该帖子吗？",
            deleteConform: "删除",
            deleteCancel: "先留着",
            localPostId:0
        }
    },
    onShow() {
        //删除
        this.$bus.$on("deletePost", (articleId) => {
            this.localPostId = articleId;
            this.$refs.deletePost.open("center");
        });
    },
    onHide() {
        this.$bus.$off("deletePost");
    },
    methods: {
        //确定
        deleteConformBandle() {
            this.$bus.$emit("deleteLocalPost",this.localPostId);
            this.$refs.deletePost.close();
        },
        //取消
        deleteCancelBandle() {
            this.$refs.deletePost.close();
        },
    }
}

export default DeleteConformMixin;
