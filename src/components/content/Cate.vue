<!-- 选项栏 -->
<template>
  <view class="cate">
    <view class="text_item">
      <view
        class="cate_item"
        v-for="(item, index) in titles"
        @click="itemClick(index)"
      >
        <font :class="{ active: index === value }">{{ item }}</font>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      titles: ["关注", "推荐"],
    };
  },
  props:["value"],
  methods: {
    itemClick(index) {
      this.$emit("changeType", index);
    },
  },
};
</script>
<style scoped>
.cate {
  color: #333333;
  font-size: 32rpx;
  font-family: Microsoft YaHei;
  font-weight: 400;
  height: 80rpx;
  display: flex;
  justify-content: center;
}
.text_item {
  height: 80rpx;
}
.cate_item {
  display: inline-block;
  margin: 0 40rpx;
  line-height: 48rpx;
  text-align: center;
}
.active {
  font-family: Microsoft YaHei;
  color: #f4912f;
  border-bottom: #eba182 4rpx solid;
  font-size: 40rpx;
  font-weight: 500;
  color: #333333;
}
font {
  padding: 0 10rpx;
}
</style>
