<!-- 个人信息的头部 -->
<template>
  <view>
    <view class="user_detail">
      <view class="user_pic">
        <image :src="userHead.userInfo.photoPath" mode="" />
      </view>
      <view class="user_name_motto">
        <view class="user_name"
          >{{ userHead.userInfo.nickname || "快去修改你的名字"
          }}<image
            src="../../../static/icons/profile/edit.png"
            mode="heightFix"
        /></view>
        <view class="user_motto">{{
          userHead.userInfo.motto || "快去修改你的签名"
        }}</view>
      </view>
    </view>
    <view class="user_labels">
      <view class="label_list">
        <view class="label_item" v-for="(item, index) in userHead.labels">{{
          item.content
        }}</view>
        <view class="label_item" v-if="userHead.labels.length === 0">
          快去添加标签
        </view>
      </view>
      <view class="label_add" @click.stop="addPersonLabels">
        <image
          src="../../../static/icons/profile/add.png"
          mode="heightFix"
        ></image>
      </view>
    </view>
    <view class="user_lik_flo_floed">
      <view class="user_lik" @click.stop="goToPraise"
        >赞 {{ userHead.userInfo.likeNum }}</view
      >
      <view class="user_flo" @click.stop="goToFollowee">
        关注 {{ userHead.userInfo.followNum }}</view
      >
      <view class="user_floed" @click.stop="goToMyFans">
        被关注 {{ userHead.userInfo.followedNum }}</view
      >
    </view>
  </view>
</template>

<script>
export default {
  props: {
    userHead: {
      type: Object,
      default() {
        return {};
      },
    },
    ItMySelf: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  methods: {
    //判断用户是否已经登陆
    isLogin() {
      return new Promise((resolve, reject) => {
        uni.getStorage({
          key: "userInfo",
          success: (user) => {
            resolve(user);
          },
          fail: () => {
            this.$bus.$emit("loginNotice");
          },
        });
      }).catch((err) => {
        console.log("没登陆玩鬼");
      });
    },
    //点击添加个人标签
    async addPersonLabels() {
      //先获取用户的信息，判断是否登陆了
      let user = await this.isLogin();
      if (!user) {
        return;
      }
      if (this.ItMySelf) {
        uni.navigateTo({
          url:
            "../../level2/profile/profilelabel?labels=" +
            JSON.stringify(this.userHead.labels),
        });
      }
    },
    //点击跳转到点赞的详情
    async goToPraise() {
      //先获取用户的信息，判断是否登陆了
      let user = await this.isLogin();
      if (!user) {
        return;
      }
      if (this.ItMySelf) {
        uni.navigateTo({
          url: "../../level2/profile/praise",
        });
      }
      return;
    },
    //点击跳转到我的关注的详情
    async goToFollowee() {
      //先获取用户的信息，判断是否登陆了
      let user = await this.isLogin();
      if (!user) {
        return;
      }
      if (this.ItMySelf) {
        uni.navigateTo({
          url: "../../level2/profile/followee",
        });
      }
      return;
    },
    //点击跳转到我的粉丝的详情
    async goToMyFans() {
      //先获取用户的信息，判断是否登陆了
      let user = await this.isLogin();
      if (!user) {
        return;
      }
      if (this.ItMySelf) {
        uni.navigateTo({
          url: "../../level2/profile/myfans",
        });
      }
      return;
    },
  },
};
</script>
<style scoped>
/* 个人信息开始 */
.user_detail {
  display: flex;
  align-items: center;
  margin: 81rpx 32rpx 0 32rpx;
}
.user_pic {
}
.user_pic image {
  height: 132rpx;
  width: 132rpx;
  border-radius: 132rpx;
}
.user_name_motto {
  margin-left: 24rpx;
}
.user_name_motto image {
  height: 26rpx;
}
.user_name {
  font-size: 40rpx;
  color: #333333;
}
.user_motto {
  font-size: 28rpx;
  color: #707070;
}
/* 个人信息结束 */
/* 标签信息开始 */
.user_labels {
  display: flex;
  margin: 36rpx 0;
}
.label_list {
  flex: 7;
  display: flex;
}
.label_item {
  background-color: #ffd2a2;
  font-size: 24rpx;
  padding: 0 20rpx;
  border-radius: 24rpx;
  color: aliceblue;
  height: 40rpx;
  line-height: 40rpx;
  margin-left: 34rpx;
}
.label_add {
  flex: 1;
}
.label_add image {
  height: 40rpx;
}
/* 标签信息结束 */
/* 点赞关注等信息展示开始 */
.user_lik_flo_floed {
  display: flex;
  justify-content: center;
  border-top: 1px solid #e4e4e4;
  border-bottom: 12rpx solid #e4e4e4;
  padding: 12rpx 0;
}
.user_lik {
  padding: 0 52rpx;
}
.user_flo {
  padding: 0 52rpx;
  border-left: 4rpx solid #e4e4e4;
  border-right: 4rpx solid #e4e4e4;
}
.user_floed {
  padding: 0 52rpx;
}
/* 点赞关注等信息展示结束 */
</style>