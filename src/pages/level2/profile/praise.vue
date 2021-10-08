<!-- 我的 -->
<template>
  <view class="profile">
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
      <view slot="center">赞</view>
    </navigator-bar>
    <!-- 头部导航栏结束 -->
    <view class="scrollY">
      <mescroll-body
        ref="mescrollRef"
        @init="mescrollInit"
        :down="downOption"
        @down="downCallback"
        @up="upCallback"
      >
        <!--中间的楼层数据开始-->
        <index-floor
          v-for="(item, index) in postList"
          :list="item"
          :detail="true"
          @click.native="forPostDetail(item.articleId, item.tagList)"
          @unlikeIt="unlikeIt"
          @likeIt="likeIt"
        ></index-floor>
        <!--中间的楼层数据结束-->
      </mescroll-body>
    </view>
  </view>
</template>

<script>
import MescrollMixin from "../../../components/common/mescroll-uni/mescroll-mixins.js";
import NavigatorBar from "../../../components/content/NavigatorBar.vue";
import IndexFloor from "../../../components/square/IndexFloor.vue";
import {
  getPost,
  setLike,
  setUnLike,
  getUserLabels,
  getListLike,
} from "../../../axios/profile/profile.js";
export default {
  name: "profile",
  mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
  data() {
    return {
      userHead: {
        userInfo: {},
        labels: [{ content: "caixiaocai" }], //用户自己的标签
      },
      postList: [], //当前用户上传的帖子列表
      loadStatus: "more", //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
      isLoadMore: false, //是否加载中
      maxPageNum: 1, //数据库中数据的最大页数(帖子)
      page: 1, //当前加载的页数（帖子）
      loadSize: 5, //一次加载最多20条（帖子）
      //下拉和上拉的数据
      downOption: {
        auto: true, //是否在初始化后,自动执行downCallback; 默认true
      },
    };
  },
  components: {
    NavigatorBar,
    IndexFloor,
  },
  methods: {
    //返回
    goBack() {
      uni.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
      });
    },
    //取消点赞
    unlikeIt(articleId) {
      setUnLike({ articleId });
      this.userHead.userInfo.likeNum--;
    },
    // 点赞
    likeIt(articleId) {
      this.userHead.userInfo.likeNum++;
      setLike({ articleId: articleId }).then(
        (res) => [console.log(res)],
        (err) => {
          console.log(err);
        }
      );
    },
    //点击获取帖子的详情
    forPostDetail(articleId, tagList) {
      let userDetail = { articleId, tagList };
      uni.navigateTo({
        url:
          "../../level2/square/postDetail?userDetail=" +
          JSON.stringify(userDetail),
      });
    },
    //获取用户的信息
    getUserInfo() {
      let _this = this;
      return new Promise((resolve, reject) => {
        // 获取用户的登陆信息
        uni.getStorage({
          key: "userInfo",
          success(res) {
            _this.userHead.userInfo = res.data;
            resolve(res.data);
          },
          fail(err) {
            reject(err);
          },
        });
      })
        .then((res) => {
          //获取用户的标签
          getUserLabels(res.uid, 1, 10).then((res) => {
            _this.userHead.labels = res.data.data.detail;
          });
          return Promise.resolve(1);
        })
        .catch((err) => {
          return Promise.reject(1);
        });
    },
    //获取当前用户自己发的帖子
    getListLike(page, size) {
      return getListLike(page, size)
        .then((res) => {
          //每次请求都要更新当前数据库最大页数
          this.maxPageNum = res.data.data.maxPageNum;
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
              postImages: articleInfo.thumbnailPath
                ? [articleInfo.thumbnailPath]
                : [],
              tagList: labels,
              postTime: new Date(articleInfo.date).format("MM/dd"),
            });
          }
          this.postList.push(...postDetailList);
          this.page++; //当前页数加一
        })
        .catch((err) => {
          console.log(err);
        });
    },
     /*下拉刷新的回调 */
    downCallback() {
      this.mescroll.resetUpScroll();
    },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      getListLike(page.num, page.size).then(
        (res) => {
          console.log(res)
          //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          this.mescroll.endSuccess(res.data.data.detail.length);
           //方法一(推荐): 后台接口有返回列表的总页数 totalPage
          this.mescroll.endByPage(
            res.data.data.detail.length,
            res.data.data.maxPageNum
          );
          //设置列表数据
          if (page.num == 1) this.postList = []; //如果是第一页需手动制空列表
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
              postImages: articleInfo.thumbnailPath
                ? [articleInfo.thumbnailPath]
                : [],
              tagList: labels,
              postTime: new Date(articleInfo.date).format("MM/dd"),
            });
          }
          this.postList.push(...postDetailList);//追加新数据
        }
      ) .catch(() => {
          //联网失败, 结束加载
          this.mescroll.endErr();
        });
    },
  },
  mounted() {
    //页面挂载的时候就加载用户的信息
    this.getUserInfo().then((res) => {
     
    });
  },
};
</script>
<style scoped>
.profile {
  font-family: Microsoft YaHei;
  padding-top: 80px;
}
.scrollY {
  height: 94vh;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: transparent;
}
</style>