<!-- 头部标题栏 -->
<template>
  <view class="navigatorBar">
 	<view class="left">
  		<slot name="left"></slot>
  	</view>
	<view class="center">
		<slot name="center"></slot>
	</view>
	<view class="right">
		<slot name="right"></slot>
	</view>
  </view>
</template>

<script>
export default {
name:'NavigatorBar',
  data () {
    return {
		
    };
  }
}

</script>
<style scoped>
.navigatorBar{
	padding-top:40px ;
	z-index: 9;
	position: fixed;
	top: 0;
	background-color: #ffffff;
    justify-content: space-between;
	align-content: center;
	font-weight: bolder;
    display: flex;
    width: 100%;
	border-bottom: 2px solid #ececec;
	padding-bottom: 10rpx;
}
.right{
	text-align: right;
	margin-right: 30rpx;
}
.center{
	text-align: center;
}
.left{
	margin-left: 30rpx;
}
</style>