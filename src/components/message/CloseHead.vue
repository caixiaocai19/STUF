<template>
	<view class="cuowu-head">
		<view class="cuowu-head-icon">
			<text class="iconfont icon-cuowu1"></text>
		</view>
		
		{{title}}
	</view>
</template>

<script>
	export default {
		name:"CloseHead",
		data() {
			return {
				
			};
		},
		props:['title'],
		}
</script>

<style scoped>
@import url("../../../static/icons/iconfont/iconfont.css"); 
.cuowu-head{
	width: 100%;
	height: 60px;
	font-size: 18px;
	line-height: 120px;
	text-align: center;
	color: black;
	position: relative;
	font-weight: bold;
}
.cuowu-head-icon{
	position: absolute;
	left: 8px;
	width: 45px;
	height: 60px;
}
</style>
