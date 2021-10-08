<!-- releaseLabel2 -->
<template>
  <view class="release_label">
    <!-- 头部导航栏开始 -->
    <Navigator-bar>
      <view
        slot="right"
        style="color: #efbe86; font-size: 32rpx; margin-right: 30rpx"
        @click="complete"
        >完成</view
      >
      <view slot="center"> 标签 </view>
      <view slot="left">
        <image
          src="../../../../static/icons/message/back.png"
          mode="heightFix"
          style="height: 30rpx"
          @click="goBack"
        />
      </view>
    </Navigator-bar>
    <!-- 头部导航栏结束 -->
    <!-- 已选择标签展示开始 -->
    <view class="show_selected">
      <view class="selected_item" v-for="(item, index) in selectedLabels"
        >{{ item.content
        }}<image
          src="../../../../static/icons/message/delete.png"
          @click="deleteLabel(index)"
      /></view>
      <view class="add_label"
        ><image
          src="../../../../static/icons/message/add.png"
          mode="widthFix"
        />添加标签</view
      ></view
    >
    <!-- 已选择标签展示结束 -->
    <!-- 选择标签的面版开始 -->
    <view class="label">
      <view class="label_navi">
        <view
          class="navi_item"
          :class="{ active: index === currentIndex }"
          v-for="(item, index) in labelTypes"
          @click="changeType(index)"
          >{{ item }}</view
        >
      </view>
      <view class="label_list">
        <view
          @click="chooseLabel(item)"
          class="label_item"
          v-for="(item, index) in labels[currentIndex].labelItem"
          >{{ item.content }}</view
        >
      </view>
    </view>
    <!-- 选择标签的面版结束 -->
  </view>
</template>

<script>
import NavigatorBar from "../../../components/content/NavigatorBar.vue";
import { getLabels } from "../../../axios/message/message.js";
import {SETLABELS} from "../../constant"
export default {
  name: "releaseLabel2",
  data() {
    return {
      labelTypes: ["兴趣", "经历", "影视", "音乐", "游戏", "运动", "自定义"], //标签类型,
      currentIndex: 0, //当前激活的选项卡
      selectedLabels: [], //已经选择的标签(最多选择4个)
      labels: [
        {
          maxPageSize: 1,
          labelItem: [],
        },
        {
          maxPageSize: 1,
          labelItem: [],
        },
        {
          maxPageSize: 1,
          labelItem: [],
        },
        {
          maxPageSize: 1,
          labelItem: [],
        },
        {
          maxPageSize: 1,
          labelItem: [],
        },
        {
          maxPageSize: 1,
          labelItem: [],
        },
        {
          maxPageSize: 1,
          labelItem: [],
        },
      ], //供你选择的标签
    };
  },
  methods: {
    //更改选项卡
    changeType(index) {
      this.currentIndex = index;
      //切换标签的时候获取所有的标签
      let num = this.labels[index].maxPageSize;
      for (let i = 1; i < num; i++) {
        this.getLabels(index, 20, i);
      }
    },
    //获取所有标签
    getLabels(typeId, size, page) {
      getLabels(typeId, size, page).then((res) => {
        this.labels[typeId].labelItem.push(...res.data.data.detail);
        this.labels[typeId].maxPageSize = res.data.data.maxPageNum;
      });
    },
    //选择标签
    chooseLabel(item) {
      if (
        this.selectedLabels.some((label) => {
          return label.labelId === item.labelId;
        })
      ) {
        uni.showToast({
          title: "这个标签选过了换一个吧~",
          duration: 1000,
          icon: "none",
        });
        return;
      }
      if (this.selectedLabels.length < 4) {
        this.selectedLabels.push(item);
      } else {
        uni.showToast({
          title: "标签数量超过上限",
          duration: 2000,
          icon: "none",
        });
      }
    },
    //删除标签
    deleteLabel(index) {
      this.selectedLabels.splice(index, 1);
    },
    //返回按钮
    goBack() {
      console.log("fanghui");
      uni.navigateBack({
        delta: 1,
      });
    },
    //完成按钮
    complete() {
      //空标签处理
      if (this.selectedLabels.length === 0) {
        uni.switchTab({
          url: "../../level1/message/message?labels",
          success() {},
        });
        return;
      }
      let _this = this;
      uni.switchTab({
        url: "../../level1/message/message?labels",
        success() {
          //设置帖子的标签
          _this.$bus.$emit(SETLABELS, _this.selectedLabels);
        },
      });
    },
  },
  components: {
    NavigatorBar,
  },
  mounted() {
    //页面挂载加载一定的标签
    for (let i = 0; i < this.labelTypes.length; i++) {
      this.getLabels(i, 20, 1);
    }
  },
};
</script>
<style scoped>
.release_label {
  font-family: Microsoft YaHei;
  padding-top: 80px;
}
/* 已选择标签展示开始 */
.show_selected {
  height: 452rpx;
  background-color: #fdf7ef;
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  align-content: flex-start;
}
.show_selected image {
  width: 26rpx;
  margin-right: 10rpx;
}
.selected_item image {
  width: 20rpx;
  height: 20rpx;
  margin-left: 10rpx;
}
.selected_item {
  display: inline-block;
  background-color: #ffd2a2;
  height: 64rpx;
  vertical-align: middle;
  line-height: 64rpx;
  border-radius: 64rpx;
  border: 2rpx solid #ffd2a2;
  padding: 0 10px;
  margin-left: 30rpx;
  margin-top: 20rpx;
}
.add_label {
  display: inline-block;
  background-color: #fff;
  height: 64rpx;
  vertical-align: middle;
  line-height: 64rpx;
  border-radius: 64rpx;
  border: 2rpx solid #ffd2a2;
  padding: 0 10px;
  margin-left: 30rpx;
  margin-top: 20rpx;
}
/* 已选择标签展示结束 */
/* 选择标签的面版开始 */
.label {
}
.label_navi {
  height: 90rpx;
  border-bottom: 2px solid #f2f2f2;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 32rpx;
  color: #333333;
}
.navi_item {
}
.active {
  border-bottom: 6rpx solid #ffd2a2;
}
.label_list {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  align-content: flex-start;
}
.label_item {
  background-color: #ffd2a2;
  height: 70rpx;
  border-radius: 70rpx;
  line-height: 70rpx;
  padding: 0 25rpx;
  color: #707070;
  margin-left: 30rpx;
  margin-top: 20rpx;
}
/* 选择标签的面版开始 */
</style>