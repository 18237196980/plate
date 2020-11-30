<template>
	<view class="loginContainer">
		<view class="loginInner">
			<view class="login_header">
				<view class="login_header_title">
					<a href="javascript:;" :class="{ on: loginWay }" @click="loginWay = true">短信登录</a>
					<a href="javascript:;" :class="{ on: !loginWay }" @click="loginWay = false">密码登录</a>
				</view>
			</view>
			<!-- 内容部分 -->
			<view class="login_content">
				<form>
					<!-- 短信登录 -->
					<view :class="{ on: loginWay }" class="loginform">
						<section class="login_message">
							<input type="number" maxlength="11" placeholder-class="p-class" placeholder="手机号" v-model="phone" @input="change" />
							<button :disabled="!rightPhone" :class="[rightPhone ? 'get_verification_right_phone' : 'get_verification']" @click.stop="getCode">
								{{ second < 60 ? `(${second}s)后重新发送` : '获取验证码' }}
							</button>
						</section>
						<section class="login_verification"><input type="number" maxlength="4" placeholder-class="p-class" placeholder="验证码" v-model="code" /></section>
						<section class="login_hint">
							温馨提示：登录即表示您已阅读、理解并同意
							<br />
							<a href="javascript:;">《用户服务协议》</a>
						</section>
					</view>
					<!-- 密码登录 -->
					<view :class="{ on: !loginWay }" class="loginform">
						<section class="login_message"><input type="text" maxlength="11" placeholder-class="p-class" placeholder="手机号/用户名" v-model="name" /></section>
						<section class="login_verification">
							<input type="text" maxlength="16" placeholder="密码" placeholder-class="p-class" v-if="showPwd" v-model="pwd" />
							<input type="password" maxlength="16" placeholder="密码" placeholder-class="p-class" v-else v-model="pwd" />
							<image class="float-pwd-image" src="../../static/pwd.png" v-if="!showPwd" @click="showPwd = !showPwd"></image>
							<image class="float-pwd-image" src="../../static/pwd-open.png" v-else @click="showPwd = !showPwd"></image>
						</section>
					</view>
					<button class="login_submit" @click="login_submit">登录</button>
					<view class="goRegister" hover-class="go_reg_click" @click="toRegPage">
						免费注册
					</view>
					<view class="aline"></view>
					<view class="flex-row justify-center other-login">
						<image class="wx" src="../../static/wx.png" @click="loginByWX"></image>
						<image class="qq" src="../../static/qqq.png" @click="loginByQQ"></image>
					</view>
				</form>
			</view>
		</view>
	</view>
</template>

<script>
const api = require('@/common/api.js');
const util = require('@/common/util.js');
const auth = require('@/common/auth.js');
export default {
	name: 'Login',
	data() {
		return {
			code_flag: 1, // 登陆获取验证码标识
			loginWay: true, //true代表短信登陆, false代表密码
			phone: '', //手机号,
			second: 60, // 倒计时60s
			code: '', //验证码
			showPwd: false,
			pwd: 'abc123456',
			name: 'admin',
			rightPhone: false, // 手机号格式是否正确
			sending_flag: false // 是否正在倒计时（倒计时时修改手机号，不允许发送验证码）
		};
	},
	computed: {},
	methods: {
		loginByQQ(){
			util.showToast('开发中...');
		},
		loginByWX() {
			this.handleThirdLoginApp();
		},
		//app第三方登录
		handleThirdLoginApp() {
			var that = this;
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					// 获取用户信息
					uni.getUserInfo({
						provider: 'weixin',
						success: function(infoRes) {
							console.log('-------获取微信用户所有-----');
							console.log(JSON.stringify(infoRes.userInfo));
							var info = infoRes.userInfo;
							info.openid = loginRes.authResult.openid;
							that.loginWeiXin(info);
						}
					});
				}
			});
		},
		// 微信登陆请求后台
		async loginWeiXin(user) {
			var that = this;
			var params = {
				openid: user.openid,
				nickName: user.nickName,
				avatarUrl: user.avatarUrl,
				unionId: user.unionId
			};
			// 微信登陆
			var res = await api.loginWeiXin(params);
			if (res.code === 1) {
				auth.saveLoginInfo(res.data.user, res.data.user.id, res.data.token);
				that.gotoMain();
			} else {
				util.showToast(res.message);
			}
		},
		// 去注册
		toRegPage() {
			uni.redirectTo({
				url: '/pages/reg/reg'
			});
		},
		// 输入手机号校验
		change() {
			var input_phone = this.phone;
			if (!util.isEmpty(input_phone)) {
				this.rightPhone = util.isPhone(input_phone) && !this.sending_flag;
				if (!util.isPhone(input_phone) && input_phone.length == 11) {
					util.showToast('手机号格式不正确'); // 手机号格式错误并且是11位时，才提醒手机号格式错误（不要时时提醒）
					return;
				}
				if (input_phone.length == 11) {
					uni.hideKeyboard();
					return;
				}
			}
		},
		login_submit() {
			if (this.loginWay) {
				this.loginByPhone();
			} else {
				this.loginByPwd();
			}
		},
		// 从后台获取验证码
		async getCode() {
			console.log(this.phone);
			// 后台生成短信验证码
			var res = await api.getPhoneCode(this.phone, this.code_flag);
			if (res.code === 1) {
				util.showToast('验证码已发送'+res.data);

				this.sending_flag = true; // 在发送验证码状态
				this.rightPhone = false;

				var interval = setInterval(() => {
					let times = --this.second;
					this.second = times < 10 ? '0' + times : times; // 倒计时60s,小于10秒补 0
				}, 1000);
				setTimeout(() => {
					clearInterval(interval);
					this.sending_flag = false; // 不在发送验证码状态
					this.second = 60;
					this.rightPhone = true;
				}, 60000); // 60s后可重新发送验证码
			} else {
				util.showToast(res.message);
			}
		},
		async loginByPhone() {
			var that = this;
			if (util.isEmpty(this.phone)) {
				util.showToast('手机号不能为空');
				return;
			}
			if (util.isEmpty(this.code)) {
				util.showToast('验证码不能为空');
				return;
			}
			// 后台生成短信验证码
			var res = await api.loginByPhone(this.phone, this.code);
			if (res.code === 1) {
				util.showToast('登陆成功');
				auth.saveLoginInfo(res.data.user, res.data.user.id, res.data.token);
				setTimeout(function() {
					that.gotoMain();
				}, 200);
			} else {
				util.showToast(res.message);
			}
		},

		async loginByPwd() {
			var that = this;
			if (util.isEmpty(that.name)) {
				util.showToast('用户名不能为空!');
				return;
			}
			if (util.isEmpty(that.pwd)) {
				util.showToast('密码不能为空!');
				return;
			}
			var user = {
				username: that.name,
				password: that.pwd
			};
			let res = await api.loginByPwd(user);
			if (res.code === 1) {
				auth.saveLoginInfo(res.data.user, res.data.user.id, res.data.token);
				util.showToast('登陆成功');
				setTimeout(function() {
					that.gotoMain();
				}, 200);
			} else {
				util.showToast(res.message);
			}
		},
		// 跳转到首页
		gotoMain() {
			uni.switchTab({
				url: '/pages/main/index/index'
			});
		}
	}
};
</script>

<style scoped>
.aline {
    background-color:#f5f4f4;
    height:1px;
	margin-top: 120upx;
}
.other-login {
	align-items: center;
	margin-top: 40upx;
}
.other-login image {
	width: 100upx;
	height: 100upx;
}
.wx{
	margin-right: 30upx;
}
.qq{
	margin-left: 30upx;
}

.float-pwd-image {
	width: 50upx;
	height: 40upx;

	position: absolute;
	top: 50%;
	right: 10px;
	transform: translateY(-50%);
	border: none;
	background: transparent;
	z-index: 399;
}

/* 去注册 */
.goRegister {
	display: flex;
	justify-content: center;
	align-items: center;
	
	width: 150upx;
	height: 50upx;
	float: right;
	margin: 30upx 0;
	font-size: 30upx;
	font-weight: 500;
	color: #a6a7a1;
}

.go_reg_click {
	color: #0c61fe;
}

.loginContainer {
	width: 100%;
	height: 100%;
	background: #fff;
}

.loginInner {
	width: 80%;
	margin: 0 auto;
	padding-top: 120upx;
}

.loginInner .login_header .login_logo {
	color: #0faeff;
	font-weight: bolder;
	font-size: 80upx;
	text-align: center;
}

.login_header .login_header_title {
	text-align: center;
	padding-top: 80upx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.login_header_title a {
	text-decoration: none;
	font-size: 28upx;
	color: #333;
	padding-bottom: 8upx;
}

.login_header_title a:first-child {
	margin-right: 80upx;
}

.login_header_title a.on {
	color: #0faeff;
	font-weight: bolder;
	border-bottom: 4upx solid #0faeff;
}

.login_content form .loginform {
	display: none;
}

.login_content form .loginform.on {
	display: block;
}

.login_content form input {
	width: 100%;
	height: 100%;
	border: 1px solid #ddd;
	border-radius: 8upx;
	outline: none;
	padding-left: 20upx;
	box-sizing: border-box;
}

/* .login_content form input:focus {
	border: 2upx solid #0faeff;
} */

.login_message {
	position: relative;
	margin-top: 32upx;
	height: 96upx;
	font-size: 28upx;
	background: #fff;
}

.get_verification {
	position: absolute;
	top: 50%;
	right: 20upx;
	transform: translateY(-50%);
	border: none;
	color: #ccc;
	background: transparent;
	font-size: 28upx;
	z-index: 200;
}

.get_verification_right_phone {
	z-index: 200;
	position: absolute;
	top: 50%;
	right: 10px;
	transform: translateY(-50%);
	border: none;
	background: transparent;
	font-size: 28upx;
	color: #4dab01;
}

.login_hint {
	text-align: center;
	color: #999;
	margin-top: 28upx;
	font-size: 28upx;
	line-height: 40upx;
}

.login_hint a {
	text-decoration: none;
	color: #0faeff;
}

.login_verification {
	position: relative;
	margin-top: 32upx;
	height: 96upx;
	font-size: 28upx;
	background: #fff;
}

.login_verification .switch_button {
	border: 2upx solid #ddd;
	width: 60upx;
	height: 32upx;
	position: absolute;
	top: 50%;
	right: 20upx;
	transform: translateY(-50%);
	border-radius: 16upx;
	padding: 0 12upx;
	line-height: 32upx;
	font-size: 24upx;
	transition: background-color 0.3s;
}

.login_verification .switch_button.on {
	background: #0faeff;
}

.login_verification .switch_button.off {
	background: #fff;
}

.switch_button .switch_circle {
	background: #fff;
	border: 2upx solid #ddd;
	border-radius: 50%;
	width: 32upx;
	height: 32upx;
	position: absolute;
	left: -2upx;
	top: -2upx;
	box-shadow: 0 4upx 8upx 0 rgba(0, 0, 0, 0.1);
}

.switch_button .switch_circle.right {
	transform: translateX(60upx);
}

.switch_button .switch_text {
	color: #ddd;
	margin-left: 5upx;
}

.login_submit {
	display: block;
	width: 100%;
	height: 84upx;
	margin-top: 60upx;
	background: #0faeff;
	border-radius: 8upx;
	font-size: 32upx;
	line-height: 84upx;
	color: #fff;
	text-align: center;
	border: none;
}
.register {
	font-size: 28upx;
	color: #999;
	position: fixed;
	bottom: 40upx;
	width: 100%;
	text-align: center;
}
.register a {
	text-decoration: none;
	color: #0faeff;
}
.forgetPwd {
	text-align: right;
	font-size: 28upx;
	padding-top: 30upx;
}
.forgetPwd a {
	text-decoration: none;
	color: #0faeff;
}
</style>
