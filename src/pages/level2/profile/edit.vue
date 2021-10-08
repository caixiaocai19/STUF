<template>
  <view class="edit">
    <!-- 头部导航栏开始 -->
    <navigator-bar>
      <view slot="left">
        <image
          src="../../../../static/icons/square/back.png"
          mode="heightFix"
          style="height: 30rpx"
          @click="goBack"
        />
      </view>
      <view slot="center">我的</view>
    </navigator-bar>
    <!-- 头部导航栏结束 -->
    <view class="back-ground">
      <view class="general" @click="toPageUserhead">
        <text class="list">头像</text>
        <image :src="itemList.photoPath" class="profile-photo"></image>
        <text class="iconfont icon-youjiantou1 you-icon list"></text>
        <view class="line"></view>
      </view>
      <view class="general" @click="toPageUsername">
        <text class="list general-2">昵称</text>
        <view class="profile-name">
          <text class="gray">{{ itemList.nickname }}</text>
          <text class="iconfont icon-youjiantou1 you-icon"></text>
        </view>
        <view class="line line-2"></view>
      </view>
      <view class="general" @click="toPageUsersign">
        <view class="list general-2">
          <text>个性签名</text>
          <text class="iconfont icon-youjiantou1 you-icon you-icon-2"></text>
        </view>
        <view class="line line-3"></view>
      </view>
      <view class="general" @click="toPageModifypsw">
        <view class="list general-2">
          <text>修改密码</text>
          <text class="iconfont icon-youjiantou1 you-icon you-icon-2"></text>
        </view>
        <view class="line line-3"></view>
      </view>
      <view class="cancel_log" @click="cancelLogin">退出登陆</view>
    </view>
  </view>
</template>

<script>
import NavigatorBar from "../../../components/content/NavigatorBar.vue";
import { getUserMes } from "../../../axios/message/message.js";
import { CHANGEUSERMES, CANCELLOGIN } from "../../constant";
export default {
  name: "Edit",
  data() {
    return {
      itemList: [],
      uid: 1,
    };
  },
  components: {
    NavigatorBar,
  },
  methods: {
    //退出登陆
    cancelLogin() {
      let _this = this;
      uni.showLoading({
        title: "注销中",
        mask: true,
        success: () => {
          uni.removeStorage({
            key: "userInfo",
            success: function (res) {
              _this.$bus.$emit(CANCELLOGIN);
              uni.switchTab({
                url: "../../level1/profile/profile",
                success() {
                  uni.hideLoading();
                },
              });
            },
          });
        },
      });
    },
    //返回
    goBack() {
      uni.switchTab({
        url: "../../level1/profile/profile",
      });
    },
    //获取缓存中用户的信息
    getUid() {
      let that = this;
      uni.getStorage({
        key: "userInfo",
        success: function (res) {
          that.getUserMes(res.data.uid);
          that.uid = res.data.uid;
        },
      });
    },
    toPageUserhead() {
      uni.navigateTo({
        url: "../../level3/profile/userhead?head=" + this.itemList.photoPath,
      });
    },
    toPageUsername() {
      uni.navigateTo({
        url: "../../level3/profile/username?name=" + this.itemList.nickname,
      });
    },
    toPageUsersign() {
      uni.navigateTo({
        url: "../../level3/profile/usersign?motto=" + this.itemList.motto,
      });
    },
    toPageModifypsw() {
      uni.navigateTo({
        url: "../../level3/profile/modifypsw",
      });
    },
    //通过请求获取用户的信息
    getUserMes(uid) {
      return getUserMes(uid).then(
        (res) => {
          this.itemList = res.data.data;
          console.log(this.itemList);
        },
        (err) => {
          console.log(err);
        }
      );
    },
  },
  mounted() {
    //页面挂载就要获取用户的信息
    this.getUid();
    //监听是否有个人信息的更改
    this.$bus.$on(CHANGEUSERMES, () => {
      this.getUserMes(this.uid);
      getUserMes(this.uid).then(
        (res) => {
          uni.setStorage({
            key: "userInfo",
            data: res.data.data,
          });
        },
        (err) => {
          console.log(err);
        }
      );
    });
  },
};
</script>

<style scoped>
@import url("../../../../static/icons/iconfont/iconfont.css");
.edit {
  font-family: Microsoft YaHei;
  padding-top: 130rpx;
}
.back-ground {
  width: 100%;
  background-color: #fdf7ef;
  height: calc(100vh - 160rpx);
}
.general {
  position: relative;
  left: 5%;
  width: 95%;
}
.profile-photo {
  margin-top: 20rpx;
  width: 120rpx;
  height: 120rpx;
  margin-left: 65%;
  border-radius: 20rpx;
}
.line {
  border-bottom: 3rpx solid #e4e4e4;
  margin-top: 10rpx;
}
.list {
  position: relative;
  top: -46rpx;
}
.you-icon {
  margin-left: 12rpx;
  color: #707070;
  font-size: 28rpx;
}
.you-icon-2 {
  margin-left: 74%;
}
.profile-name {
  /* background-color: #007AFF; */
  width: 300rpx;
  margin-left: 54%;
  text-align: right;
  margin-top: 6rpx;
}
.gray {
  color: #707070;
}
.general-2 {
  top: 55rpx;
}
.line-2 {
  margin-top: 65rpx;
}
.line-3 {
  margin-top: 115rpx;
}
.cancel_log {
  text-align: center;
  height: 120rpx;
  line-height: 120rpx;
  border-bottom: 10rpx solid #ffff;
  border-top: 10rpx solid #ffff;
}
</style>
