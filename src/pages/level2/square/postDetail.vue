<template>
  <view class="post_detail">
    <!-- 头部标题栏开始 -->
    <navigator-bar>
      <view slot="left">
        <view @click="switchBackTab"
          ><image
            src="../../../../static/icons/square/back.png"
            mode="widthFix"
            style="width: 11px; vertical-align: middle; display: inline-block"
          ></image
        ></view>
      </view>
      <view slot="center">帖子详情</view>
      <view slot="right" @click="bandleMoreBtn">
        <image
          src="../../../../static/icons/square/moreBtn.png"
          mode="widthFix"
          style="
            width: 7px;
            vertical-align: middle;
            display: inline-block;
            margin-right: 32rpx;
          "
        >
        </image>
      </view>
    </navigator-bar>
    <!-- 头部标题栏结束 -->
    <view class="scrollY">
      <mescroll-body
        ref="mescrollRef"
        @init="mescrollInit"
        :down="downOption"
        @down="downCallback"
        @up="upCallback"
        :bottom="150"
        :up="upOption"
        @emptyclick="emptyClick"
      >
        <!-- 原帖子开始 -->
        <index-floor
          :list="detail"
          :detail="true"
          @unlikeIt="unlikeIt"
          @likeIt="likeIt"
          @click.native="createFirstComment"
        ></index-floor>
        <!-- 原帖子结束 -->
        <!-- 分割线开始 -->
        <view class="split_line">
          <h5>留言</h5>
        </view>
        <!-- 分割线结束 -->
        <!--评论楼层数据开始-->
        <post-comment
          v-for="(item, index) in firstComment"
          :firstComment="item"
          @unlikeIt="setCommentUnLike"
          @likeIt="setCommentLike"
        ></post-comment>
        <!--评论楼层数据结束-->
      </mescroll-body>
    </view>
    <!-- 发布导航栏开始 -->
    <post-bar
      :articleId="detail.articleId"
      @submitReply="submitReply"
    ></post-bar>
    <!-- 发布导航栏结束 -->
    <!-- 点击更多后产生的的上拉菜单开始 -->
    <uni-popup ref="popup" :mask-click="false">
      <popup-bottom @close="close" />
    </uni-popup>
    <!-- 点击更多后产生的的上拉菜单结束 -->
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
import IndexFloor from "../../../components/square/IndexFloor.vue";
import NavigatorBar from "../../../components/content/NavigatorBar.vue";
import PostComment from "../../../components/square/PostComment.vue";
import PostBar from "../../../components/square/PostBar.vue";
import PopupBottom from "../../../components/square/PopupBottom.vue";
import { CREATEFIRSTCOMMENT, SYCNLIKE } from "../../constant";
import MyShowToast from "../../../components/common/MyShowToast/MyShowToast.vue";
import LoginNoticeMixin from "../../../components/common/MyShowToast/LoginNoticeMixin.js";
import {
  getPostDetail,
  getCommentList,
  setLike,
  setUnLike,
  setCommentLike,
  setCommentUnLike,
} from "../../../axios/square/square.js";
export default {
  name: "postDetail",
  mixins: [MescrollMixin,LoginNoticeMixin], // 使用mixin (在main.js注册全局组件)
  data() {
    return {
      detail: {
        userHeader: "",
        userName: "",

        postText: "",
        postImages: [],
        tagList: ["一起去玩啊"],
        postTime: "05-23",
        sharedNum: 0,
        commentNum: 0,
        likedNum: 0,
        articleId: 1,
        like: true,
      },
      firstComment: [],
      articleId: 1,
      //下拉和上拉的数据
      downOption: {
        auto: false, //是否在初始化后,自动执行downCallback; 默认true
      },
      // 上拉加载的配置(可选, 绝大部分情况无需配置)
      upOption: {
        page: {
          size: 10, // 每页数据的数量,默认10
        },
        noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
        empty: {
          use: true,
          tip: "暂无相关数据",
          btnText: "抢沙发",
        },
      },
    };
  },
  components: {
    IndexFloor,
    NavigatorBar,
    PostComment,
    PostBar,
    PopupBottom,
    MyShowToast
  },
  methods: {
    //点击原帖子发布一级评论--通过全局事件总线
    createFirstComment() {
      this.$bus.$emit(CREATEFIRSTCOMMENT);
      uni.vibrateShort({
        success: function () {
          console.log("success");
        },
      });
    },
    //点击更多的函数
    bandleMoreBtn() {
      // 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
      this.$refs.popup.open("bottom");
    },
    //关闭遮罩
    close() {
      this.$refs.popup.close();
    },
    //获取帖子的一级评论
    getCommentList(articleId, page, size) {
      return getCommentList(articleId, page, size).then(
        (res) => {
          this.maxPageNum = res.data.data.maxPageNum;
          let firstList = [];
          for (let item of res.data.data.detail) {
            let firstCommentObj = {};
            firstCommentObj.userHeader = item.userDetail.photoPath;
            firstCommentObj.userName = item.userDetail.nickname;
            firstCommentObj.postDate = item.comment.date;
            firstCommentObj.likedNum = item.comment.likedNum;
            firstCommentObj.content = item.comment.content;
            firstCommentObj.commentId = item.comment.commentId;
            firstCommentObj.like = item.like;
            firstList.push(firstCommentObj);
          }
          this.firstComment.push(...firstList);
          this.page++; //加载完一页了
          return Promise.resolve(1);
        },
        (err) => {
          console.log(err);
          return Promise.reject(1);
        }
      );
    },
    //取消帖子的点赞
    unlikeIt(articleId) {
      this.$bus.$emit(SYCNLIKE, articleId, false); //同步点赞
      setUnLike({ articleId }).then(
        (res) => {},
        (err) => {
          console.log(err);
        }
      );
    },
    // 给帖子点赞
    likeIt(articleId) {
      this.$bus.$emit(SYCNLIKE, articleId, true); //同步点赞
      setLike({ articleId }).then(
        (res) => {},
        (err) => {
          console.log(err);
        }
      );
    },
    //给评论点赞
    setCommentLike(commentId) {
      setCommentLike({ commentId }).then(
        (res) => {},
        (err) => {
          console.log(err);
        }
      );
    },
    //取消评论的点赞
    setCommentUnLike(commentId) {
      setCommentUnLike({ commentId }).then(
        (res) => {},
        (err) => {
          console.log(err);
        }
      );
    },
    //发布评论,并且更新评论
    submitReply(CommentMes) {
      //等登陆做好改成真实的个人信息
      let firstCommentObj = {};
      uni.getStorage({
        key: "userInfo",
        success: (data) => {
          firstCommentObj.userHeader = data.data.photoPath;
          firstCommentObj.userName = data.data.nickname;
        },
      });
      firstCommentObj.postDate = new Date().format("MM/dd");
      firstCommentObj.likedNum = 0;
      firstCommentObj.content = CommentMes.content;
      firstCommentObj.commentId = CommentMes.commentId;
      firstCommentObj.like = false;
      this.firstComment.push(firstCommentObj);
    },
    //返回按钮
    switchBackTab() {
      uni.navigateBack({
        delta: 1,
      });
    },
    /*下拉刷新的回调 */
    downCallback() {
      this.mescroll.resetUpScroll();
    },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      getCommentList(this.articleId, page.size, page.num)
        .then((res) => {
          //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          this.mescroll.endSuccess(res.data.data.detail.length);
          //方法一(推荐): 后台接口有返回列表的总页数 totalPage
          this.mescroll.endByPage(
            res.data.data.detail.length,
            res.data.data.maxPageNum
          );
          //设置列表数据
          if (page.num == 1) this.firstComment = []; //如果是第一页需手动制空列表
          let firstList = [];
          for (let item of res.data.data.detail) {
            let firstCommentObj = {};
            firstCommentObj.userHeader = item.userDetail.photoPath;
            firstCommentObj.userName = item.userDetail.nickname;
            firstCommentObj.postDate = item.comment.date;
            firstCommentObj.likedNum = item.comment.likedNum;
            firstCommentObj.content = item.comment.content;
            firstCommentObj.commentId = item.comment.commentId;
            firstCommentObj.like = item.like;
            firstList.push(firstCommentObj);
          }
          this.firstComment.push(...firstList); //追加新数据
        })
        .catch(() => {
          //联网失败, 结束加载
          this.mescroll.endErr();
        });
    },
    //点击空布局按钮的回调
    emptyClick() {
      this.$bus.$emit(CREATEFIRSTCOMMENT);
      uni.vibrateShort({
        success: function () {
          console.log("success");
        },
      });
    },
  },
  //获取参数
  onLoad(option) {
    let userDetail = JSON.parse(option.userDetail);
    this.articleId = userDetail.articleId;
    this.detail.tagList = userDetail.tagList;
  },
  //页面挂载时候对数据进行获取展示
  mounted() {
    getPostDetail(this.articleId).then(
      (res) => {
        let { userDetail } = res.data.data;
        let { articleInfo } = res.data.data;
        let { photoInfos } = res.data.data;
        for (let i = 0; i < photoInfos.length; i++) {
          this.detail.postImages.push(photoInfos[i].location);
        }
        this.detail.postText = articleInfo.summary;
        this.detail.likedNum = articleInfo.likedNum;
        this.detail.commentNum = articleInfo.commentNum;
        this.detail.sharedNum = articleInfo.sharedNum;
        this.detail.postTime = new Date(articleInfo.date).format("MM/dd");
        this.detail.userHeader = userDetail.userInfo.photoPath;
        this.detail.userName = userDetail.userInfo.nickname;
        this.detail.articleId = articleInfo.articleId;
        this.detail.like = res.data.data.like;
      },
      (err) => {
        console.log(err);
      }
    );
  },
};
</script>

<style scoped>
.scrollY {
  margin-top: 80rpx;
  padding-top: 80rpx;
  height: 94vh;
}
.split_line {
  border-radius: 12px 12px 0px 0px;
  height: 70rpx;
  border-bottom: #fdf8f0 2px solid;
  line-height: 70rpx;
  color: #5b5b5b;
  padding-left: 62rpx;
}
.split_line h5 {
  font-size: 16px;
  font-weight: bold;
}
</style>
