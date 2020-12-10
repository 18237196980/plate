<template>
	<view class="container">
		<form @submit="formSubmit">
			<view class="cu-form-group">
				<view class="title">车牌号：</view>
				<input name="code" disabled="inputDisabled" @tap="plateShow = true" v-model="code" />
				<plate-input v-if="plateShow" :plate="code" @export="setPlate" @close="plateShow = false" />
			</view>
			<view class="cu-form-group">
				<view class="title">车主姓名：</view>
				<input v-model="apply_person" name="apply_person" :disabled="disabled_flag" />
			</view>
			<view class="cu-form-group">
				<view class="title">车主电话：</view>
				<input v-model="phone" name="phone" type="number" :disabled="disabled_flag" />
			</view>
			<view class="cu-form-group">
				<view class="title">户号：</view>
				<input v-model="apply_address" name="apply_address" :disabled="disabled_flag" />
			</view>

			<view class="cu-form-group back_gray">
				<view class="title">登记人：</view>
				<input v-model="create_user" :disabled="true" />
			</view>
			<view class="cu-form-group back_gray">
				<view class="title">登记时间：</view>
				<input v-model="create_time" :disabled="true" />
			</view>

			<view class="cu-form-group back_gray" v-if="update_user != null">
				<view class="title">更新人：</view>
				<input v-model="update_user" :disabled="true" />
			</view>

			<view class="cu-form-group back_gray" v-if="update_time != null">
				<view class="title">更新时间：</view>
				<input v-model="update_time" :disabled="true" />
			</view>

			<view class="form_btn"><button class="sub_btn" :disabled="isDisable" type="primary" form-type="submit">提交修改</button></view>
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
			plateShow: false,
			inputDisabled: true,
			id: '',
			disabled_flag: false,
			code: '',
			apply_person: '',
			phone: '',
			apply_address: '',
			create_time: '',
			create_user: '',
			update_user: '',
			update_time: '',
			isDisable: false
		};
	},
	onLoad(options) {
		this.id = options.id;
		this.initPlate(options.id);
	},
	methods: {
		setPlate(plate) {
			if (plate.length >= 7) this.code = plate;
			this.plateShow = false;
		},
		async initPlate(id) {
			let res = await api.initPlate(id);

			if (res.code === 1) {
				this.code = res.data.code;
				this.apply_person = res.data.apply_person;
				this.phone = res.data.phone;
				this.apply_address = res.data.apply_address;
				this.create_time = res.data.create_time;
				this.create_user = res.data.create_user;
				this.update_user = res.data.update_user;
				this.update_time = res.data.update_time;
			}
		},
		disabledBtn() {
			var that = this;
			that.isDisable = true;
			setTimeout(function() {
				that.isDisable = false;
			}, 2000);
		},
		async formSubmit(e) {
			this.disabledBtn();
			var formdata = e.detail.value;
			if (!util.isEmpty(formdata.phone) && !util.isPhone(formdata.phone)) {
				util.showToast('手机号格式有误!');
				return;
			}
			formdata.id = this.id;
			delete formdata.create_user;
			console.log(formdata);
			let res = await api.editPlate(formdata);

			if (res.code == 1) {
				util.showToast('修改成功');

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
.back_gray {
	background-color: #f3f4f4;
}
</style>
