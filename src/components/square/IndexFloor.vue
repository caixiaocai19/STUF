<template>
  <!-- 楼层 开始 -->
  <view class="index_floor">
    <view class="floor_item">
      <!--个人信息-->
      <view class="floor_person">
        <view class="person_detial">
          <view class="admin_pic">
            <img v-bind:src="list.userHeader" mode="widthFix"></img>
          </view>
          <view class="admin_detial">
            <view class="admin_name">{{list.userName}}</view>
            <view class="admin_time">{{list.postTime}}</view>
          </view>
        </view>
		
		<view class="other_btn" :class="{display_none:detail}" >
			<view class="follow_btn" @click.stop="noticeIt(list.uid)" v-if="uid!==list.uid">
        <view class="followed"  v-if="$store.getters['Followee/getFollweeId'].indexOf(list.uid)!==-1">已关注</view>
        <view class="following" v-else>关注</view>
			</view>
			<view class="deleteBtn" @click.stop="deleteArticle" v-else>
				删除
			</view>
			<view class="more_btn" @click.stop="bandleMoreBtn">
				<image src="../../../static/icons/square/svg/moreBtn.svg" mode="heightFix"/>
			</view>
		</view>
		
      </view>
	  
      <view class="floor_ques">{{list.postText}}</view>
	  
	  <view class="floor_pic">
		  <view class="detail_pic" v-if="detail">
			<view class="pic_item" v-for="(item,index) in list.postImages" >
				<img :src="item" mode="widthFix" @click.stop="lookImg(index)"></img>
			</view>
		  </view>
        <img v-for="(item,index) in list.postImages" :src="item"  mode="widthFix" v-else>
      </view>
	  
      <view class="floor_type">
        <text v-for="(item,index) in list.tagList">#{{item.content}}</text>
      </view>
	  
	  
	  <view class="floor_moreOption">
	  	<view class="transmit" @click.stop="transmit">
			<image src="../../../static/icons/square/transmit.png" mode="heightFix"></image>
	  		{{list.sharedNum}}
	  	</view>
		<view class="comment">
			<image src="../../../static/icons/square/comment.png" mode="heightFix"></image>
			{{list.commentNum}}
		</view>
		<view class="like" @click.stop="likeIt(list.articleId)">
			<image src="../../../static/icons/square/like.png" mode="heightFix" v-if="list.like"></image>
			<image src="../../../static/icons/square/unlike.png" mode="heightFix" v-else></image>
			{{list.likedNum}}
		</view>
	  </view>
    </view>
  </view>
  <!-- 楼层 结束 -->
</template>

<script>
export default {
  name: "IndexFloor",
  data() {
    return {
      uid: 99999,
    };
  },
  props: {
    list: {
      type: Object,
      default() {
        return {};
      },
    },
    detail: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  methods: {
    //删除帖子
    deleteArticle() {
      let _this = this;
      let isLogin = false;
      new Promise((resolve, reject) => {
        uni.getStorage({
          key: "userInfo",
          success: (res) => {
            isLogin = true;
            resolve(1);
          },
          fail: () => {
            uni.showModal({
              title: "您还没有登陆!点击确定现在去登陆",
              success(res) {
                if (res.confirm) {
                  uni.reLaunch({
                    url: "/src/pages/level1/login/login",
                    success() {
                      console.log("跳转成功");
                    },
                    fail(data) {
                      console.log("跳转失败", data);
                    },
                  });
                } else if (res.cancel) {
                  console.log("用户点击取消");
                }
              },
            });
            reject(1);
          },
        });
      }).then((res) => {
        if (!isLogin) {
          return;
        }
        this.$bus.$emit("deletePost",this.list.articleId);
        // uni.showModal({
        //   title: "提示",
        //   content: "确认删除改帖子吗？",
        //   success: function (res) {
        //     if (res.confirm) {
        //       _this.$emit("deletePost", _this.list.articleId);
        //     } else if (res.cancel) {
        //       return;
        //     }
        //   },
        // });
      });
    },
    //点击转发函数
    transmit() {
      //调用本地的分享接口
      plus.share.sendWithSystem(
        {
          type: "text",
          content: "分享快乐 分享生活",
          href: "http://www.baidu.com",
        },
        function () {
          console.log("分享成功");
        },
        function (e) {
          console.log("分享失败：" + JSON.stringify(e));
        }
      );
    },
    //点击更多选项
    bandleMoreBtn() {
      this.$emit("bandleMoreBtn");
    },
    //点赞与取消点赞
    likeIt(postId) {
      let isLogin = false;
      new Promise((resolve, reject) => {
        uni.getStorage({
          key: "userInfo",
          success: (res) => {
            isLogin = true;
            resolve(1);
          },
          fail: () => {
            this.$bus.$emit("loginNotice");
          },
        });
      })
        .then((res) => {
          if (!isLogin) {
            return;
          }
          if (this.list.like) {
            this.list.likedNum--;
            this.$emit("unlikeIt", postId);
          } else {
            this.list.likedNum++;
            this.$emit("likeIt", postId);
          }
          this.list.like = !this.list.like; //状态取反
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //查看图片
    lookImg(val) {
      const urls = this.list.postImages;
      const current = val.index;
      uni.previewImage({
        urls,
        current,
      });
    },
    //关注与取消关注
    noticeIt(uid) {
      let isLogin = false;
      new Promise((resolve, reject) => {
        uni.getStorage({
          key: "userInfo",
          success: () => {
            isLogin = true;
            resolve(1);
          },
          fail: () => {
            this.$bus.$emit("loginNotice");
          },
        });
      })
        .then((res) => {
          let _this = this;
          if (!isLogin) {
            return;
          }
          if (
            this.$store.getters["Followee/getFollweeId"].indexOf(uid) !== -1
          ) {
            this.$bus.$emit("myShowToast", uid);
          } else {
			  uni.showLoading({
			  	title:"加载中...",
				mask:true
			  })
            this.$store.dispatch("Followee/addFollowee", uid);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    let _this = this;
    uni.getStorage({
      key: "userInfo",
      success: function (res) {
        _this.uid = res.data.uid;
      },
    });
  },
};
</script>
<style scoped>
/* 不进行展示部分东西开始 */
.display_none {
  display: none;
}
/* 不进行展示部分东西结束 */
.index_floor {
  font-family: Microsoft YaHei;
}
.floor_person {
  margin: 20rpx -40rpx 24rpx 0;
  height: 80rpx;
}
.floor_item {
  padding: 0 23px 0 16px;
  border-bottom: 12rpx solid #fff0d9;
  padding-bottom: 10px;
}
.person_detial {
  height: 80rpx;
  float: left;
  display: flex;
  align-items: center;
}
.admin_pic {
  flex: 1;
}
.admin_pic img {
  vertical-align: middle;
  box-sizing: border-box;
  width: 80rpx;
  height: 80rpx;
  border: 1px solid #8f8f94;
  border-radius: 80rpx;
}

.admin_detial {
  margin-left: 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.admin_name {
  /* height: 40rpx; */
  width: 150px;
  line-height: 40rpx;
  display: inline-block;
  font-size: 28rpx;
  color: black;
}
.admin_time {
  /* height: 40rpx; */
  line-height: 12px;
  display: inline-block;
  font-size: 12px;
  color: darkgray;
}
.other_btn {
  float: right;
  height: 80rpx;
  line-height: 80rpx;
  margin-right: 50rpx;
}

.grade image {
  width: 29px;
  height: 29px;
}

.follow_btn {
  margin-right: 46rpx;
  display: inline-block;
}
.following {
  background-color: #fff;
  padding: 0 25rpx;
  border-radius: 46rpx;
  line-height: 46rpx;
  text-align: center;
  font-size: 24rpx;
  font-weight: 400;
  border: 1px solid #eba284;
}
.followed {
  background-color: #ffebc2;
  padding: 0 25rpx;
  border-radius: 46rpx;
  line-height: 46rpx;
  text-align: center;
  font-size: 24rpx;
  font-weight: 400;
}
.deleteBtn {
  margin-right: 46rpx;
  display: inline-block;
  padding: 0 25rpx;
  border-radius: 46rpx;
  line-height: 46rpx;
  text-align: center;
  background-color: #ffebc2;
  font-size: 24rpx;
  font-weight: 400;
}
.more_btn {
  display: inline-block;
}
.more_btn image {
  height: 40rpx;
  margin-bottom: 8rpx;
  vertical-align: middle;
}
.floor_ques {
  padding: 0 28px 9px 28px;
  color: #333333;
  font-size: 14px;
  line-height: normal;
}
.floor_type {
  padding-bottom: 6px;
}
.floor_type text {
  margin: 0 8rpx;
  font-size: 24rpx;
}
.floor_type text {
  padding: 10rpx 15px 10rpx 15px;
  text-align: center;
  line-height: 28rpx;
  display: inline-block;
  font-size: 12px;
  height: 28rpx;
  border-radius: 40rpx;
  display: inline-block;
  background-color: #ffebc2;
}
.floor_pic {
  text-align: center;
  margin-bottom: 22rpx;
}
.floor_pic img {
  height: 320rpx;
  padding: 3px 5px;
}
.pic_item img {
  border-radius: 10px;
  width: 212rpx;
  height: 224rpx;
}
.detail_pic {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 456rpx;
  margin: 0 auto;
}
.pic_item {
  width: 212rpx;
  height: 224rpx;
  overflow: hidden;
}
/* 更多操作开始 */
.floor_moreOption {
  margin-top: 10px;
  margin-bottom: 20px;
  /* display: flex; */
  /* justify-content: space-around; */
  text-align: center;
  align-items: center;
}
.floor_moreOption image {
  padding-right: 5px;
  vertical-align: middle;
  height: 40rpx;
}
.transmit {
  display: inline-block;
}
.comment {
  display: inline-block;
  margin: 0 200rpx;
}
.like {
  display: inline-block;
}
/* 更多操作开始 */
</style>
