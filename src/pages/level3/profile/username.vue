<template>
  <view class="username">
    <!-- 头部导航栏开始 -->
    <navigator-bar>
      <view slot="right">
        <image
          src="../../../../static/icons/square/back.png"
          mode="heightFix"
          style="height: 30rpx"
          @click="goBack"
        />
      </view>
      <view slot="center">昵称</view>
      <view slot="left" @click="keepToBack">
        <text style="color: #efbe86; font-size: 32rpx; margin-right: 12rpx"
          >完成</text
        >
      </view>
    </navigator-bar>
    <!-- 头部导航栏结束 -->
    <view class="back-ground">
      <view class="entire">
        <input
          class="type"
          type="text"
          placeholder="请输入用户名"
          maxlength="12"
          v-on:keyup="content()"
          v-on:compositionstart="importStart()"
          v-on:compositionend="importEnd()"
          v-model="payload.content"
        />
        <view class="line"></view>
        <view class="rule">
          <text>{{ conterNum }}/12</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import NavigatorBar from "../../../components/content/NavigatorBar.vue";
import { postUserUpdate } from "../../../axios/message/message.js";
import {CHANGEUSERMES} from "../../constant"
export default {
  onLoad: function (e) {
    this.payload.content = e.name;
    this.conterNum = e.name.length;
  },
  data() {
    return {
      payload: {
        content: "",
      },
      conterNum: 0,
      cInput: false,
      nickname: "",
      motto: "",
    };
  },
  components: {
    NavigatorBar,
  },
  methods: {
    //返回
    goBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
    content() {
      let self = this;
      if (self.cInput == false) {
        self.conterNum = self.payload.content.length;
      }
      return self.payload.content;
    },
    importStart() {
      this.cInput = true;
    },
    importEnd() {
      this.cInput = false;
      this.write();
    },
    //点击完成
    keepToBack() {
      uni.showLoading({
        title: "修改中",
        success: () => {
          let data = {
            nickname: this.payload.content,
            motto: null,
          };
          postUserUpdate(data).then(
            (res) => {
              //修改信息
              this.$bus.$emit(CHANGEUSERMES);
              uni.showToast({
                title: "修改成功",
                duration: 2000,
                icon: "none",
                success: () => {
                  uni.navigateBack({
                    delta: 1,
                  });
                },
              });
            },
            (err) => {
              uni.showToast({
                title: "修改失败",
                duration: 2000,
                icon: "none",
              });
            }
          );
        },
      });
    },
  },
};
</script>

<style scoped>
.username {
  font-family: Microsoft YaHei;
  padding-top: 80px;
}

.back-ground {
  background-color: #fdf7ef;
  width: 100%;
  height: 100vh;
  margin-top: 0rpx;
}
.entire {
  position: relative;
  top: 56rpx;
  width: 84%;
  left: 8%;
  right: 8%;
}
.line {
  border-bottom: 3rpx solid #e4e4e4;
}
.type {
  font-size: 39rpx;
  margin-bottom: 10rpx;
}
.rule {
  width: 100%;
  text-align: right;
  margin-top: 8rpx;
  color: #b0b0b0;
  font-size: 30rpx;
}
</style>
