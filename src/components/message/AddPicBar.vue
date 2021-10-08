<!-- 添加图片 -->
<template>
  <view add_pic_bar>
    <view class="add_pic" :style="{ bottom: height + 'px' }" v-show="height!==0">
      <view class="add_btn" @click="chooseImage">
        <image
          src="../../../static/icons/square/svg/postPic.svg"
          mode="heightFix"
        ></image>
      </view>
      <view class="dispatch_btn">
        <image
          src="../../../static/icons/square/svg/transmit.svg"
          mode="heightFix"
        ></image>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "AddPicBar",
  data() {
    return {
      height: 0,
    };
  },
  methods: {
    //选择图片
    chooseImage() {
      this.$emit("chooseImage");
    },
  },
  components: {},
  mounted() {
    //获取键盘的高度
    uni.onKeyboardHeightChange((res) => {
      console.log(res.height);
      this.height = res.height - 53;
    });
  },
};
</script>
<style scoped>
.add_pic_bar {
  height: 100%;
  position: relative;
}
.add_pic {
  position: fixed;
  width: 100%;
  bottom: 110px;
  height: 106rpx;
  background-color: #ffffff;
  box-shadow: 0px -0.2px 4px 0.1px #8c8c8c;
  display: flex;
  align-items: center;
}
.add_btn {
  flex: 1;
  text-align: left;
  margin-left: 38rpx;
}
.add_btn image {
  height: 50rpx;
}
.dispatch_btn {
  flex: 1;
  text-align: right;
  margin-right: 38rpx;
}
.dispatch_btn image {
  height: 42rpx;
}
</style>