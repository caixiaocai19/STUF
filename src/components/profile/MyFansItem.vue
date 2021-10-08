<template>
	<!-- 我所关注的人页面 -->
	<view class="followee">
    <view class="f_floor_item">
    <!-- 关注的人详情开始 -->
      <view class="f_person_detail">
      <view>
        <view class="f_person_pic">
          <img v-bind:src="follows.userInfo.photoPath" mode="widthFix"></img>
        </view></view>
        <view class="f_admin_detail">
          <view class="f_admin_name">{{follows.userInfo.nickname}}</view>
          <view class="f_admin_signature">{{follows.userInfo.motto}}</view>
        </view>
        <view class="f_button" @click.stop="showToggle">
          <view class="g"v-show="!follows.userFollow.follow" >
           <image src="../../../static/icons/profile/followEach.png" mode="heightFix" />
          <text  >互粉</text>
          </view>
          <view class="b" v-show="follows.userFollow.follow">							
          <text >已互粉</text>
          </view>
        </view>
      </view>
    <!-- 关注的人详情结束 -->
    </view>
	</view>
</template>
<script>
export default {
  name: "MyfansItem",
  data() {
    return {
      // myFollows: {},
      // userInfo: {},
    };
  },
  props: ["follows"],
  methods: {
    //关注与取消关注
    showToggle() {
      if (this.follows.userFollow.follow) {
        // //是否确定要取消关注
        // let comfirm = await new Promise((resolve, reject) => {
        //   uni.showModal({
        //     content: "确定取消关注吗？",
        //     success(res) {
        //       resolve(res.confirm);
        //     },
        //     fail(err) {
        //       reject(false);
        //     },
        //   });
        // });
        // //判断是否真的是取消关注了
        // if (comfirm) {
        //   //真正发送请求去取消关注
        //   let followId = this.userInfo.uid;
        //   this.$store.dispatch("Followee/delFollowee", followId);
        //   this.myFollows.follow = !this.myFollows.follow;
        // }
        let followId = this.follows.userInfo.uid;
        this.$bus.$emit("myShowToast", followId);
      } else {
        //后悔点错了 那么就是重新关注
        let followId = this.follows.userInfo.uid;
        this.$store.dispatch("Followee/addFollowee", followId);
        this.$emit("refollow",followId);
        // this.myFollows.follow = !this.myFollows.follow;
      }
    },
  },
  mounted() {
    // this.userInfo = this.follows.userInfo;
    // this.myFollows = this.follows.userFollow;
  },
};
</script>

<style scoped>
.f_floor_item {
  border-bottom: 1px solid #ffefda;
  height: 84px;
}
/* <!-- 个人信息开始 --> */
.followee_floor {
  padding: 18px 16px 18px 16px;
  width: 100%;
}
.f_person_detail {
  padding: 18px 16px 18px 16px;
  height: 48px;
  width: 48px;
  float: left;
  display: flex;
  align-items: center;
}
.f_person_pic {
  flex: 1;
}
.f_person_pic img {
  vertical-align: middle;
  box-sizing: border-box;
  width: 48px;
  height: 48px;
  border: 1px solid #8f8f94;
  border-radius: 80rpx;
}
.f_admin_detail {
  margin-top: 6px;
  margin-left: 14px;
  width: 204px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.f_admin_name {
  /* height: 40rpx; */
  width: 150px;
  line-height: 19px;
  display: inline-block;
  font-size: 14px;
  color: black;
}
.f_admin_signature {
  /* height: 40rpx; */
  line-height: 16px;
  display: inline-block;
  font-size: 12px;
  color: darkgray;
}
.f_button {
  margin-left: 120%;
}
.f_button image {
  height: 26rpx;
  margin-left: 12rpx;
}
.b {
  /* margin-right: 2px; */
  height: 24px;
  width: 60px;
  background-color: #ffd39b;
  border-radius: 15px;
  color: #696969;
  display: flex;
  align-items: center;
  font-size: 12px;
}
.g text {
  padding-left: 6px;
}
.g {
  /* margin-right: 2px; */
  height: 24px;
  width: 60px;
  border: solid 2px #ffd39b;
  border-radius: 15px;
  color: #696969;
  display: flex;
  align-items: center;
  font-size: 12px;
}
.b text {
  padding-left: 12px;
}
</style>
