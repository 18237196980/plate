<template>
	<view class="container">
		<view class="header-content">
			<view class="header-view" @click="changeHeader"><image :src="header_path"></image></view>
			<view class="user-name">{{ name }}</view>
		</view>
		<view class="me-content">
			<uni-list>
				<uni-list-item @click="myDetail" title="个人资料" />
				<uni-list-item @click="updatePwd" title="修改密码" />
				<uni-list-item @click="logout" title="退出登陆" />
			</uni-list>
		</view>
	</view>
</template>

<script>
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';

const api = require('@/common/api.js');
const util = require('@/common/util.js');
const config = require('../../../config.js');
const auth = require('@/common/auth.js');

export default {
	components: {
		uniList,
		uniListItem
	},
	data() {
		return {
			default_header: '../../../static/default_header.png',
			header_path: '',
			upload_path: '/upload/common',
			name: ''
		};
	},
	onShow() {
		var user = auth.getUserInfo();
		if (util.isEmpty(user.header_path)) {
			this.header_path = '';
			this.header_path = this.default_header;
		} else {
			if (user.header_path.startsWith('download')) {
				this.header_path = config.URL + '//' + user.header_path;
			} else {
				this.header_path = user.header_path;
			}
		}
		this.name = util.isEmpty(user.name) ? user.nickName : 'Tom';
	},
	methods: {
		myDetail(){
			uni.navigateTo({
				url: '../detail/detail'
			});
		},
		// 退出登陆
		async logout() {
			// 后端清除redis
			var res = await api.logout(auth.getUId());
			if (res.code === 1) {
				auth.clearLoginInfo();
				uni.reLaunch({
					url: '../../login/login'
				});
			} else {
				util.showToast(res.message);
			}
		},
		// 更改密码
		updatePwd() {
			uni.navigateTo({
				url: '../pwd/pwd'
			});
		},
		changeHeader() {
			var that = this;
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: res => {
					uni.uploadFile({
						url: config.URL + this.upload_path,
						filePath: res.tempFilePaths[0],
						name: 'file',
						header: {
							'Content-Type': 'application/json',
							'token': auth.getToken(),
							'uid': auth.getUId()
						},
						success: async function(res) {
							var resDataStr = res.data;
							var resData = JSON.parse(resDataStr);
							if (resData.code === 1) {
								// 上传成功
								that.header_path = resData.data.header_path;
								// 更改用户头像到数据库
								var result = await api.changeHeader({ id: auth.getUId(), header_path: resData.data.url });
								if (result.code === 1) {
									// 更改缓存中用户头像
									var user = auth.getUserInfo();
									user.header_path = resData.data.url;
									auth.saveLoginInfo(user, auth.getUId(), auth.getToken());
									util.showToast('修改头像成功');
								} else {
									util.showToast('修改头像失败');
								}
							} else {
								util.showToast('修改头像失败');
							}
						},
						complete() {
							uni.hideLoading();
						}
					});
				}
			});
		}
	}
};
</script>

<style>
page {
	height: 100%;
	width: 100%;
}

.container {
	padding: 0;
}

.header-content {
	height: 350upx;
	width: 100%;
	/* background-image: url(../../../static/me3.jpg);
	background-size: 100% 100%; 
	opacity: 0.4; */
	background-color: #435377;
}
.me-content {
	margin-top: 20upx;
}
.header-content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.header-view {
	height: 150upx;
	width: 150upx;
}
.header-view image {
	width: 100%;
	height: 100%;
	border-radius: 50%;
}
.user-name {
	margin-top: 20upx;
	font-size: 30upx;
	font-weight: 800;
	color: #ffffff;
}
</style>
