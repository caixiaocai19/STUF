<!-- MyShowToast -->
<template>
  <view class="my_show_toast">
    <view class="content">{{ content }}</view>
    <view class="user_choose">
      <view class="cancel" @click="cancelBandle">{{ cancel }}</view>
      <view class="conform" @click="conformBandle">{{ conform }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "MyShowToast",
  data() {
    return {};
  },
  props: {
    content: {
      required: true,
      default: "消息提示",
    },
    conform: {
      required: true,
      default: "确定",
    },
    cancel: {
      required: true,
      default: "取消",
    },
  },
  methods: {
    //取消
    cancelBandle() {
      this.$emit("cancelBandle");
    },
    //确定
    conformBandle() {
      this.$emit("conformBandle");
    },
  },
};
</script>
<style scoped>
.my_show_toast {
  background-color: #fff;
  width: 574rpx;
  height: 236rpx;
  border-radius: 30rpx;
  font-family: Microsoft YaHei;
  overflow: hidden;
}
.content {
  text-align: center;
  font-size: 40rpx;
  font-weight: bold;
  margin: 35rpx 0;
}
.user_choose {
  display: flex;
  justify-content: space-evenly;
}
.cancel {
  text-align: center;
  line-height: 66rpx;
  border-radius: 66rpx;
  width: 218rpx;
  height: 66rpx;
  background-color: #ececec;
}
.conform {
  width: 218rpx;
  height: 66rpx;
  border-radius: 66rpx;
  background-color: #eba284;
  text-align: center;
  line-height: 66rpx;
}
</style>