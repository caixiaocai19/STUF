<template>
	<view>
		<ReturnHead title="修改密码" complete=""></ReturnHead>
		<text class="release-complete" @tap="keepToBack">完成</text>
		<view class="back-ground">
			<!-- <text>{{itemList}}</text> -->
			<!-- <view>
				<text class="psw">原密码</text>
				<view class="entire">			
				<input 
					class="type"
					type="text" 
					placeholder="填写原密码" 
					maxlength="12"
					v-model="Initpsw"
					@input="cancelInitTips"
										
					/>
				<view class="line"></view>
				<!-- 输入提醒 -->
				<!-- <view class="emptyTips"> 
					<text :class="isInitEmpty ? 'uesr_empty':'user_NoEmpty'" >请输入正确的原密码</text>
				</view>
			    </view>
			</view> --> 
			<view class="line-place">
				<text class="psw">新密码</text>
				<view class="entire">			
				<input 
					class="type"
					type="text" 
					placeholder="填写新密码" 
					maxlength="12" 
					v-model="Newpsw"
					@input="cancelNewTips"							
					/>
				<view class="line"></view>
				<!-- 输入提醒 -->
				<view class="emptyTips"> 
					<text :class="isNewEmpty ? 'uesr_empty':'user_NoEmpty'" >请按要求输入正确的新密码</text>
				</view>
			    </view>
			</view>
			<view class="line-place">
				<text class="psw">确认密码</text>
				<view class="entire">			
				<input 
					class="type"
					type="text" 
					placeholder="再次填写确认" 
					maxlength="12" 
					v-model="Comfirmpsw"
					@input="comfirmInput"
					@tap="newInput"
					/>
				<view class="line"></view>
				<view class="emptyTips">
					<text :class="isConfirmEmpty ? 'uesr_empty':'user_NoEmpty'" >请确认密码是否一致</text>
				</view>
			    </view>
			</view>
			<view class="rule">
				<text>密码必须是8-16位的数字、字符组合(不能是纯数字)</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	import ReturnHead from '../../../components/message/ReturnHead.vue'
	import{
		postChangePwd,
	}from "../../../axios/login/login.js";
	export default {
		data() {
			return {	
				// Initpsw:"",
				// initPassword:"",
				Newpsw:"",
				Comfirmpsw:"",
				// isInitEmpty: false,
				isNewEmpty:false,
				isConfirmEmpty:false,
				itemList:[],
				state:0
			}; 
		},
		components: {
			  ReturnHead
		},
		methods:{ 
			postChangePwd(oldPassword,newPassword){
				return postChangePwd({oldPassword,newPassword}).then(
				(res) => {
					this.itemList =res.data;
					this.state=this.itemList.state;
					if(this.Newpsw!=""&&this.Comfirmpsw!=""){
						if(!this.isNewEmpty&&!this.isConfirmEmpty){
							if(this.state==200){
						uni.showToast({
							title: '修改成功',
							duration: 1200
						});
						setTimeout(function(){
						uni.navigateTo({
							url:'../../level1/login/login'
						})
						},1000);
						}					
						else{
							uni.showToast({
								title: '请确认填写内容',
								icon:'none',
								duration: 1200
							});
							}
						}
					}	
				},
				(err) => {
				  console.log(err);
				}
				);
			},

			
			// 本行 新密码提示框的显示判断
			cancelNewTips(){
				let newpsw=this.Newpsw;				
				if(newpsw==""){
					this.isNewEmpty=true;
				}
				else{
					this.isNewEmpty=false;
				}
			},
			//判断新输入的密码是否符合要求
			newInput(){	
				// this.initInput();
				let inputvalue=this.Newpsw;
				//判断新密码是否符合要求
				let str=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(inputvalue);
				// console.log(str);
				if(str){
					this.isNewEmpty=false;
				}
				else{
					this.isNewEmpty=true;
				}
			},
		    //确认密码
			comfirmInput(){
				var comfirmpsw=this.Comfirmpsw;
				var newpsw=this.Newpsw;
				if(comfirmpsw==""||comfirmpsw!=newpsw){
					this.isConfirmEmpty=true;
				}
				else{
					this.isConfirmEmpty=false;
				}				
			},
			//页面跳转 
			keepToBack(){
				var that = this;
				var init = '';
				uni.getStorage({
					key:'initpwd',
					success: function(res) {
						init = res.data;
					}
				});
				this.postChangePwd(init,this.Newpsw);
			},			
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
	top: 10rpx;
	width: 66%;
	left: 26%;
	right: 8%;
}
.line{
	border-bottom: 3rpx solid #E4E4E4;	
}
.type{
	font-size: 34rpx;
	margin-bottom: 10rpx;
}
.psw{
	position: relative;
	left: 5%;
    top: 55rpx;
}
.line-place{
	margin-top: 10rpx;
}
.rule{
	width: 100%;
	position: relative;
	left: 5%;
	/* text-align: right; */
	margin-top: 45rpx;
	font-size: 28rpx;
}

	.emptyTips{
		height: 0rpx;
		width: 100%;
		/* margin-left: 10%; */
	}
	.uesr_empty{
		color: #EBA284;
		font-size: 24rpx;
		display: flex;
	}
	.user_NoEmpty{
		color: #EBA284;
		font-size: 24rpx;
		display: none;
	}
</style>
