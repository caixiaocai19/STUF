<template>
  <view class="Followee">
    <!-- 头部导航栏开始 -->
    <navigator-bar>
      <view slot="left">
        <image
          src="../../../../static/icons/square/back.png"
          mode="heightFix"
          style="height: 30rpx"
          @click="goBack"
        />
      </view>
      <view slot="center">被关注的人</view>
    </navigator-bar>
    <!-- 头部导航栏结束 -->
    <mescroll-body
      ref="mescrollRef"
      @init="mescrollInit"
      :down="downOption"
      @down="downCallback"
      @up="upCallback"
    >
      <MyFansItem
        v-for="(item, index) in follows"
        :follows="item"
        @click.native="gotToFolloweePro(item)"
        @refollow="refollow"
      ></MyFansItem>
    </mescroll-body>
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
    <!-- 点击更多后产生的的取消弹窗结束 -->
  </view>
</template>

<script>
import MescrollMixin from "../../../components/common/mescroll-uni/mescroll-mixins.js";
import MyFansItem from "../../../components/profile/MyFansItem.vue";
import navigatorBar from "../../../components/content/NavigatorBar.vue";
import { getNoticeds } from "../../../axios/profile/profile.js";
import MyShowToastMixin from "../../../components/common/MyShowToast/MyShowToastMixin";
import MyShowToast from "../../../components/common/MyShowToast/MyShowToast.vue";
export default {
  name: "myfans",
  mixins: [MescrollMixin, MyShowToastMixin], // 使用mixin (在main.js注册全局组件)
  data() {
    return {
      maxPageNum: 1, //数据库中最大的页数
      page: 1, //当前的页数
      follows: [], //关注的人的数据
      uid: 1, //当前用户的id
      loadSize: 20, //一次加载的最大数量
      isLogin: false, //判断是否已经登陆了--一开始默认为没有
      isShow: true,
      //下拉和上拉的数据
      downOption: {
        auto: true, //是否在初始化后,自动执行downCallback; 默认true
      },
    };
  },
  components: {
    navigatorBar,
    MyFansItem,
    MyShowToast,
  },
  methods: {
    //重新关注
    refollow(followId) {
      this.follows.map((item) => {
        if (item.userInfo.uid === followId) {
          item.userFollow.follow = true;
        }
      });
    },
    //确定
    conformBandle() {
      this.$store.dispatch("Followee/delFollowee", this.cancelUid);
      this.follows.map((item) => {
        if (item.userInfo.uid === this.cancelUid) {
          item.userFollow.follow = false;
        }
      });
      this.$refs.myShowToast.close();
    },
    //取消
    cancelBandle() {
      this.$refs.myShowToast.close();
    },
    //跳转到被关注者的界面
    gotToFolloweePro(profile) {
      let data = {
        src: "被关注",
        userInfo: profile.userInfo,
      };
      uni.navigateTo({
        url:
          "../../level3/profile/followeeProfile?profile=" +
          JSON.stringify(data),
      });
    },
    //返回
    goBack() {
      uni.switchTab({
        url: "../../level1/profile/profile",
      });
    },
    //获取所关注的所有人
    // getNoticeds() {
    //   getNoticeds(this.uid, this.page, this.loadSize)
    //     .then((res) => {
    //       this.maxPageNum = res.data.data.maxPageNum;
    //       for (const item of res.data.data.detail) {
    //         item.userInfo.isFollowed = true;
    //         this.follows.push(item);
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    //获取用户的信息
    getUserInfo() {
      let _this = this;
      return new Promise((resolve, reject) => {
        // 获取用户的登陆信息
        uni.getStorage({
          key: "userInfo",
          success(res) {
            _this.uid = res.data.uid;
            resolve(res.data);
          },
          fail(err) {
            reject(err);
          },
        });
      });
    },
    /*下拉刷新的回调 */
    downCallback() {
      this.mescroll.resetUpScroll();
    },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      getNoticeds(this.uid, page.num, page.size)
        .then((res) => {
          //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          this.mescroll.endSuccess(res.data.data.detail.length);
          //方法一(推荐): 后台接口有返回列表的总页数 totalPage
          this.mescroll.endByPage(
            res.data.data.detail.length,
            res.data.data.maxPageNum
          );
          //设置列表数据
          if (page.num == 1) this.follows = []; //如果是第一页需手动制空列表
          this.follows.push(...res.data.data.detail);
        })
        .catch(() => {
          //联网失败, 结束加载
          this.mescroll.endErr();
        });
    },
  },
  mounted() {
    this.getUserInfo()
      .then((res) => {
        console.log("有登陆的");
      })
      .catch((res) => {
        console.log("滚去登陆");
      });
  },
};
</script>

<style scoped>
.Followee {
  font-family: Microsoft YaHei;
  padding-top: 80px;
}
.scrollY {
  /* margin-top: 80rpx; */
  padding-top: 3rpx;
  height: 94vh;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: transparent;
}
.attention {
  font-size: 17px;
  opacity: 0.9;
}
</style>
