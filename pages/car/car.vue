<template>
	<view class="container">
		<view class="search"><uni-search-bar @confirm="search" :maxlength="maxlength" @input="input" @cancel="cancel" cancelText="重置" /></view>
		<!-- <view class="uni-padding-wrap uni-common-mt">
			<view class="text" v-for="(num, index) in data" :key="index">list - {{ num }}</view>
			<view class="uni-loadmore" v-if="showLoadMore">{{ loadMoreText }}</view>
		</view> -->

		<!-- 列表 -->
		<view class="list_content">
			<view class="no_data" :style="{ height: height + 'px' }" v-if="no_data">
				<image class="no_data_img" src="../../static/no_data.png"></image>
				<view class="no_data_text">暂无数据</view>
			</view>
			<block v-for="(item, index) in list" :key="item.id">
				<view class="item" :data-index="index">
					<!-- id部分 -->
					<view class="item_id">
						<text class="cuIcon-titles text-orange"></text>
						<view class="item_id_id">{{ item.id }}</view>
					</view>

					<!-- 其它信息 -->
					<view class="item_other">
						<!-- 左侧 -->
						<view class="item_other_left">
							<view class="code">{{ item.code }}</view>
							<view class="phone">{{ item.phone }}</view>
						</view>
						<!-- 右侧 -->
						<view class="item_other_right">
							<view class="apply_person">{{ item.apply_person }}</view>
							<image class="right_icon" src="../../static/go.png"></image>
						</view>
					</view>
				</view>
			</block>
			<view class="uni-loadmore" v-if="showLoadMore">{{ loadMoreText }}</view>
		</view>
	</view>
</template>

<script>
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action'; // 右侧滑动显示【删除】
import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item'; // 右侧滑动显示【删除】
import uniIcons from '@/components/uni-icons/uni-icons';
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';

const api = require('@/common/api.js');
const util = require('@/common/util.js');

export default {
	components: {
		uniSearchBar,
		uniSwipeAction,
		uniSwipeActionItem,
		uniIcons
	},
	data() {
		return {
			maxlength:'7',
			height: uni.getSystemInfoSync().screenHeight - 200,
			no_data: false,
			pageNumber: 1, //当前第几页
			pageSize: 10, //每页几条
			total: 0, //总条数
			searchParam: '', // 搜索内容
			list: [],
			loadMoreText: '加载中...',
			showLoadMore: false,
			max: 0
		};
	},
	onLoad() {
		this.initData();
	},
	onUnload() {
		// (this.list = []), (this.loadMoreText = '加载更多'), (this.showLoadMore = false);
	},
	// 加载更多
	onReachBottom() {
		console.log("触底前-------")
		this.setListData();
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.reset();
	},
	methods: {
		reset() {
			this.pageNumber = 1;
			this.list = [];
			this.initData();
		},
		input(res) {
			this.searchParam = res.value;
		},
		cancel() {
			this.searchParam = '';
			this.reset();
		},
		async search() {
			/* uni.showLoading({
				title: '加载中...'
			}); */
			this.showLoadMore = false;
			this.reset();
			console.log("this.showLoadMore:"+this.showLoadMore)
		},

		async initData(more_flag) {
			let self = this;
			self.no_data = false;

			let res = await api.plateList(this.pageNumber, this.pageSize, this.searchParam);
			if (res.code == 1) {
				uni.hideLoading();
				uni.stopPullDownRefresh();
				uni.hideKeyboard();

				this.total = res.total;
				// 如果上拉加载更多
				if (more_flag) {
					if (res.total > 1 && res.rows.length < 1) {
						this.loadMoreText = '没有更多数据了';
						return;
					} else {
						this.showLoadMore = true;
						console.log("就这。。。")
						self.list = self.list.concat(res.rows);
					}
				} else {
					this.showLoadMore = false;
					if (res.total < 1) {
						this.no_data = true;
					}
					this.list = res.rows;
				}
			} else {
				util.showToast(message);
			}
		},
		setListData() {
			var self = this;
			self.pageNumber = parseInt(self.pageNumber) + 1;
			self.initData(true);
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
	padding: 20upx;
}
.text {
	margin: 16rpx 0;
	width: 100%;
	background-color: #fff;
	height: 120rpx;
	line-height: 120rpx;
	text-align: center;
	color: #555;
	border-radius: 8rpx;
}
.search {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	background: #eee;
	z-index: 10;
}
/* 无数据 */
.no_data {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.no_data_img {
	width: 200upx;
	height: 150upx;
}
.no_data_text {
	margin-top: 20upx;
	font-size: 28upx;
	color: #a6a7a1;
}

/* 循环 开始 */
.list_content {
	margin-top: 100upx;
}
.item {
	background-color: #ffffff;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 200upx;
	padding: 20upx;
	margin-bottom: 15upx;
	border-radius: 8upx;
}
.bg-click {
	background-color: #efeee9;
}
.item_id {
	display: flex;
	margin-bottom: 30upx;
	align-items: center;
}
.item_id_id {
	margin-left: 20upx;
	font-size: 28upx;
	color: #949293;
}
.item_other {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
}
.item_other_left {
	display: flex;
	flex-direction: column;
}
.item_other_right {
	display: flex;
	flex-direction: row;
	align-items: center;
}
.right_icon {
	width: 20upx;
	height: 20upx;
	margin-left: 20upx;
}
.code {
	font-size: 36upx;
	font-weight: 600;
	margin-bottom: 25upx;
}
.phone {
	font-size: 28upx;
	color: #aa5d64;
	font-weight: 600;
}
.phone_click {
	font-size: 28upx;
	color: #1aaa01;
	font-weight: 600;
}
.apply_person {
	font-size: 26upx;
	color: #aaaaaa;
}
/* 循环结束 */
</style>
