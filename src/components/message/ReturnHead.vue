<template>
	<view class="release-head">
		<view>
			<text class="iconfont icon-zuojiantou release-head-icon" @tap="handleToBack"></text>
		    <text class="release-complete">{{complete}}</text>
		</view>
		
		{{title}}
		
	</view>
</template>
 
<script>
	export default {
		name:"ReturnHead",
		data() {
			return {
				
			};
		},
		props:['title','complete'],
		methods:{
			handleToBack(){
				uni.navigateBack({
					 delta: 1
				});
			}
		}
	}
</script>

<style scoped>
@import url("../../../static/icons/iconfont/iconfont.css"); 
.release-head{
	width: 100%;
	height: 60px;
	font-size: 18px;
	line-height: 120px;
	text-align: center;
	color: black;
	position: relative;
	} 
.release-head-icon{
	position: absolute;
	left: 6rpx;
	width: 45px;
	height: 60px;	
	}
.release-complete{
	position: absolute;
	right: 42rpx;
	height: 60px;
	color:	#EE9A49;
	font-size: 34rpx;
	}  
</style>
