<template>
	<view></view>
</template>

<script>
const api = require('@/common/api.js');
const util = require('@/common/util.js');
const auth = require('@/common/auth.js');

export default {
	data() {
		return {
		};
	},
	async onLoad() {
		var self = this;
		try {
			var uid = uni.getStorageSync(auth.UID);
			var token = uni.getStorageSync(auth.TOKEN);
			
			//存在登录信息，那么自动登录
			if (uid && token) {
				var res = await api.loginByToken();
				if (res.code == 1) {
					//自动登录成功，跳转到主界面
					self.gotoMain();
				} else {
					//自动登录失败，跳转到登录界面
					util.showToast(res.message)
					self.gotoLogin();
				}
			} else {
				//不存在登录信息，跳转到登录界面
				self.gotoLogin();
			}
		} catch (e) {
			//出错，也跳转到登录界面
			self.gotoLogin();
		}
	},
	methods: {
		gotoMain() {
			uni.switchTab({
				url: '/pages/main/index/index'
			});
		},

		gotoLogin() {
			uni.redirectTo({
				url: '/pages/login/login'
			});
		}
	}
};
</script>

<style></style>
