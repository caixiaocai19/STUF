<template>
	<view>
		<ReturnHead title="标签" complete=""></ReturnHead>
		<text class="release-complete" @tap="keepToBack">完成</text>
		<view class="back-ground">
			<view class="entire">
				<input 
					class="type"
					type="text" 
					placeholder="输入你的标签" 
					maxlength="12" 
					v-on:keyup="content()"
					v-on:compositionstart="importStart()"
					v-on:compositionend="importEnd()"
					v-model="payload.content"
					
					/>
				<view class="line"></view>
				<view class="rule">
					<text>{{conterNum}}/12</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ReturnHead from '../../../components/message/ReturnHead.vue'
	import{
		getAddLabel,
	}from "../../../axios/message/message.js";
	export default {
		onLoad: function(e){
			if(e.itemList!=null){
			this.itemList=JSON.parse(e.itemList);
			}
		},
		data() {
			return{
				payload:{
					content: '',
						  },
                conterNum: 0,
				cInput: false,
				itemList:[],
					  }

		},
		components: {
			  ReturnHead
		},
		methods:{
			content() {
				let self = this;
				if (self.cInput == false) {
				self.conterNum = self.payload.content.length;
				
			}
				// console.log(self.payload.content);
				return self.payload.content;				
			},
			importStart() {
				this.cInput = true;
				},
			importEnd() { 
				this.cInput = false;
				this.write();
				},
			//添加标签
			getAddLabel(labelTypeId,content){
				return getAddLabel({labelTypeId,content}).then(
					(res) => {
						// console.log(111);
						},
					(err) => {
					  console.log(err);
					}
				)
			},
			keepToBack(){
				// this.value = e.detail;
				// var x=value.value;
				this.getAddLabel(6,this.payload.content);
				this.itemList.push(
					this.payload.content
				);
				  
				console.log(this.content());
				console.log(this.itemList);
				uni.showToast({
					title: '完成',
					duration: 2000
				});
				let labellabel=encodeURIComponent(JSON.stringify(this.itemList));
				setTimeout(function(){
				uni.navigateTo({
				    url:'../../level2/message/releaseLabel?label='+labellabel
				})
				},1000);
			}
		 
		 }
		
		};
</script>

<style scoped>
.release-complete{
	position: relative;
	top: -20rpx;
	left: 642rpx;
	color:	#EE9A49;
	font-size: 34rpx;
	}
.back-ground{
	background-color: 	#fdf7ef;
	width: 100%;
	height: 100vh;
	margin-top: 0rpx;
}
.entire{
	position: relative;
	top: 56rpx;
	width: 84%;
	left: 8%;
	right: 8%;
}
.line{
	border-bottom: 3rpx solid #E4E4E4;	
}
.type{
	font-size: 39rpx;
	margin-bottom: 10rpx;
}
.rule{
	width: 100%;
	text-align: right;
	margin-top: 8rpx;
	color: #B0B0B0;
	font-size: 30rpx;
}
</style>
