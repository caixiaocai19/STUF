<template>
  <view class="square">
    <Cate @changeType="changeType" v-model="tabIndex" />
    <!--关注列表开始-->
    <notice-swiper
      class="notice_swiper"
      v-show="tabIndex === 0"
    ></notice-swiper>
    <!--关注列表结束-->
    <swiper
      :style="{ height: height }"
      :current="tabIndex"
      @change="swiperChange"
      class="swiper"
    >
      <swiper-item v-for="(tab, i) in tabs" :key="i">
        <mescroll-item
          ref="mescrollItem"
          :i="i"
          :index="tabIndex"
          :tabs="tabs"
        ></mescroll-item>
      </swiper-item>
    </swiper>
    <!-- 点击更多后产生的的上拉菜单开始 -->
    <uni-popup ref="popup" :mask-click="false">
      <popup-bottom @close="close" />
    </uni-popup>
    <!-- 点击更多后产生的的上拉菜单结束 -->
    <!-- 点击更多后产生的的取消弹窗开始 -->
    <uni-popup ref="myShowToast">
      <MyShowToast
        :cancel="cancel"
        :conform="conform"
        :content="content"
        @conformBandle="conformBandle"
        @cancelBandle="cancelBandle"
      />
    </uni-popup>
    <!-- 登陆弹窗的提示开始 -->
    <uni-popup ref="loginNotice">
      <MyShowToast
        :cancel="loginCancel"
        :conform="loginConform"
        :content="loginContent"
        @conformBandle="loginConformBandle"
        @cancelBandle="loginCancelBandle"
      />
    </uni-popup>
    <!-- 登陆弹窗的提示结束 -->
     <!-- 删除弹窗的提示开始 -->
    <uni-popup ref="deletePost">
      <MyShowToast
        :cancel="deleteCancel"
        :conform="deleteConform"
        :content="deleteContent"
        @conformBandle="deleteConformBandle"
        @cancelBandle="deleteCancelBandle"
      />
    </uni-popup>
    <!-- 删除弹窗的提示结束 -->
  </view>
</template>

<script>
import MescrollItem from "../../../components/common/mescroll-item.vue";
import NoticeSwiper from "../../../components/square/NoticeSwiper.vue";
import PopupBottom from "../../../components/square/PopupBottom.vue";
import Cate from "../../../components/content/Cate.vue";
import MyShowToast from "../../../components/common/MyShowToast/MyShowToast.vue";
import MyShowToastMixin from "../../../components/common/MyShowToast/MyShowToastMixin.js";
import LoginNoticeMixin from "../../../components/common/MyShowToast/LoginNoticeMixin.js";
import DeleteConformMixin from "../../../components/common/MyShowToast/DeleteConformMixin.js";
export default {
  name: "square",
  mixins: [MyShowToastMixin,LoginNoticeMixin,DeleteConformMixin], // 使用mixin弹窗
  components: {
    MescrollItem,
    NoticeSwiper,
    PopupBottom,
    Cate,
    MyShowToast,
  },
  data() {
    return {
      height: "400px", // 需要固定swiper的高度
      tabs: [{ name: "关注" }, { name: "推荐" }], //导航栏内容
      tabIndex: 0, // 当前tab的下标
    };
  },
  methods: {
    //切换选项卡
    changeType(index) {
      this.tabIndex = index;
    },
    // 轮播菜单
    swiperChange(e) {
      this.tabIndex = e.detail.current;
    },
    //关闭遮罩
    close() {
      this.$refs.popup.close();
    },
  },
  onLoad() {
    // 需要固定swiper的高度
    this.height = uni.getSystemInfoSync().windowHeight + "px";
  },
  onShow() {
    //点击更多
    this.$bus.$on("bandleMoreBtn", () => {
      this.$refs.popup.open("bottom");
    });
    // //取消关注
    // this.$bus.$on("myShowToast", (uid) => {
    //   this.cancelUid = uid;
    //   console.log(uid);
    //   this.$refs.myShowToast.open("center");
    // });
  },
  onHide() {
    this.$bus.$off("bandleMoreBtn");
    // this.$bus.$off("myShowToast");
  },
};
</script>

<style scoped>
.square {
  padding-top: 120rpx;
}
</style>
