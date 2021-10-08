<!-- 发布界面 -->
<template>
  <view class="message">
    <!-- 头部导航栏开始 -->
    <Navigator-bar>
      <view slot="left">
        <image
          src="../../../../static/icons/message/delete.png"
          mode="heightFix"
          style="height: 30rpx; vertical-align: middle"
          @click="goBack"
        />
      </view>
      <view slot="right" @click="postInfo">
        <view
          style="
            padding: 0 10px;
            height: 48rpx;
            background-color: #eba284;
            line-height: 48rpx;
            text-align: center;
            border-radius: 48rpx;
            color: #ffff;
            font-size: 24rpx;
            font-weight: 400;
          "
        >
          发布
        </view>
      </view>
    </Navigator-bar>
    <!-- 头部导航栏结束 -->
    <!-- 标签栏开始 -->
    <!-- <view class="label_bar">
      <view class="label_list">
        <view
          class="label_item"
          @click="chooseLabels"
          v-for="(item, index) in labels"
          ># {{ item.content }}</view
        >
      </view>
      <view class="submit" @click="postInfo"><text>发布</text></view>
    </view> -->
    <!-- 标签栏结束 -->
    <!-- 文本输入框开始 -->
    <view mes_text>
      <textarea class="text" placeholder="分享你的快乐" v-model="content" />
    </view>
    <view class="mes_pic">
      <view class="mes_pic_item" v-for="(item, index) in imgList">
        <image class="mes_pic_item_pic" :src="item" @click="lookImg(index)" />
        <image
          class="delete_pic"
          src="../../../../static/icons/message/close.png"
          mode="heightFix"
          @click="delect(index)"
        />
      </view>
    </view>
    <!-- 文本输入框结束 -->
    <!-- 上传涂片开始 -->
    <add-pic-bar @chooseImage="chooseImage"></add-pic-bar>
    <!-- 上传涂片结束 -->
    <!-- 标签栏开始 -->
    <view class="label_bar">
      <view class="label_list">
        <view
          class="label_item"
          @click="chooseLabels"
          v-for="(item, index) in labels"
          ># {{ item.content }}</view
        >
      </view>
    </view>
    <!-- 标签栏结束 -->
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
import NavigatorBar from "../../../components/content/NavigatorBar.vue";
import AddPicBar from "../../../components/message/AddPicBar.vue";
import { postArticle, setPhoto } from "../../../axios/message/message";
import { POSTINFO, SETLABELS } from "../../constant.js";
import MyShowToast from "../../../components/common/MyShowToast/MyShowToast.vue";
import LoginNoticeMixin from "../../../components/common/MyShowToast/LoginNoticeMixin.js";
export default {
  name: "message",
  mixins: [LoginNoticeMixin],
  data() {
    return {
      imgList: [], //图片临时路径
      imageFile: [], //图片文件
      imgMaxNum: 4, //最多上传图片数量
      labels: [{ content: "选择话题" }], //标签
      content: "", //文本内容
    };
  },
  components: {
    MyShowToast,
    NavigatorBar,
    AddPicBar,
  },
  methods: {
    //选择图片
    chooseImage() {
      var _this = this;
      uni.chooseImage({
        count: 4, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["camera", "album"], //从相册选择和拍照
        success: (res) => {
          console.log(res);
          var tempFilePaths = res.tempFilePaths;
          if (_this.imgList.length + tempFilePaths.length > _this.imgMaxNum) {
            uni.showToast({
              title: "超过上传图片的最大数量",
              icon: "none",
            });
          } else {
            if (_this.imgList.length != 0) {
              _this.imgList = _this.imgList.concat(res.tempFilePaths);
              _this.imageFile = _this.imageFile.concat(res.tempFiles);
            } else {
              _this.imgList = res.tempFilePaths;
              _this.imageFile = res.tempFiles;
            }
          }
        },
      });
    },
    //查看图片
    lookImg(val) {
      const urls = this.imgList;
      const current = val;
      uni.previewImage({
        urls,
        current,
      });
    },
    //删除图片
    delect(index) {
      uni.showModal({
        title: "提示",
        content: "是否要删除该图片",
        success: (res) => {
          if (res.confirm) {
            this.imgList.splice(index, 1);
            this.imageFile.splice(index, 1);
          }
        },
      });
    },
    //发布帖子(文字部分)
    postArticle(data) {
      return postArticle(data);
    },
    //发布帖子的(图片部分)
    setPhoto(articleId, data) {
      return setPhoto(articleId, data);
    },
    //选择标签
    async chooseLabels() {
      //先获取用户的信息，判断是否登陆了
      let user = await this.isLogin();
      if (!user) {
        return;
      }
      uni.navigateTo({
        url: "../../level2/message/releaseLabel",
      });
    },
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
    //点击发布按钮发布帖子
    async postInfo() {
      //先获取用户的信息，判断是否登陆了
      let user = await this.isLogin();
      if (!user) {
        return;
      }
      let _this = this;
      if (!this.content) {
        uni.showToast({
          title: "不能发空帖噢",
          duration: 2000,
          icon: "none",
        });
        return;
      }
      let labels = []; //帖子的标签内容
      if (this.labels[0].labelId) {
        for (let i = 0; i < this.labels.length; i++) {
          labels.push({ labelId: this.labels[i].labelId });
        }
      }
      let artInfo = {
        //帖子的文本内容
        articleInfo: {
          content: this.content,
        },
        labels,
      };
      if (this.imgList.length === 0) {
        //只有文字的帖子
        this.postArticle(artInfo)
          .then((res) => {
            artInfo.articleId = res.data.data;
            artInfo.userInfo = user;
            //通过事件总线发布本地帖子 减少卡顿
            _this.$bus.$emit(POSTINFO, artInfo);
            new Promise((resolve, reject) => {
              //页面跳转到广场
              uni.switchTab({
                url: "../square/square",
                success() {
                  _this.imgList = []; //图片临时路径
                  _this.imageFile = []; //图片文件
                  _this.imgMaxNum = 4; //最多上传图片数量
                  _this.labels = [{ content: "选择话题" }]; //标签
                  _this.content = ""; //文本内容
                  resolve(1);
                },
              });
            }).then((res) => {
              uni.showToast({
                title: "发布成功",
                duration: 2000,
                icon: "none",
              });
            });
          })
          .catch((err) => {
            uni.showToast({
              title: "发布失败",
              duration: 2000,
              icon: "none",
            });
          });
      } else {
        //包含图片的帖子
        /*先发布帖子*/
        new Promise((resolve, reject) => {
          this.postArticle(artInfo).then(
            (res) => {
              resolve(res);
            },
            (err) => {
              reject(err);
            }
          );
        }).then((res) => {
          /*再发布图片*/
          let files = [];
          for (let i = 0; i < this.imageFile.length; i++) {
            files[i] = {
              name: i === 0 ? "thumbnail" : "" + i,
              file: this.imageFile[i],
              uri: this.imgList[i],
            };
          }
          this.setPhoto(res.data.data, files).then((res) => {
            artInfo.articleId = res.data.data;
            artInfo.userInfo = user;
            artInfo.thumbnailPath = _this.imgList[0];
            //通过事件总线发布本地帖子 减少卡顿
            _this.$bus.$emit(POSTINFO, artInfo);
            new Promise((resolve, reject) => {
              //页面跳转到广场
              uni.switchTab({
                url: "../square/square",
                success() {
                  _this.imgList = []; //图片临时路径
                  _this.imageFile = []; //图片文件
                  _this.imgMaxNum = 4; //最多上传图片数量
                  _this.labels = [{ content: "选择话题" }]; //标签
                  _this.content = ""; //文本内容
                  resolve(1);
                },
              });
            }).then((res) => {
              uni.showToast({
                title: "发布成功",
                duration: 2000,
                icon: "none",
              });
            });
          });
        });
      }
    },
    //返回按钮
    goBack() {
      let _this = this;
      //页面跳转到广场
      uni.switchTab({
        url: "../square/square",
        success() {
          _this.imgList = []; //图片临时路径
          _this.imageFile = []; //图片文件
          _this.imgMaxNum = 4; //最多上传图片数量
          _this.labels = [{ content: "选择话题" }]; //标签
          _this.content = ""; //文本内容
        },
      });
    },
  },
  mounted() {
    this.$bus.$on(SETLABELS, (labels) => {
      console.log(labels);
      this.labels = labels;
    });
  },
};
</script>
<style scoped>
/* 标签栏开始 */
.message {
  font-family: Microsoft YaHei;
  padding-top: 80px;
}
.label_bar {
  display: flex;
  height: 80rpx;
  line-height: 80rpx;
  align-items: center;
}
.label_list {
  margin-left: 20rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  flex: 4;
}
.label_item {
  height: 48rpx;
  border-radius: 48rpx;
  line-height: 48rpx;
  font-size: 24rpx;
  background-color: #ffebc2;
  padding: 0 28rpx;
  margin-right: 10rpx;
}
.submit {
  flex: 1;
}
.submit text {
  padding: 0 28rpx;
  color: #ffff;
  height: 48rpx;
  border-radius: 48rpx;
  line-height: 48rpx;
  background-color: #eba284;
}
/* 标签栏结束 */
/* 文本输入框开始  */
.mes_text {
  height: 400rpx;
}
.text {
  height: 400rpx;
  margin: 32rpx auto;
}
/* 文本输入框结束  */
/* 图片部分开始 */
.mes_pic {
  display: flex;
  padding: 0 53rpx;
}
.mes_pic_item {
  position: relative;
  margin-right: 18rpx;
}
.mes_pic_item_pic {
  height: 160rpx;
  width: 152rpx;
}
.delete_pic {
  height: 50rpx;
  position: absolute;
  top: -25rpx;
  right: -25rpx;
  z-index: 10;
}
/* 图片部分结束 */
</style>