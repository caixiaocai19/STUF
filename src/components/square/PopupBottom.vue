<template>
	<view class="popup_bottom">
		<view class="popup">
			<view class="popup_item">
				<image src="../../../static/icons/square/privateLetter.png" ></image><view class="popup_text">
					私信
				</view>
			</view>
			<view class="popup_item">
				<image src="../../../static/icons/square/collent.png" ></image><view class="popup_text">
					收藏
				</view>
			</view>
			<view class="popup_item">
				<image src="../../../static/icons/square/report.png" ></image><view class="popup_text">
					举报
				</view>
			</view>
		</view>
		<view class="popup_button" @click="close">
			取消
		</view>
	</view>
</template>

<script>
export default{
		name:"PopupBottom",
		data(){
			return{
				// items:[{url:"../../../static/icons/square/privateLetter.png",name:"私信"},{url:"../../../static/icons/square/collent.png",name:"收藏"},{url:"../../../static/icons/square/report.png",name:"举报"}]
			}
		},
		methods:{
			close(){
			    this.$emit("close")
			}
		}
}
</script>

<style scoped>
	.popup_bottom{
		height: 172;
	}
	.popup{
		display: flex;
		padding:13px 0 ;
		border-radius: 10px 10px 0px 0px;
		background-color: #ffffff;
	}
	.popup:first-child{
		padding-left: 20px;
	}
	.popup_item{
		margin-right: 30px;
	}
	.popup_item image{
		width: 29px;
		height: 25px;
	}
	.popup_button{
		font-size:18px;
		font-weight: 800;
		text-align: center;
		padding-top: 20px;
		height: 40px;
		background-color: #ffebc2;
	}
</style>
