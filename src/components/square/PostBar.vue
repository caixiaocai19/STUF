<!-- 发布导航栏 -->
<template>
  <view class="post_bar">
    <view class="post_input">
      <input
        type="text"
        class="post_input_text"
        ref="inputContent"
        v-model="content"
        :placeholder="placeholder"
        :focus="isFocus"
      />
    </view>
    <!-- <view class="post_pic" @click="postPic">
			<image src="../../../static/icons/square/postPic.png" mode="widthFix"></image>
		</view> -->
    <view class="post_button" @click="submitReply"> 发布 </view>
  </view>
</template>

<script>
import {
  createFirstComment,
  createSecondComment,
} from "../../axios/square/square";
import {CREATEFIRSTCOMMENT,REPLYPERSON,REPLYFIRSTCOMMENT,REFLASHSECONDCOMMENT} from "../../pages/constant"
export default {
  name: "PostBar",
  data() {
    return {
      content: "",
      placeholder: "输入你的评论...", //输入提示框
      isFocus: false, //是否聚焦
      isFirstCommment: true, //默认是一级评论的回复
      commentId: 1, //被回复评论的id
      replyId: null, //回复者的id
    };
  },
  props: ["articleId"],
  methods: {
    //发布
    submitReply() {
      let { articleId, content } = this;
      let islogin = false;
      let userInfo = null;
      new Promise((resolve, reject) => {
        uni.getStorage({
          key: "userInfo",
          success: (data) => {
            userInfo = data;
            islogin = true;
            resolve(1);
          },
          fail: () => {
            this.$bus.$emit("loginNotice");
          },
        });
      })
        .then((res) => {
          //没有登陆就直接结束
          if (!islogin) {
            return;
          }
          if (!content) {
            uni.showToast({
              title: "内容不能为空！！！！",
              icon: "none",
            });
            return;
          }
          let paramObj = { articleId, content };
          if (this.isFirstCommment) {
            this.createFirstComment(paramObj);
          } else {
            this.replyFirstComment(content);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 发表一级评论
    createFirstComment(paramObj) {
      this.isFirstCommment = true;
      createFirstComment(paramObj).then((res) => {
        let CommentMes={
          content:this.content,
          commentId:res.data.data
        }
        console.log(res)
        //刷新所有一级评论
        this.$emit("submitReply", CommentMes);
        //清空输入框的内容
        this.content = "";
        uni.showToast({
          title: "回复成功",
          icon: "none",
        });
      }),
        (err) => {
          uni.showToast({
            title: "回复失败",
            icon: "none",
          });
        };
    },
    //回复一级评论,产生二级评论
    replyFirstComment(content) {
      let param = { content, commentId: this.commentId, replyId: this.replyId };
      createSecondComment(param).then(
        (res) => {
          if (res.data.state == 404) {
            uni.showToast({
              title: "下拉刷新后试试噢",
              icon: "none",
            });
            return;
          }
          uni.showToast({
            title: "回复成功",
            icon: "none",
          });
          this.$bus.$emit(REFLASHSECONDCOMMENT, param);
        },
        (err) => {
          uni.showToast({
            title: "回复失败",
            icon: "none",
          });
        }
      );
      this.content = "";
      this.placeholder = "输入你的评论...";
      this.isFirstCommment = true;
      this.replyId = null;
    },
  },
  mounted() {
    //发布一级评论
    this.$bus.$on(CREATEFIRSTCOMMENT, () => {
      this.isFirstCommment = true;
      this.placeholder = "输入你的评论..."; //设置提示
      this.$nextTick(function () {
        this.isFocus = true; //获取焦点
      });
    });
    //一级评论的回复，产生二级评论
    this.$bus.$on(REPLYFIRSTCOMMENT, (data) => {
      this.isFirstCommment = false;
      this.commentId = data.commentId;
      this.placeholder = "评论" + data.userName + "的评论"; //设置提示
      this.$nextTick(function () {
        this.isFocus = true; //获取焦点
      });
    });
    //回复二级评论
    this.$bus.$on(REPLYPERSON, (data) => {
      this.isFirstCommment = false;
      this.commentId = data.commentId;
      this.replyId = data.uid;
      this.placeholder = "回复" + data.userName; //设置提示
      this.$nextTick(function () {
        this.isFocus = true; //获取焦点
      });
    });
  },
  //取消监听
  beforeDestroy() {
    this.$bus.$off(REPLYFIRSTCOMMENT);
    this.$bus.$off(CREATEFIRSTCOMMENT);
    this.$bus.$off(REPLYPERSON);
  },
};
</script>

<style scoped>
.post_bar {
  background-color: #ffffff;
  box-shadow: 0px -1px 10px 1px #eef3f2;
  height: 146rpx;
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
}
.post_input {
  margin-left: 28rpx;
  height: 60rpx;
  width: 500rpx;
  background-color: #e7e7e7;
  margin-right: 64rpx;
  border-radius: 60rpx;
}
.post_input_text {
  height: 100%;

  margin-left: 20rpx;
}
.post_pic {
  margin: 0 20rpx;
}
.post_pic image {
  width: 64rpx;
}
.post_button {
  width: 98rpx;
  height: 46rpx;
  background-color: #ffebc2;
  border-radius: 46rpx;
  text-align: center;
  line-height: 46rpx;
}
</style>
