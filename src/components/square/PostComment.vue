<template>
  <!-- 楼层 开始 -->
  <view class="index_floor">
    <view class="floor_item">
      <!--个人信息开始-->
      <view class="floor_person">
        <view class="person_detial">
          <view class="admin_pic">
            <img v-bind:src="list.userHeader" mode="widthFix"></img>
          </view>
          <view class="admin_detial">
            <view class="admin_name">{{list.userName}}</view>
            <view class="admin_time">{{postDate}}</view>
          </view>
        </view>
		
		<view class="other_btn" >
			<view class="like_num" @click="likeIt(list.commentId)">
				<image src="../../../static/icons/square/like.png" mode="widthFix" v-if="list.like"></image>
				<image src="../../../static/icons/square/unlike.png" mode="widthFix"v-else></image>
				{{list.likedNum}}
			</view>
		</view>	
      </view>
	   <!--个人信息结束-->
	   <!-- 评论的信息开始 -->
	   <view class="comment_conten">
			<view class="first_commn" @click="replyFirstComment">
				{{list.content}}
			</view>
			<view class="second_comment"  :style="{overflow:(isShowAllComment?'visible':'hidden'),height:(isShowAllComment||secondComment.length==0?'100%':'180rpx')} ">
				<view v-for="(item,index) in secondComment" @click="replyPerson(item)" :key="index">
					<view class="someone_reply"  v-if="item.replyName">
						<text class="replier_name">{{item.userName}}</text>回复<text class="replier_name">{{item.replyName}}</text><text class="reply_content">:{{item.content}}</text>
					</view>
					<view class="homeowner_comment" v-else>
						<text class="replier_name">{{item.userName}}</text><text class="reply_content">:{{item.content}}</text>
					</view>
				</view>
			</view>
			<view class="more_comment" @click="showAllComment" v-if="isShowAllComment">
				收起全部留言
			</view>
			<view class="more_comment" @click="showAllComment" v-else >
				查看全部留言
			</view>
	   </view>
	   <!-- 评论的信息结束 -->
    </view>
  </view>
  <!-- 楼层 结束 -->
</template>

<script>
import { getReplyList } from "../../axios/square/square.js";
import {REPLYPERSON,REPLYFIRSTCOMMENT,REFLASHSECONDCOMMENT} from "../../pages/constant"
export default {
  name: "PostComment",
  data() {
    return {
      list: {
        //一级评论的信息
        // userHeader:
        //   "https://img0.baidu.com/it/u=1864423972,3928623372&fm=26&fmt=auto&gp=0.jpg",
        // userName: "小黑呀",
        // postDate: "",
        // likedNum: 0,
        // content: "123456",
        // commentId:1
      },
      isShowAllComment: false, //展示所有的评论与否
      userDetail: {
        //回复的用户信息保留
        uid: [],
        userName: [],
      },
      secondComment: [], //二级评论
      loadSize: 20, //二级评论一次的加载数量
      page: 1, //当前二级评论的加载页数
      maxPageNum: 1, //最多有多少页的二级评论
    };
  },
  props: ["firstComment"],
  methods: {
    //回复二级评论---通过全局事件总线
    replyPerson(data) {
      this.$bus.$emit(REPLYPERSON, data);
	  uni.vibrateShort({
	  	success: function () {
	  		console.log('success');
	  	}
	  });
    },
    //回复一级评论---通过全局事件总线
    replyFirstComment() {
      let { commentId, userName } = this.list;
      let detailObj = { commentId, userName };
      this.$bus.$emit(REPLYFIRSTCOMMENT, detailObj);
	  uni.vibrateShort({
	  	success: function () {
	  		console.log('success');
	  	}
	  });
    },
    // 展示所有评论
    showAllComment() {
      this.isShowAllComment = !this.isShowAllComment;
      for (let i = this.page; i <= this.maxPageNum; i++) {
        this.getReplyList(this.list.commentId, this.loadSize, this.page);
      }
    },
    //点赞与取消点赞
    likeIt(commentId) {
		let isLogin=false;
		new Promise((resolve,reject)=>{
				  uni.getStorage({
				  	key:"userInfo",
				  		success:(data)=>{
				  			this.userInfo=data;
				  			isLogin=true;
							resolve(1);
				  		},
				  		fail:()=> {
				  			uni.showModal({
				  				title:"您还没有登陆不能发布评论，点击确定现在去登陆",
				  				success(res) {
				  					 if (res.confirm) {
				  					   console.log("跳转到登陆页面")
				  					   uni.reLaunch({
				  							url:"/src/pages/level1/login/login",
				  							success() {
				  								console.log("跳转成功")
				  							},
				  							fail(data) {
				  								console.log("跳转失败",data)
				  							}
				  					   })
				  					 } else if (res.cancel) {
				  					     console.log('用户点击取消');
				  					 }
				  					}
				  				})
							reject(1);
				  		}
				  })
		}).then(res=>{
			if(!isLogin){
						return;
					}
			console.log(commentId);
			if (this.list.like) {
			  this.list.likedNum--;
			  this.$emit("unlikeIt", commentId);
			} else {
			  this.list.likedNum++;
			  this.$emit("likeIt", commentId);
			}
			this.list.like = !this.list.like; //状态取反
		}).catch(err=>{
			console.log(err);
		})
    },
    // 获取帖子的二级评论
    getReplyList(commentId, size, page) {
      getReplyList(commentId, size, page).then(
        (res) => {
          this.maxPageNum = res.data.data.maxPageNum;
          let { detail } = res.data.data;

          for (let item of detail) {
            let secondCommentObj = {};
            this.userDetail.uid.push(item.userDetail.uid);
            this.userDetail.userName.push(item.userDetail.nickname);
            secondCommentObj.userName = item.userDetail.nickname;
            secondCommentObj.content = item.reply.content;
            secondCommentObj.replyId = item.reply.replyId;
            secondCommentObj.commentId = item.reply.commentId;
            secondCommentObj.uid = item.reply.uid;
            if (item.reply.replyId) {
              secondCommentObj.replyName =
                this.userDetail.userName[
                  this.userDetail.uid.indexOf(item.reply.replyId)
                ];
            }
            this.secondComment.push(secondCommentObj);
          }
          this.page++;
        },
        (err) => {
          console.log(err);
        }
      );
    },
  },
  computed: {
    //转化一下时间
    postDate() {
      let date = new Date(this.list.postDate);
      return date.format("MM/dd");
    },
  },
  mounted() {
    //将父组件传入的数据更新到状态中
    this.list = this.firstComment;
    //页面挂载直接加载一定的二级评论上来
    this.getReplyList(this.list.commentId, this.loadSize, this.page);
    //监听是否有新的评论发布--这里是二级评论啊
    this.$bus.$on(REFLASHSECONDCOMMENT, (data) => {
		if(this.firstComment.commentId===data.commentId){
			new Promise((resolve,reject)=>{
				uni.getStorage({
					key:"userInfo",
						success:(res)=>{
								data.uid=res.data.uid;
								data.userName=res.data.nickname;
								this.userDetail.uid.push(res.data.uid);
								this.userDetail.userName.push(res.data.nickname);
								resolve(1);
						},
						fail: (err) => {
							reject(1)
						}
				})
			}).then(res=>{
				if(data.replyId) {
					data.replyName = this.userDetail.userName[this.userDetail.uid.indexOf(data.replyId)];
				}
				this.secondComment.push(data);
			}).catch(err=>{
				console.log(err);
			})
		}
    });
  },
  beforeDestroy() {
  	this.$bus.$off(REFLASHSECONDCOMMENT);
  }
};
</script>
<style scoped>
/* 个人信息的开始 */
.index_floor {
}
.floor_person {
  margin: 20rpx -19rpx 0 0;
  height: 80rpx;
}
.floor_item {
  padding: 0 23px 0 16px;
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
  line-height: 16px;
  display: inline-block;
  font-size: 16px;
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
  margin-right: 58rpx;
}

.grade image {
  width: 29px;
  height: 29px;
}

.like_num {

}
.like_num image {
  padding-right: 5px;
  vertical-align: middle;
  width: 30rpx;
}
/* 个人信息的结束 */
/* 评论信息的开始 */
.comment_conten {
  width: 100%;
}
.first_commn {
  margin-left: 110rpx;
  margin-bottom: 30rpx;
  color: #000000;
  font-size: 14px;
  font-weight: 800;
}
.second_comment {
  width: 500rpx;
  height: 180rpx;
  overflow: hidden;
  margin-left: 90rpx;
  background-color: #fdf7ef;
  padding: 0 20rpx 18rpx 20rpx;
  border-radius: 20rpx;
  font-size: 12px;
}
.homeowner_comment {
  padding: 18rpx 0 0 0;
}
.someone_reply {
  padding: 18rpx 0 0 0;
}
.replier_name {
  color: #f69c7d;
}
.reply_content {
  word-break: break-all;
}
.more_comment {
  /* margin-left: 100px; */
  text-align: right;
  font-size: 10px;
  font-weight: 600;
  margin-top: 20rpx;
  padding-right: 40rpx;
}
/* 评论信息的结束 */
</style>
