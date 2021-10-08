<template>
  <view class="usersign">
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
      <view slot="center">个性签名</view>
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
          placeholder="请输入个性签名"
          maxlength="16"
          v-on:keyup="content()"
          v-on:compositionstart="importStart()"
          v-on:compositionend="importEnd()"
          v-model="payload.content"
        />
        <view class="line"></view>
        <view class="rule">
          <text>{{ conterNum }}/16</text>
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
    this.payload.content = e.motto;
    this.conterNum = e.motto.length;
  },
  data() {
    return {
      payload: {
        content: "",
      },
      conterNum: 0,
      cInput: false,
    };
  },
  components: {
    NavigatorBar,
  },
  methods: {
    //返回按钮
    goBack() {
      console.log("fanghui");
      uni.navigateBack({
        delta: 1,
      });
    },
    content() {
      let self = this;
      if (self.cInput == false) {
        self.conterNum = self.payload.content.length;
      }
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
            nickname: null,
            motto: this.payload.content,
          };
          postUserUpdate(data).then(
            (res) => {
              //修改信息
              this.$bus.$emit(CHANGEUSERMES);
              uni.showToast({
                title: "修改成功",
                duration: 2000,
                icon: "none",
                success:()=>{
                  uni.navigateBack({
                    delta: 1,
                  });
                }
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
.usersign {
  font-family: Microsoft YaHei;
  padding-top: 80px;
}
.release-complete {
  position: relative;
  top: -20rpx;
  left: 642rpx;
  color: #ee9a49;
  font-size: 34rpx;
}
.back-ground {
  background-color: #fdf7ef;
  width: 100%;
  height: 100vh;
  margin-top: 0rpx;
}
.entire {
  position: relative;
  top: 54rpx;
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
