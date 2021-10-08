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
      <view slot="center">{{ type }}</view>
    </navigator-bar>
    <!-- 头部导航栏结束 -->
    <mescroll-body
      ref="mescrollRef"
      @init="mescrollInit"
      :down="downOption"
      @down="downCallback"
      @up="upCallback"
    >
      <!-- 头部个人信息开始 -->
      <profile-header :userHead="userHead" :ItMySelf="false"></profile-header>
      <!-- 头部个人信息开始 -->
      <!--中间的楼层数据开始-->
      <index-floor
        v-for="(item, index) in postList"
        :list="item"
        :detail="true"
        @click.native="forPostDetail(item.articleId, item.tagList)"
        @unlikeIt="unlikeIt"
        @likeIt="likeIt"
        @unNoticeIt="unNoticeIt"
        @noticeIt="noticeIt"
      ></index-floor>
      <!--中间的楼层数据结束-->
    </mescroll-body>
    <!-- 点击更多后产生的的上拉菜单开始 -->
    <uni-popup ref="popup" :mask-click="false">
      <popup-bottom @close="close" />
    </uni-popup>
    <!-- 	<!-- 点击更多后产生的的上拉菜单结束 -- -->
  </view>
</template>

<script>
import MescrollMixin from "../../../components/common/mescroll-uni/mescroll-mixins.js";
import NavigatorBar from "../../../components/content/NavigatorBar.vue";
import ProfileHeader from "../../../components/message/ProfileHeader.vue";
import PopupBottom from "../../../components/square/PopupBottom.vue";
import IndexFloor from "../../../components/square/IndexFloor.vue";
import {
  getPost,
  getUserMes,
  setLike,
  setUnLike,
  getUserLabels,
} from "../../../axios/profile/profile.js";
export default {
  name: "FolloweeProfile",
  mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
  data() {
    return {
      userHead: {
        userInfo: {},
        labels: [{ content: "caixiaocai" }], //用户自己的标签
      },
      postList: [], //当前用户上传的帖子列表
      type: "关注", //来源
      //下拉和上拉的数据
      downOption: {
        auto: false, //是否在初始化后,自动执行downCallback; 默认true
      },
    };
  },
  components: {
    NavigatorBar,
    ProfileHeader,
    PopupBottom,
    IndexFloor,
  },
  methods: {
    //返回
    goBack() {
      uni.navigateBack({
        delta: 1,
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
        (res) => {},
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
    //获取当前用户自己发的帖子
    getUserPost(uid, page, size) {
      return getPost({ uid, page, size })
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
      //获取用户的标签
      getUserLabels(this.userHead.userInfo.uid, 1, 10).then((res) => {
        this.userHead.labels = res.data.data.detail;
      });
      //刷新个人信息
      getUserMes(this.userHead.userInfo.uid).then(
        (res) => {
          this.userHead.userInfo = res.data.data;
        },
        (err) => {
          console.log(err);
        }
      );
      this.mescroll.resetUpScroll();
    },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      getPost({
        uid: [this.userHead.userInfo.uid],
        page: page.num,
        size: page.size,
      })
        .then((res) => {
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
          this.postList.push(...postDetailList); //追加新数据
        })
        .catch(() => {
          //联网失败, 结束加载
          this.mescroll.endErr();
        });
    },
  },
  //页面加载获取携带的参数
  onLoad(profile) {
    this.userHead.userInfo = JSON.parse(profile.profile).userInfo;
    this.type = JSON.parse(profile.profile).src;
    //获取用户的标签
    getUserLabels(this.userHead.userInfo.uid, 1, 10).then((res) => {
      this.userHead.labels = res.data.data.detail;
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