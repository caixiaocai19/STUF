<template>
  <view class="Followee" >
  	<navigator-bar>
		<view slot="left">
				   <image
				   src="../../../../static/icons/profile/return.png"
				   mode="widthFix"
				   style="width: 20px; vertical-align: middle; display: inline-block"
				   ></image>
		</view>
		<view slot="center" >
			<text class="commentText">评论</text>
		</view>
    </navigator-bar> 
	<scroll-view scroll-y="true" class="scrollY">
	<comment v-for="(item, index) in posts[activeType].list"
        :list="item"></comment>
	</scroll-view>
  </view>
</template>

<script>
	import comment from '../../../components/profile/Comment.vue'
	import navigatorBar from "../../../components/content/NavigatorBar.vue";	
	export default {
	  data(){
		  return{
			  posts: {
			    follow: {
			      list: [
			        {
			          userHeader:
			            "https://img0.baidu.com/it/u=1864423972,3928623372&fm=26&fmt=auto&gp=0.jpg",
			          userName: "这是用户名",
			          comment:"这个照片好好看",
			          commentTime:"10-30  10:20"
					  
			        },
					{
					  userHeader:
					    "https://img0.baidu.com/it/u=1864423972,3928623372&fm=26&fmt=auto&gp=0.jpg",
					  userName: "这是用户名",
					  comment:"这个照片好好看",
					  commentTime:"10-30  10:20"
					  
					},
					{
					userHeader:
					  "https://img0.baidu.com/it/u=1864423972,3928623372&fm=26&fmt=auto&gp=0.jpg",
					userName: "这是用户名",
					comment:"这个照片好好看",
					commentTime:"10-30  10:20"
					},
					{
					userHeader:
					  "https://img0.baidu.com/it/u=1864423972,3928623372&fm=26&fmt=auto&gp=0.jpg",
					userName: "这是用户名",
					comment:"这个照片好好看",
					commentTime:"10-30  10:20"
					},
					{
					userHeader:
					  "https://img0.baidu.com/it/u=1864423972,3928623372&fm=26&fmt=auto&gp=0.jpg",
					userName: "这是用户名",
					comment:"这个照片好好看",
					commentTime:"10-30  10:20"
					},
					{
					userHeader:
					  "https://img0.baidu.com/it/u=1864423972,3928623372&fm=26&fmt=auto&gp=0.jpg",
					userName: "这是用户名",
					comment:"这个照片好好看",
					commentTime:"10-30  10:20"
					},
					{
					userHeader:
					  "https://img0.baidu.com/it/u=1864423972,3928623372&fm=26&fmt=auto&gp=0.jpg",
					userName: "这是用户名",
					comment:"这个照片好好看",
					commentTime:"10-30  10:20"
					},
			      ],
			    },
			  },
			   activeType: "follow",
			};
		},
		
	  components: {
		  navigatorBar,
		  comment,
	  },
	
	};
</script>

<style scoped>
	.scrollY {
	  margin-top: 80rpx;
	  padding-top: 80rpx;
	  height: 94vh;
	}
	::-webkit-scrollbar {
	  width: 0;
	  height: 0;
	  background-color: transparent;
	}
	.commentText{
		font-size:17px; 
		/* opacity:0.9; */
	}
</style>
