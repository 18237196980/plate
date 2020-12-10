<template>
	<view class="container">
		<form @submit="formSubmit">
			<view class="cu-form-group">
				<view class="title">车牌号</view>
				<input placeholder-class="p-class" placeholder="请输入车牌号" disabled="inputDisabled" @tap="plateShow = true" v-model="plateNo" name="code" />
				<plate-input v-if="plateShow" :plate="plateNo" @export="setPlate" @close="plateShow = false" />
			</view>
			<view class="cu-form-group">
				<view class="title">车主姓名</view>
				<input placeholder-class="p-class" placeholder="请输入车主姓名" name="apply_person" />
			</view>
			<view class="cu-form-group">
				<view class="title">车主电话</view>
				<input placeholder-class="p-class" placeholder="请输入车主电话" maxlength="11" type="number" name="phone" />
			</view>
			<view class="cu-form-group">
				<view class="title">户号</view>
				<input placeholder-class="p-class" placeholder="请输入户号" name="apply_address" />
			</view>

			<view class="form_btn"><button class="sub_btn" :disabled="isDisable" type="primary" form-type="submit">提交</button></view>
		</form>
	</view>
</template>
<script>
const api = require('@/common/api.js');
const util = require('@/common/util.js');
import plateInput from '@/components/uni-plate-input/uni-plate-input.vue';

export default {
	components: {
		plateInput
	},
	data() {
		return {
			plateNo: '',
			plateShow: false,
			inputDisabled: true,
			isDisable: false
		};
	},
	methods: {
		setPlate(plate) {
			if (plate.length >= 7) this.plateNo = plate;
			this.plateShow = false;
		},
		disabledBtn() {
			var that = this;
			that.isDisable = true;
			setTimeout(function() {
				that.isDisable = false;
			}, 2000);
		},
		async formSubmit(e) {
			var that = this;
			that.disabledBtn();
			var formdata = e.detail.value;
			if (!util.isEmpty(formdata.phone) && !util.isPhone(formdata.phone)) {
				util.showToast('手机号格式有误!');
				return;
			}
			let res = await api.addPlate(formdata);

			if (res.code == 1) {
				util.showToast('添加成功');

				setTimeout(function() {
					uni.navigateBack(-1);
				}, 500);
			} else {
				util.showToast(res.message);
			}
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
