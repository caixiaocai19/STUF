<template>
  <view class="profile">
    <!-- 头部导航栏开始 -->
    <navigator-bar>
      <view slot="center">我的</view>
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
      <profile-header
        :userHead="userHead"
        @click.native="changeUserMes"
      ></profile-header>
      <!-- 头部个人信息开始 -->
      <!--中间的楼层数据开始-->
      <index-floor
        v-for="(item, index) in dataList"
        :list="item"
        :detail="true"
        @click.native="forPostDetail(item.articleId, item.tagList)"
        @unlikeIt="unlikeIt"
        @likeIt="likeIt"
      ></index-floor>
      <!--中间的楼层数据结束-->
    </mescroll-body>
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
  </view>
</template>

<script>
import MescrollMixin from "../../../components/common/mescroll-uni/mescroll-mixins.js";
import NavigatorBar from "../../../components/content/NavigatorBar.vue";
import IndexFloor from "../../../components/square/IndexFloor.vue";
import ProfileHeader from "../../../components/message/ProfileHeader.vue";
import MyShowToast from "../../../components/common/MyShowToast/MyShowToast.vue";
import LoginNoticeMixin from "../../../components/common/MyShowToast/LoginNoticeMixin.js";
import { HADCHANGELABELS, CHANGEUSERMES, CANCELLOGIN } from "../../constant";
import {
  getPost,
  getUserMes,
  setLike,
  setUnLike,
  getUserLabels,
} from "../../../axios/profile/profile.js";
export default {
  mixins: [MescrollMixin, LoginNoticeMixin], // 使用mixin (在main.js注册全局组件)
  data() {
    return {
      userHead: {
        userInfo: {
          photoPath: "../../../../static/icons/profile/unLogin.png",
          motto: "点我去登陆",
          nickname: "还没登陆",
        },
        labels: [{ content: "标签" }], //用户自己的标签
      },
      //下拉和上拉的数据
      downOption: {
        auto: true, //是否在初始化后,自动执行downCallback; 默认true
      },
      dataList: [],
    };
  },
  components: {
    NavigatorBar,
    IndexFloor,
    ProfileHeader,
    MyShowToast,
  },
  methods: {
    //判断用户是否已经登陆
    isLogin() {
      return new Promise((resolve, reject) => {
        uni.getStorage({
          key: "userInfo",
          success: (user) => {
            resolve(user);
          },
          fail: () => {
            this.$bus.$emit("loginNotice");
          },
        });
      }).catch((err) => {
        console.log("没登陆玩鬼");
      });
    },
    //同步标签
    hadChangeLabels(labels) {
      this.userHead.labels = labels;
    },
    //修改个人信息
    async changeUserMes() {
      //先获取用户的信息，判断是否登陆了
      let user = await this.isLogin();
      if (!user) {
        return;
      }
      uni.navigateTo({
        url: "../../level2/profile/edit",
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
    /*下拉刷新的回调 */
    downCallback() {
      //页面挂载的时候就加载用户的信息
      this.getUserInfo()
        .then((res) => {
          this.mescroll.endSuccess();
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
        })
        .catch((err) => {
          this.$bus.$emit("loginNotice");
          this.mescroll.endErr();
        });
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
          if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
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
          this.dataList.push(...postDetailList); //追加新数据
        })
        .catch(() => {
          //联网失败, 结束加载
          this.mescroll.endErr();
        });
    },
  },
  mounted() {
    //标签的改变
    this.$bus.$on(HADCHANGELABELS, (data) => {
      this.hadChangeLabels(data);
    });
    //个人信息的改变
    this.$bus.$on(CHANGEUSERMES, () => {
      getUserMes(this.userHead.userInfo.uid).then(
        (res) => {
          this.userHead.userInfo = res.data.data;
        },
        (err) => {
          console.log(err);
        }
      );
    });
    //注销了用户
    this.$bus.$on(CANCELLOGIN, () => {
      this.userHead = {
        userInfo: {
          photoPath: "../../../../static/icons/profile/unLogin.png",
          motto: "点我去登陆",
          nickname: "还没登陆",
        },
        labels: [{ content: "标签" }], //用户自己的标签
      };
      this.dataList = [];
    });
  },
};
</script>

<style scoped>
.profile {
  font-family: Microsoft YaHei;
  padding-top: 80px;
}
</style>
