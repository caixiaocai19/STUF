<template>
  <view>
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
      <view slot="center">头像</view>
      <view slot="left">
        <image
          src="../../../../static/icons/message/moreBtn.png"
          mode="heightFix"
          style="height: 14rpx; margin-right: 28rpx"
          @click="popmunu"
        />
      </view>
    </navigator-bar>
    <!-- 头部导航栏结束 -->
    <text class="iconfont icon-caidan caidan-icon" @tap="popmunu"></text>
    <view class="back-ground">
      <view>
        <image
          v-for="item in imgArr"
          :src="item"
          class="user-head"
          @click="previewImage"
        ></image>
      </view>
    </view>
  </view>
</template>

<script>
import NavigatorBar from "../../../components/content/NavigatorBar.vue";
import { postUserPhoto } from "../../../axios/message/message.js";
import {CHANGEUSERMES} from "../../constant"
export default {
  onLoad: function (e) {
    this.imgArr[0] = e.head;
  },
  data() {
    return {
      imgArr: [],
      img: [],
      index: 0,
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
    //选择图片
    chooseImg() {
      var that = this;
      uni.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["camera", "album"],
        success: (res) => {
          that.imgArr = res.tempFilePaths;
          that.img = res.tempFiles;
          uni.showLoading({
            title: "上传中",
            success: () => {
              that.getUploadFile();
            },
          });
        },
      });
    },
    getUploadFile() {
      let files = [];
      for (let i = 0; i < this.img.length; i++) {
        files[i] = {
          name: "photo",
          file: this.img[i],
          uri: this.imgArr[i],
        };
      }
      this.postUserPhoto(files);
    },
    postUserPhoto(files) {
      return postUserPhoto(files).then(
        (res) => {
          //修改信息
          this.$bus.$emit(CHANGEUSERMES);
          uni.showToast({
            title: "上传成功",
            duration: 2000,
            icon: "none",
            success() {
              setTimeout(() => {
                uni.navigateBack({
                  delta: 1,
                });
              }, 2000);
            },
          });
        },
        (err) => {
          uni.showToast({
            title: "上传失败",
            duration: 2000,
            icon: "none",
          });
        }
      );
    },
    //预览图片
    previewImage(e) {
      var current = e.target.dataset.src;
      uni.previewImage({
        current: current,
        urls: this.imgArr,
      });
    },
    //保存图片到系统相册。
    saveImg() {
      uni.saveImageToPhotosAlbum({
        filePath: this.imgArr[0], //图片文件路径
        success() {
          uni.showToast({
            title: "图片保存成功",
            icon: "none",
          });
        },
        fail() {
          uni.showToast({
            title: "图片保存失败",
            icon: "none",
          });
        },
      });
    },
    //点击更多弹出下侧弹窗
    popmunu() {
      var that = this;
      uni.showActionSheet({
        itemList: ["从手机相册中选择", "保存到手机"],
        popover: {},
        success: function (res) {
          if (res.tapIndex === 0) {
            that.chooseImg();
          } else {
            that.saveImg();
          }
        },
        fail: function (res) {
          console.log(res.errMsg);
        },
      });
    },
  },
};
</script>

<style scoped>
@import url("../../../../static/icons/iconfont/iconfont.css");
.back-ground {
  background-color: #333333;
  width: 100%;
  height: 100vh;
  margin-top: 38rpx;
}
.caidan-icon {
  position: absolute;
  top: 100rpx;
  right: 42rpx;
  font-size: 43rpx;
}
.user-head {
  position: relative;
  width: 100%;
  height: 750rpx;
  top: 200rpx;
}
</style>
