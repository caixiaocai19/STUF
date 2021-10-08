<template>
  <view>
    <mescroll-uni
      :ref="'mescrollRef' + i"
      @init="mescrollInit"
      height="100%"
      top="60"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
      @emptyclick="emptyClick"
    >
      <!-- <transition name="indexfloor"> -->
      <IndexFloor
        v-for="(item, index) in goods"
        :list="item"
        @bandleMoreBtn="bandleMoreBtn"
        @click.native="forPostDetail(item.articleId, item.tagList)"
        @unlikeIt="unlikeIt"
        @likeIt="likeIt"
        :key="item.articleId"
      ></IndexFloor>
      <!-- </transition> -->
    </mescroll-uni>
  </view>
</template>

<script>
import MescrollMixin from "./mescroll-uni/mescroll-mixins.js";
import MescrollMoreItemMixin from "./mescroll-uni/mixins/mescroll-more-item.js";
import MescrollUni from "./mescroll-uni/mescroll-uni.vue";
import IndexFloor from "../square/IndexFloor.vue";
import {
  getPost,
  setLike,
  setUnLike,
  setNoticeIt,
  setUnnoticeIt,
  deletePost,
} from "../../axios/square/square";
import {
  POSTINFO,
  SYCNLIKE,
  FOLLOWPERSON,
  CANCELFOLLOWPERSON,
} from "../../pages/constant";
export default {
  mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
  data() {
    return {
      downOption: {
        auto: false, // 不自动加载 (mixin已处理第一个tab触发downCallback)
      },
      upOption: {
        auto: false, // 不自动加载
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          tip: "~ 空空如也 ~", // 提示
          btnText: "去看看",
        },
      },
      goods: [], //列表数据
    };
  },
  components: {
    MescrollUni,
    IndexFloor,
  },
  props: {
    i: Number, // 每个tab页的专属下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
    index: {
      // 当前tab的下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
      type: Number,
      default() {
        return 0;
      },
    },
    tabs: {
      // 为了请求数据种类
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    //点击更多的函数
    bandleMoreBtn() {
      // 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
      this.$bus.$emit("bandleMoreBtn");
    },
    //点击获取帖子的详情
    forPostDetail(articleId, tagList) {
      let userDetail = { articleId, tagList };
      console.log(userDetail);
      uni.navigateTo({
        url:
          "../../../pages/level2/square/postDetail?userDetail=" +
          JSON.stringify(userDetail),
      });
    },
    //取消点赞
    unlikeIt(articleId) {
      setUnLike({ articleId });
    },
    // 点赞
    likeIt(articleId) {
      setLike({ articleId: articleId }).then(
        (res) => {},
        (err) => {
          console.log(err);
        }
      );
    },
    /*下拉刷新的回调 */
    downCallback() {
      // 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
      this.mescroll.resetUpScroll();
    },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      //联网加载数据
      let keyword = this.tabs[this.i].name; //有推荐数据的时候再来做这个=_=
      getPost({ uid: [], page: page.num, size: page.size, current: null })
        .then((res) => {
          //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          this.mescroll.endSuccess(res.data.data.detail.length);
          //方法一(推荐): 后台接口有返回列表的总页数 totalPage
          this.mescroll.endByPage(
            res.data.data.detail.length,
            res.data.data.maxPageNum
          );
          //设置列表数据
          if (page.num == 1) {
            this.goods = []; //如果是第一页需手动制空列表
          }
          let postDetailList = [];
          for (let i = 0; i < res.data.data.detail.length; i++) {
            let { articleInfo } = res.data.data.detail[i];
            let { labels } = res.data.data.detail[i];
            let { userInfo, userFollow } = res.data.data.detail[i].userDetail;
            postDetailList.push({
              follow: userFollow.follow,
              articleId: articleInfo.articleId,
              uid: articleInfo.uid,
              likedNum: articleInfo.likedNum,
              like: res.data.data.detail[i].like,
              sharedNum: articleInfo.sharedNum,
              commentNum: articleInfo.commentNum,
              userHeader: userInfo.photoPath,
              userName: userInfo.nickname,
              postText: articleInfo.summary,
              postImages: [articleInfo.thumbnailPath || ""],
              tagList: labels,
              postTime: new Date(articleInfo.date).format("MM/dd"),
            });
          }
          this.goods = this.goods.concat(...postDetailList); //追加新数据
        })
        .catch(() => {
          //联网失败, 结束加载
          this.mescroll.endErr();
        });
    },
    //点击空布局按钮的回调
    emptyClick() {
      uni.showToast({
        title: "点击了按钮,具体逻辑自行实现",
      });
    },
  },
  mounted() {
    this.$bus.$on(SYCNLIKE, (data, like) => {
      for (const item of this.posts[this.activeType].list) {
        if (item.articleId === data) {
          item.like = !item.like;
          if (like) {
            item.likedNum++;
          } else {
            item.likedNum--;
          }
          break;
        }
      }
    });
    //本地刷新发新的帖子避免卡顿
    this.$bus.$on(POSTINFO, (articleInfo) => {
      this.downCallback();
    });
    this.$bus.$on("deleteLocalPost", (articleId) => {
      deletePost({ articleId })
        .then((res) => {
          for (let index in this.goods) {
            if (this.goods[index].articleId === articleId) {
              this.goods.splice(index, 1);
            }
          }
        })
        .catch((err) => {
          console.log(res);
        });
    });
  },
  //销毁前卸载事件的监听
  beforeDestroy() {
    this.$bus.$off(SYCNLIKE);
    this.$bus.$off(POSTINFO);
  },
};
</script>
<style scoped>
.indexfloor-leave-active {
  animation: AA 0.2s linear reverse;
}
@keyframes AA {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0px);
  }
}
</style>