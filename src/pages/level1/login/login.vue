<template>
  <view class="content1">
    <view class="welcome">
      <text class="welcome_text">Welcome to</text>
    </view>
    <view class="BBS">
      <text class="BBS_text">BBS</text>
    </view>

    <view
      :class="isEntrance ? 'loginFirst' : 'loginAfter'"
      :animation="imgsuoxiao"
    >
    </view>
    <view :class="isEntrance ? 'Ahidden' : 'Ashow'" :animation="animationData">
      <!-- 判断是否为第一次登录，整体样式改变 -->
      <view class="inputWrapper">
        <view :class="isEmpty ? 'Eminput' : 'input'">
          <input
            class="Input"
            v-model="username"
            type="text"
            @input="noEmpty"
            placeholder="校园网账号"
          />
        </view>
      </view>
      <view class="emptyTips">
        <!-- 弹出提醒 -->
        <text :class="isEmpty ? 'empty' : 'NoEmpty'">请输入您的校园网账号</text>
      </view>
      <view class="inputWrapper">
        <view class="input">
          <input
            class="Input"
            :type="showPass ? 'text' : 'password'"
            placeholder="请输入密码"
            v-model="password"
            @input="isRight"
          />
          <!-- <input class="Input" type="text" placeholder="请输入密码" v-model="password" /> -->
        </view>
      </view>
      <view class="emptyTips">
        <!-- 弹出提醒 -->
        <text :class="isWrong ? 'empty' : 'NoEmpty'"
          >账号或密码错误，请检查后重新输入</text
        >
      </view>
      <image :src="showPass ? src1 : src2" @tap="showEye" class="eye"></image>
      <view class="forgetpwd" @tap="verify">
        <text class="forget_text">忘记密码？</text>
      </view>
    </view>
    <view :class="isEntrance ? 'btnFirst' : 'btnAfter'">
      <button class="loginbtn" @click="login">登 录</button>
    </view>
  </view>
</template>


<style>
.content1 {
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: flex-end;
}
.welcome {
  width: 280rpx;
  height: 64rpx;
  display: flex;
  /* justify-content: center;
		align-items: flex-end; */
  padding: 0 240rpx;
  margin-top: 140rpx;
}
.BBS {
  width: 132rpx;
  height: 96rpx;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0 304rpx;
  margin-top: 10rpx;
}
.loginFirst {
  height: 694rpx;
  background-image: url("../../../UI/Login.png");
  background-position: center;
  background-repeat: no-repeat;
  transform: scale(1.1);
}
.loginAfter {
  animation: resize 2s;
  height: 526rpx;
  background-image: url("../../../UI/Login.png");
  background-position: center;
  background-repeat: no-repeat;
  transform: scale(0.9);
}
.btnFirst {
  margin-top: 150rpx;
}
.btnAfter {
  margin-top: 50rpx;
}
.img {
  width: 100%;
  height: 100%;
}
.welcome .welcome_text {
  color: #ffd2a2;
  font-family: Microsoft YaHei;
  font-weight: regular;
  line-height: normal;
  font-size: 48rpx;
}

.BBS_text {
  color: #eba284;
  font-family: Microsoft YaHei;
  font-weight: regular;
  font-size: 72rpx;
  line-height: normal;
}
.loginbtn {
  width: 668rpx;
  height: 94rpx;
  display: inline-block;
  margin-left: 40rpx;
  font-size: 48rpx;
  line-height: 52rpx;
  cursor: pointer;
  padding: 15rpx 0;
  text-align: center;
  justify-content: center;
  text-decoration: none;
  outline: none;
  color: #fff;
  background-color: #efbe86;
  border: none;
  border-radius: 20rpx;
}
.Ahidden {
  display: none;
}
.Ashow {
  opacity: 1;
}
.inputWrapper {
  height: 86rpx;
  padding: 0 5.5%;
  margin-top: 1.5%;
}
.inputWrapper .input {
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
  box-sizing: border-box;
  border-style: solid;
  border-color: #c4c4c4;
  border-width: 1rpx;
  padding: 2% 0;
}
.inputWrapper .Eminput {
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
  box-sizing: border-box;
  border-style: solid;
  border-color: #eba284;
  border-width: 1rpx;
  padding: 2% 0;
}
.inputWrapper .Input {
  width: 80%;
  height: 100%;
  box-sizing: border-box;
  border-style: none;
  font-size: 32rpx;
  line-height: 34rpx;
  margin-left: 5.5%;
}
.eye {
  height: 34rpx;
  width: 44rpx;
  overflow: hidden;
  position: relative;
  z-index: 1;
  left: 85.6%;
  top: -90rpx;
}
.forgetpwd {
  height: 34rpx;
  width: 146rpx;
  margin-top: -40rpx;
  margin-left: 78%;
}
.forget_text {
  color: #eba284;
  font-size: 24rpx;
}
.emptyTips {
  height: 32rpx;
  width: 100%;
  margin-left: 10%;
}
.empty {
  color: #eba284;
  font-size: 24rpx;
}
.NoEmpty {
  color: #eba284;
  font-size: 24rpx;
  display: none;
}

@keyframes resize {
  from {
    transform: scale(1.1);
    height: 794rpx;
  }
  to {
    transform: scale(0.9);
    height: 526rpx;
  }
}
</style>

<script>
import { getLogin, getUser } from "../../../axios/login/login.js";
export default {
  data() {
    return {
      isEntrance: true,
      showPass: false,
      isEmpty: false,
      isWrong: false,
      src1: "../../../../static/icons/login/Leye.png",
      src2: "../../../../static/icons/login/Heye.png",
      username: "",
      password: "",
      reDatalist: [],
      animationData: {},
      imgsuoxiao: {},
    };
  },

  onShow: function () {
    //初始化一个动画
    var animation = uni.createAnimation({
      duration: 1200,
      timingFunction: "ease",
    });
    this.animation = animation;
  },
  methods: {
    showEye() {
      // 显示密码
      this.showPass = !this.showPass;
    },
    noEmpty() {
      if (this.username == "") {
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }
    },
    isRight() {
      if (this.username && this.password) {
        this.isWrong = false;
      } else if (!this.username && this.password) {
        this.isWrong = false;
        this.isEmpty = true;
      }
    },
    //登录
    getLogin(username, password) {
      return getLogin({ username, password })
        .then((res) => {
          let nowstate = [];
          nowstate = res.data.state;
          if (nowstate == 201 || nowstate == 200) {
            uni.showToast({
              title: "登录成功",
              duration: 1500,
              icon: "none",
            });
            //缓存token
            new Promise((resolve, reject) => {
              uni.setStorage({
                key: "token",
                data: res.data.data,
                success: function () {
                  console.log("ok");
                  resolve(1);
                },
              });
            })
              .then((res) => {
                this.isWrong = false;
                getUser().then((res) => {
                  this.$store.commit("User/setUserData",res.data.data);
                  new Promise((resolve, reject) => {
                    uni.setStorage({
                      key: "userInfo",
                      data: res.data.data,
                      success: function () {
                        resolve(1);
                      },
                    });
                  }).then((res) => {
                    if (nowstate == 200) {
                      uni.switchTab({
                        url: "../square/square",
                      });
                    } else {
                      uni.showToast({
                        title: "初次登陆，请修改密码跳转中...",
                        icon: "none",
                      });
                      setTimeout(() => {
                        uni.navigateTo({
                          url: "../../level3/login/modify",
                          fail(err) {
                            console.log(err);
                          },
                        });
                      }, 1500);
                    }
                  });
                });
              })
              .catch((err) => {
                console.log("登陆有个地方出了问题");
              });
          } else {
            this.isWrong = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    login() {
      if (this.isEntrance) {
        this.isEntrance = !this.isEntrance;
      } else {
        this.noEmpty();
        this.isRight();
        this.getLogin(this.username, this.password);
      }
    },
    verify() {
      uni.navigateTo({
        url: "../../level2/login/forgetpwd",
      });
    },
  },
};
</script>
