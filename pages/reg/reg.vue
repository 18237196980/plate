<template>
	<div class="registerContainer">
		<div class="registerInner">
			<div class="register_header"></div>
			<!-- 内容部分 -->
			<div class="register_content">
				<form @submit="register">
					<!-- 短信登录 -->
					<div>
						<section class="register_message"><input type="tel" maxlength="11" placeholder-class="p-class" placeholder="用户名(2-8位英文)" v-model="name" /></section>
						<section class="register_verification">
							<input type="text" maxlength="16" placeholder-class="p-class" placeholder="密码(8-16位数字和字母)" v-if="showPwd" v-model="pwd" />
							<input type="password" maxlength="16" placeholder-class="p-class" placeholder="密码(8-16位数字和字母)" v-else v-model="pwd" />
						</section>
						<section class="register_verification">
							<input type="text" maxlength="16" placeholder-class="p-class" placeholder="重复密码(8-16位数字和字母)" v-if="showPwd1" v-model="re_pwd" />
							<input type="password" maxlength="16" placeholder-class="p-class" placeholder="重复密码(8-16位数字和字母)" v-else v-model="re_pwd" />
						</section>
						
						<section class="register_message">
							<input type="number" maxlength="11" placeholder-class="p-class" placeholder="手机号" v-model="phone" @input="change" />
							<button :disabled="!rightPhone" :class="[rightPhone ? 'get_verification_right_phone' : 'get_verification']" @click.prevent="getCode">
								{{ second < 60 ? `(${second}s)后重新发送` : '获取验证码' }}
							</button>
						</section>
						<section class="register_verification"><input type="number" maxlength="4" placeholder-class="p-class" placeholder="验证码" v-model="code" /></section>
						
						<section class="register_hint">
							温馨提示：注册即表示您已阅读、理解并同意
							<br />
							<a href="javascript:;">《用户服务协议》</a>
						</section>
					</div>
					<button class="register_submit" @click="register_submit">注册</button>
					<view class="gologin" hover-class="go_reg_click" @click="toRegPage">去登陆</view>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
const api = require('@/common/api.js');
const util = require('@/common/util.js');
const auth = require('@/common/auth.js');

export default {
	name: 'register',
	data() {
		return {
			code_flag: 0, // 注册获取验证码标识
			second: 60, // 倒计时60s
			phone: '', //手机号,
			computeTime: 0,
			code: '', //验证码
			timer: null,
			showPwd: false,
			showPwd1: false,
			pwd: '',
			re_pwd: '',
			name: '',
			rightPhone: false, // 手机号格式是否正确
			sending_flag: false // 是否正在倒计时（倒计时时修改手机号，不允许发送验证码）
		};
	},
	computed: {},
	methods: {
		toRegPage() {
			uni.redirectTo({
				url: '/pages/login/login'
			});
		},
		change() {
			var input_phone = this.phone;
			if (!util.isEmpty(input_phone)) {
				this.rightPhone = util.isPhone(input_phone) && !this.sending_flag;
				if (!util.isPhone(input_phone) && input_phone.length == 11) {
					util.showToast('手机号格式不正确'); // 手机号格式错误并且是11位时，才提醒手机号格式错误（不要时时提醒）
					return;
				}
			}
		},
		async getCode() {
			// 后台生成短信验证码
			var res = await api.getPhoneCode(this.phone, this.code_flag);
			if (res.code === 1) {
				util.showToast('验证码已发送:'+res.data);

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
		register_submit() {
			console.log("aaaaa")
			this.register();
		},
		async register() {
			console.log("bbbbb")
			uni.showLoading({
				title: '正在注册...'
			});
			if (this.phone.length == 0 || this.code.length == 0 || this.pwd.length == 0 || this.re_pwd.length == 0 || this.name.length == 0) {
				uni.hideLoading();
				util.showToast('信息填写不完整');
				return false;
			}
			//短信验证
			var phonereg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
			if (!phonereg.test(this.phone) || this.phone.length != 11) {
				uni.hideLoading();
				util.showToast('手机号不正确');
				return false;
			}
			if (!/^\d{4}$/.test(this.code)) {
				uni.hideLoading();
				util.showToast('验证码是4位纯数字');
				return false;
			}
			//用户名和密码验证
			if (this.name.length < 2 || this.name.length > 8) {
				uni.hideLoading();
				util.showToast('用户名必须是2-8位');
				return false;
			}
			if (this.pwd.length < 8 || this.pwd.length > 16) {
				uni.hideLoading();
				util.showToast('密码必须是8-16位数字和字母');
				return false;
			}
			if (!/^(?![^a-zA-Z]+$)(?!\D+$)/.test(this.pwd)) {
				uni.hideLoading();
				util.showToast('密码必须包含数字、字母');
				return false;
			}
			if (this.pwd != this.re_pwd) {
				uni.hideLoading();
				util.showToast('两次输入的密码不一致');
				return false;
			}
			// 注册新用户
			var params = {
				phone: this.phone,
				code: this.code,
				pwd: this.pwd,
				re_pwd: this.re_pwd,
				name: this.name
			};

			var res = await api.register(params);

			if (res.code === 1) {
				uni.hideLoading();
				util.showToast('注册成功，请登录');
				uni.redirectTo({
					url: '/pages/login/login'
				});
			}else{
				uni.hideLoading();
				util.showToast(res.message);
				return false;
			}
		}
	}
};
</script>

<style scoped>
/* 去登陆 */
.gologin {
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
	
	
.registerContainer {
	width: 100%;
	height: 100%;
	background: #fff;
}

.registerInner {
	width: 80%;
	margin: 0 auto;
	padding-top: 40upx;
}

.registerInner .register_header .register_logo {
	color: #0faeff;
	font-weight: bolder;
	font-size: 80upx;
	text-align: center;
}

.register_header .register_header_title {
	text-align: center;
	padding-top: 80upx;
}

.register_header_title a {
	text-decoration: none;
	font-size: 28upx;
	color: #333;
	padding-bottom: 8upx;
}

.register_header_title a:first-child {
	margin-right: 80upx;
}

.register_header_title a.on {
	color: #0faeff;
	font-weight: bolder;
	border-bottom: 4upx solid #0faeff;
}

.register_content form div.on {
	display: block;
}

.register_content form input {
	width: 100%;
	height: 100%;
	border: 2upx solid #ddd;
	border-radius: 8upx;
	outline: none;
	padding-left: 20upx;
	box-sizing: border-box;
}

.register_content form input:focus {
	border: 2upx solid #0faeff;
}

.register_message {
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
}

.get_verification_right_phone {
	position: absolute;
	top: 50%;
	right: 20upx;
	transform: translateY(-50%);
	border: none;
	background: transparent;
	font-size: 28upx;
	color: #4dab01;
}

.register_hint {
	text-align: center;
	color: #999;
	margin-top: 24upx;
	font-size: 28upx;
	line-height: 40upx;
}

.register_hint a {
	text-decoration: none;
	color: #0faeff;
}

.register_verification {
	position: relative;
	margin-top: 32upx;
	height: 96upx;
	font-size: 28upx;
	background: #fff;
}

.register_verification .switch_button {
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

.register_verification .switch_button.on {
	background: #0faeff;
}

.register_verification .switch_button.off {
	background: #fff;
}

.switch_button .switch_circle {
	background: #fff;
	border: 2upx solid #ddd;
	border-radius: 50%;
	width: 32upx;
	height: 32upx;
	position: absolute;
	left: -1px;
	top: -1px;
	box-shadow: 0 4upx 8upx 0 rgba(0, 0, 0, 0.1);
}

.switch_button .switch_circle.right {
	transform: translateX(60upx);
}

.switch_button .switch_text {
	color: #ddd;
	float: right;
}

.register_submit {
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
.register_hint {
	color: #999;
	margin-top: 24upx;
	font-size: 28upx;
	line-height: 40upx;
}

register_hint a {
	text-decoration: none;
	color: #0faeff;
}
</style>
