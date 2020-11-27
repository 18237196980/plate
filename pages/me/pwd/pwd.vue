<template>
	<view class="container">
		<form @submit="formSubmit">
			<view class="cu-form-group">
				<view class="title">旧密码</view>
				<input placeholder="请输入旧密码" name="old_pwd" />
			</view>
			<view class="cu-form-group">
				<view class="title">新密码</view>
				<input placeholder="请输入新密码" name="pwd" />
			</view>
			<view class="cu-form-group">
				<view class="title">确认密码</view>
				<input placeholder="请重复新密码" name="re_pwd" />
			</view>

			<view class="form_btn"><button class="sub_btn" type="primary" form-type="submit">提交</button></view>
		</form>
	</view>
</template>
<script>
const api = require('@/common/api.js');
const util = require('@/common/util.js');
const auth = require('@/common/auth.js');

export default {
	data() {
		return {};
	},
	methods: {
		async formSubmit(e) {
			var that = this;
			var uid = auth.getUId();
			var formdata = e.detail.value;

			if (util.isEmpty(formdata.old_pwd)) {
				util.showToast('旧密码不能为空');
				return;
			}
			if (util.isEmpty(formdata.pwd)) {
				util.showToast('新密码不能为空');
				return;
			}
			if (util.isEmpty(formdata.re_pwd)) {
				util.showToast('确认密码不能为空');
				return;
			}

			//用户名和密码验证
			if (formdata.pwd.length < 8 || formdata.pwd.length > 16) {
				uni.hideLoading();
				util.showToast('新密码必须是8-16位数字和字母');
				return false;
			}
			if (!/^(?![^a-zA-Z]+$)(?!\D+$)/.test(formdata.pwd)) {
				uni.hideLoading();
				util.showToast('新密码必须包含数字、字母');
				return false;
			}
			if (formdata.pwd != formdata.re_pwd) {
				uni.hideLoading();
				util.showToast('两次输入的密码不一致');
				return false;
			}

			formdata.uid = uid;
			let res = await api.updatePwd(formdata);

			if (res.code == 1) {
				util.showToast('密码修改成功,请重新登陆!');
				auth.clearLoginInfo();
				setTimeout(function() {
					that.gotoLogin();
				}, 1000);
			} else {
				util.showToast(res.message);
			}
		},
		gotoLogin() {
			uni.redirectTo({
				url: '/pages/login/login'
			});
		}
	}
};
</script>

<style>
page {
	height: 100%;
	width: 100%;
	background: #f8f8f8;
}

.container {
	padding: 10px;
}

.uni-form-item .title {
	padding: 20rpx 0;
}
.form_btn {
	display: flex;
	flex-direction: row;
	margin-top: 20px;
}
.sub_btn {
	height: 40px;
	width: 80%;
}
.reset {
}
</style>
