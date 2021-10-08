<template>
	<view class = "content1">
		<view class="welcome">
			<text class="welcome_text">Welcome to</text>
		</view>
		<view class="BBS">
			<text class="BBS_text">BBS</text>
		</view>
		<view class="loginAfter" :animation="imgsuoxiao">
			<image class="img" src="../../../UI/Login.png" ></image>
		</view>
		<view class="inputWrapper">
			<view :class="isEmpty ? 'Eminput' :'input'">
				<input class="Input" v-model="username" value="" type="text" @input="noEmpty" placeholder="校园网账号"/>
			</view>
		</view>
		<view class="emptyTips">
			<text :class="isEmpty ? 'empty':'NoEmpty'" >请输入您的校园网账号</text>
		</view>
		<view class="inputWrapper">
			<view class="input">
				<input class="Input" :type="showPass ? 'text' : 'password'" placeholder="校园网账号密码" v-model="password" @input="isRight" />
				<!-- <input class="Input" v-model="pwd" value="" type="password" placeholder="请输入密码"  /> -->
			</view>
		</view>
		<view class="emptyTips">
		<!-- 弹出提醒 -->
			<text :class="isWrong ? 'empty':'NoEmpty'" >账号或密码错误，请检查后重新输入</text>
		</view>
		<image :src="showPass ? src1 : src2" @tap="showEye" class="eye"></image>
		<view class="btnAfter">
			<button class="loginbtn" @click="verify">
				验  证
			</button>
		</view>
	</view>
</template>


<style>
	.content1{
		width: 100vw;
		height: 100vh;
		justify-content: center;
		align-items: flex-end;
	}
	.welcome{
		width: 280rpx;
		height: 64rpx;
		display: flex;
		/* justify-content: center;
		align-items: flex-end; */
		padding: 0 240rpx;
		margin-top: 140rpx;
	}
	.BBS{
		width: 132rpx;
		height: 96rpx;
		display: flex;
		justify-content: center;
		align-items: flex-end;
		padding: 0 304rpx;
		margin-top: 10rpx;
	}
	.loginAfter{
		height: 626rpx;
		width: 750rpx;
	}
	.btnAfter{
		margin-top: 50rpx;
	}
	.img{
		width: 100%;
		height: 100%;
	}
	.welcome .welcome_text{
		color: #FFD2A2;
		font-family: Microsoft YaHei;
		font-weight: regular;
		line-height: normal;
		font-size: 48rpx;
	}
	.BBS_text{
		color: #EBA284;
		font-family: Microsoft YaHei;
		font-weight: regular;
		font-size: 72rpx;
		line-height: normal;
	}
	.loginbtn {
		width: 668rpx;
		height: 94rpx;
		display: inline-block;
		margin-left: 40rpx;
		font-size: 48rpx;
		line-height: 52rpx;
		cursor: pointer;
		padding: 15rpx 0;
		text-align: center;  
		justify-content: center;
		text-decoration: none;
		outline: none;
		color: #fff;
		background-color: #EFBE86;
		border: none;
		border-radius: 20rpx;
	}
	.Ashow{
		opacity: 1;
	}
	.inputWrapper{
		height: 86rpx;
		padding: 0 5.5%;
		margin-top: 1.5%;
	}
	.inputWrapper .input{
		width: 100%;
		height: 100%;
		background: white;
		border-radius: 20rpx;
		box-sizing: border-box;
		border-style:solid;
		border-color: #C4C4C4;
		border-width: 1rpx;
		padding: 2% 0; 
	}
	.inputWrapper .Eminput{
		width: 100%;
		height: 100%;
		background: white;
		border-radius: 20rpx;
		box-sizing: border-box;
		border-style:solid;
		border-color: #EBA284;
		border-width: 1rpx;
		padding: 2% 0; 
	}
	.inputWrapper .Input{
		width: 80%;
		height: 100%;
		box-sizing: border-box;
		border-style:none;
		font-size: 32rpx;
		line-height: 34rpx;
		margin-left: 5.5%;
	}
	.eye{
		height: 34rpx;
		width: 44rpx;
		overflow: hidden;
		position: relative;
		z-index: 1;
		left: 85.6%;
		top: -90rpx;
	}

	.emptyTips{
		height: 32rpx;
		width: 100%;
		margin-left: 10%;
	}
	.empty{
		color: #EBA284;
		font-size: 24rpx;
	}
	.NoEmpty{
		color: #EBA284;
		font-size: 24rpx;
		display: none;
	}
	
	
</style>

<script>
	import {
		initPassword,
	} from "../../../axios/login/login.js";
	export default {
		data() {
			return {
				showPass: false,
				isEmpty: false,
				isWrong: false,
				src1: "../../../../static/icons/login/Leye.png",
				src2: "../../../../static/icons/login/Heye.png",
				username:'',
				password:'',
				animationData:{},
				imgsuoxiao:{},
			}
		},

		methods: {
			showEye(){
				// 显示密码
				this.showPass=!this.showPass;
			},
			noEmpty(){
				//判断用户名是否为空
				if (this.username == ""){
					this.isEmpty = true;
				}
				else{
					this.isEmpty = false;
				}
			},
			isRight(){
				if(this.username&&this.password){
					this.isWrong = false;
				}
				else if(!this.username&&this.password){
					this.isWrong = false;
					this.isEmpty = true;
				}
			},
			initPassword(username,password){
				return initPassword({username,password}).then(
				(res) => {
					let nowstate = [];
					nowstate = res.data.state;
					console.log(nowstate);
					if(nowstate == 200){
						uni.showToast({
							title: '验证成功',
							duration: 1500
						});
						//缓存原密码
						uni.setStorage({
							key:"initpwd",
							data: this.password,
							success: function() {
								console.log("ok");
							}
						});
						this.isWrong = false;
						setTimeout(function(){
						uni.navigateTo({
							url:"../../level3/login/modify"
						})
						},1000);
					 }
					else{
						this.isWrong = true;
					}
					},
					(err) => {
						console.log(err);
					});
			},
			
			verify(){
				this.noEmpty();
				this.isRight();
				this.initPassword(this.username,this.password);
				
			},
		},
	}
</script>