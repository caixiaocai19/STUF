<template>
  <view class="modeifypsw">
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
      <view>
        <text class="psw">原密码</text>
        <view class="entire">
          <input
            class="type"
            type="text"
            placeholder="填写原密码"
            maxlength="12"
            v-model="Initpsw"
            @input="cancelInitTips"
          />
          <view class="line"></view>
          <!-- 输入提醒 -->
          <view class="emptyTips">
            <text :class="isInitEmpty ? 'uesr_empty' : 'user_NoEmpty'"
              >请输入正确的原密码</text
            >
          </view>
        </view>
      </view>
      <view class="line-place">
        <text class="psw">新密码</text>
        <view class="entire">
          <input
            class="type"
            type="text"
            placeholder="填写新密码"
            maxlength="12"
            v-model="Newpsw"
            @input="cancelNewTips"
            @tap="initInput"
          />
          <view class="line"></view>
          <!-- 输入提醒 -->
          <view class="emptyTips">
            <text :class="isNewEmpty ? 'uesr_empty' : 'user_NoEmpty'"
              >请按要求输入正确的新密码</text
            >
          </view>
        </view>
      </view>
      <view class="line-place">
        <text class="psw">确认密码</text>
        <view class="entire">
          <input
            class="type"
            type="text"
            placeholder="再次填写确认"
            maxlength="12"
            v-model="Comfirmpsw"
            @blur="comfirmInput"
            @tap="newInput"
          />
          <view class="line"></view>
          <view class="emptyTips">
            <text :class="isConfirmEmpty ? 'uesr_empty' : 'user_NoEmpty'"
              >请确认密码是否一致</text
            >
          </view>
        </view>
      </view>
      <view class="rule">
        <text>密码必须是8-16位的数字、字符组合(不能是纯数字)</text>
      </view>
    </view>
  </view>
</template>

<script>
import NavigatorBar from "../../../components/content/NavigatorBar.vue";
import { postPswUpdate } from "../../../axios/message/message.js";
export default {
  data() {
    return {
      Initpsw: "",
      Newpsw: "",
      Comfirmpsw: "",
      isInitEmpty: false,
      isNewEmpty: false,
      isConfirmEmpty: false,
      itemList: [],
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
    cancelInitTips() {
      var initpsw = this.Initpsw;
      if (initpsw == "") {
        this.isInitEmpty = true;
      } else {
        this.isInitEmpty = false;
      }
    },
    // 下一行点击 原密码提示框的显示判断
    initInput() {
      let Initpsw = this.Initpsw;
      if (Initpsw == "") {
        this.isInitEmpty = true;
      } else {
        this.isInitEmpty = false;
      }
    },
    // 本行 新密码提示框的显示判断
    cancelNewTips() {
      let newpsw = this.Newpsw;
      if (newpsw == "") {
        this.isNewEmpty = true;
      } else {
        this.isNewEmpty = false;
      }
    },
    //判断新输入的密码是否符合要求
    newInput() {
      this.initInput();
      let inputvalue = this.Newpsw;
      //判断新密码是否符合要求
      let str = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(inputvalue);
      // console.log(str);
      if (str) {
        this.isNewEmpty = false;
      } else {
        this.isNewEmpty = true;
      }
    },
    //确认密码
    comfirmInput() {
      var comfirmpsw = this.Comfirmpsw;
      var newpsw = this.Newpsw;
      if (comfirmpsw == "" || comfirmpsw != newpsw) {
        this.isConfirmEmpty = true;
      } else {
        this.isConfirmEmpty = false;
      }
    },
    //页面跳转
    keepToBack() {
      if (this.isNewEmpty || this.Newpsw === "") {
        uni.showToast({
          title: "新密码不符合要求！",
          icon: "none",
        });
      } else if (this.Newpsw !== this.Comfirmpsw) {
        uni.showToast({
          title: "两次输入的密码不一致！",
          icon: "none",
        });
      } else {
        let data = {
          oldPassword: this.Initpsw,
          newPassword: this.Comfirmpsw,
        };
		console.log(this)
        postPswUpdate(data).then(
          (res) => {
            if (res.data.state == 200) {
              uni.showToast({
                title: "密码修改成功",
                icon: "none",
              });
            } else {
              uni.showToast({
                title: "密码修改失败",
                icon: "none",
              });
            }
          },
          (err) => {
            uni.showToast({
              title: "密码修改失败",
              icon: "none",
            });
          }
        );
      }
    },
  },
};
</script>

<style scoped>
.modeifypsw {
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
  top: 10rpx;
  width: 66%;
  left: 26%;
  right: 8%;
}
.line {
  border-bottom: 3rpx solid #e4e4e4;
}
.type {
  font-size: 34rpx;
  margin-bottom: 10rpx;
}
.psw {
  position: relative;
  left: 5%;
  top: 55rpx;
}
.line-place {
  margin-top: 10rpx;
}
.rule {
  width: 100%;
  position: relative;
  left: 5%;
  /* text-align: right; */
  margin-top: 45rpx;
  font-size: 28rpx;
}

.emptyTips {
  height: 0rpx;
  width: 100%;
  /* margin-left: 10%; */
}
.uesr_empty {
  color: #eba284;
  font-size: 24rpx;
  display: flex;
}
.user_NoEmpty {
  color: #eba284;
  font-size: 24rpx;
  display: none;
}
</style>
