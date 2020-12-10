<template>
	<view class="container">
		<form @submit="formSubmit">
			<view class="cu-form-group">
				<view class="title">手机号码</view>
				<input placeholder-class="p-class" type="number" maxlength="11" placeholder="请输入手机号" v-model="mobile" name="mobile" />
				<view class="cu-capsule radius">
					<view class="cu-tag bg-blue ">+86</view>
					<view class="cu-tag line-blue">中国大陆</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">邮箱</view>
				<input placeholder-class="p-class" placeholder="请输入邮箱" v-model="email" @input="emailChange" name="email" />
			</view>
			<!-- #ifndef MP-ALIPAY -->
			<view class="cu-form-group">
				<view class="title">地址</view>
				<pick-regions :default-regions="defaultRegions" @getRegions="handleGetRegions">{{ regionsName }}</pick-regions>
			</view>
			<!-- #endif -->
			<view class="cu-form-group">
				<view class="title">出生日期</view>
				<picker mode="date" v-model="birth" :start="startDate" :end="endDate" @change="DateChange">
					<view class="uni-input">{{ birth }}</view>
				</picker>
			</view>
			<view class="form_btn"><button class="sub_btn" :disabled="isDisable" type="primary" form-type="submit">提交</button></view>
		</form>
	</view>
</template>

<script>
import pickRegions from '@/components/pick-regions/pick-regions.vue';
const api = require('@/common/api.js');
const util = require('@/common/util.js');
const auth = require('@/common/auth.js');

function getDate(type) {
	const date = new Date();

	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();

	if (type === 'start') {
		year = year - 100;
	} else if (type === 'end') {
		year = year + 2;
	}
	month = month > 9 ? month : '0' + month;
	day = day > 9 ? day : '0' + day;

	return `${year}-${month}-${day}`;
}

export default {
	components: {
		pickRegions
	},
	data() {
		return {
			birth: getDate({
				format: true
			}),
			startDate: getDate('start'),
			endDate: getDate('end'),
			mobile: '',
			email: '',
			regionsName: '北京市,市辖区,东城区',
			selectCode: ['11', '1101', '110101'],
			defaultRegions: [],
			index: -1,
			isDisable: false // 防止表单重复提交
		};
	},
	onLoad() {
		this.loadUser();
	},
	methods: {
		emailChange() {},
		async loadUser() {
			var that = this;
			var res = await api.loadUser(auth.getUId());
			if (res.code === 1) {
				var user = res.data;
				that.mobile = user.mobile;
				that.email = user.email;
				that.birth = util.isEmpty(user.birth) ? that.birth : user.birth;
				that.regionsName = util.isEmpty(user.city_names) ? that.regionsName : user.city_names;

				that.defaultRegions[0] = util.isEmpty(user.city_code1) ? that.selectCode[0] : user.city_code1;
				that.defaultRegions[1] = util.isEmpty(user.city_code2) ? that.selectCode[1] : user.city_code2;
				that.defaultRegions[2] = util.isEmpty(user.city_code3) ? that.selectCode[2] : user.city_code3;
			}
		},
		// 获取选择的地区
		handleGetRegions(regions) {
			this.regions = regions;

			var selectCode = this.regions.map(item => item.code).join(',');
			var selectName = this.regions.map(item => item.name).join(',');

			this.regionsName = selectName;
		},
		DateChange(e) {
			this.birth = e.detail.value;
		},
		disabledBtn() {
			var that=this;
			that.isDisable = true;
			setTimeout(function() {
				that.isDisable = false
			}, 2000);
		},
		async formSubmit(e) {
			var that = this;
			that.disabledBtn();
			var formdata = e.detail.value;
			formdata.birth = this.birth;
			if (!util.isEmpty(formdata.mobile) && !util.isPhone(formdata.mobile)) {
				util.showToast('手机号格式有误!');
				return;
			}
			if (!util.isEmpty(formdata.email) && !util.isEmail(formdata.email)) {
				util.showToast('邮箱格式有误!');
				return;
			}

			formdata.id = auth.getUId();

			formdata.selectCode = this.selectCode.length == 0 ? this.defaultRegions : this.selectCode;
			formdata.city_names = that.regionsName;

			let res = await api.fullUserInfo(formdata);

			if (res.code === 1) {
				util.showToast('修改成功!');
				setTimeout(function() {
					that.goMe();
				}, 1000);
			} else {
				util.showToast(res.message);
			}
		},
		goMe() {
			uni.navigateBack();
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
.cu-form-group .title {
	min-width: calc(4em + 15px);
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
</style>
