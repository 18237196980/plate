<template>
	<view>
		<view class="cu-bar bg-white search">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" v-model="searchParam" maxlength="7" @confirm="doSearch()" placeholder="输入搜索的关键词" @input="change" confirm-type="search" />
				<uni-icons color="#999999" v-if="clear_flag" @click="clearSearch" class="clear_icon" size="23" type="clear" />
			</view>
			<view class="action"><button @click="doSearch()" class="cu-btn bg-gradual-green shadow-blur round">搜索</button></view>
		</view>

		<!-- 添加 -->
		<view class="right_bottom" @click="add()"><image class="add_img" src="../../../static/add_plate.png"></image></view>

		<!-- 列表 -->
		<view class="list_content container">
			<uni-swipe-action>
				<block v-for="(item, index) in list" :key="item.id">
					<uni-swipe-action-item :right-options="item.options" @click="swipeClick($event, index)">
						<view class="item" :data-index="index" @longpress="onLongPress" @click="onItemClick(item.id)" hover-class="bg-click">
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
									<view class="phone" hover-class="phone_click" hover-stop-propagation="true" @click.stop="callPhone(item.phone)">{{ item.phone }}</view>
								</view>
								<!-- 右侧 -->
								<view class="item_other_right">
									<view class="apply_person">{{ item.apply_person }}</view>
									<image class="right_icon" src="../../../static/go.png"></image>
								</view>
							</view>
						</view>
					</uni-swipe-action-item>
				</block>

				<page :showPage="showPage" :enablePrev="enablePrev" :enableNext="enableNext" @onPrevClick="prevPage" @onNextClick="nextPage" />
			</uni-swipe-action>
		</view>
	</view>
</template>

<script>
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action'; // 右侧滑动显示【删除】
import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item'; // 右侧滑动显示【删除】
import uniIcons from '@/components/uni-icons/uni-icons';

const api = require('@/common/api.js');
const util = require('@/common/util.js');

export default {
	data() {
		return {
			clear_flag: false, // 搜索框是否显示叉号
			phone_flag: true, // 点击电话，改变样式
			CustomBar: this.CustomBar,
			list: [], // 列表数据
			pageNumber: 1, //当前第几页
			pageSize: 10, //每页几条
			total: 0, //总条数
			searchParam: '', // 搜索内容
			showPage: false, //是否显示分页界面
			enablePrev: false, //是否启用上一页
			enableNext: false //是否启用下一页
		};
	},
	components: {
		uniSwipeAction,
		uniSwipeActionItem,
		uniIcons
	},
	onLoad() {
		this.getData();
	},
	methods: {
		// 清除搜索框内容
		clearSearch() {
			this.searchParam = '';
			this.clear_flag = false;
			this.getData();
		},
		// 搜索框改变监听
		change() {
			this.clear_flag = !util.isEmpty(this.searchParam);
		},
		// 拨打电话
		callPhone(phone) {
			uni.makePhoneCall({
				// 手机号
				phoneNumber: phone,
				// 成功回调
				success: res => {
					console.log('调用成功!');
				},
				// 失败回调
				fail: res => {
					console.log('调用失败!');
				}
			});
		},
		onLongPress(e) {
			this.swipeClick('', e.currentTarget.dataset.index);
		},
		// 右侧滑动，进行删除
		swipeClick(e, index) {
			var that = this;
			uni.showModal({
				title: '删除提示',
				content: '确定删除？',
				success: async function(res) {
					if (res.confirm) {
						var id = that.list[index].id;
						let res = await api.del(id);
						if (res.code === 1) {
							util.showToast('删除成功');
							setTimeout(function() {
								that.getData();
							}, 500);
						} else {
							util.showToast(res.message);
						}
					} else {
					}
				}
			});
		},
		// 跳转到添加页面
		add() {
			uni.navigateTo({
				url: '../../plate/add/add'
			});
		},
		// 点击搜索
		doSearch() {
			this.pageNumber = 1;
			this.getData();
		},
		// 下拉刷新
		async onPullDownRefresh() {
			this.getData(true);
		},
		// 请求后台列表数据
		async getData(flag) {
			let self = this;

			self.showPage = false;
			self.list = [];

			if (!flag){
				uni.showLoading({
					title: '加载中...'
				});
			}

			let res = await api.plateList(this.pageNumber, this.pageSize, this.searchParam);

			uni.hideLoading();
			uni.stopPullDownRefresh(); //刷新完成后停止下拉刷新动效

			if (res.code == 1) {
				uni.hideKeyboard();
				var rows = res.rows;
				var total = res.total;
				if (total <= 0) {
					util.showToast('没有相关车辆信息');
					return;
				}else{
					util.showToast('总共条数:'+total);
				}
				for (var i = 0; i < rows.length; i++) {
					var item = rows[i];
					item.options = [
						{
							text: '删除',
							style: {
								backgroundColor: 'rgb(255,58,49)',
								height: '200upx'
							}
						}
					];
				}
				//只有一页时，不显示分页
				var isShowPage = total > self.pageSize;
				var enablePrev = self.pageNumber > 1;
				var enableNext = self.pageNumber < total / self.pageSize;

				(self.list = rows), (self.total = total), (self.showPage = isShowPage), (self.enablePrev = enablePrev), (self.enableNext = enableNext);
			} else {
				util.showToast(message);
			}
		},
		// 点击一项，进行修改
		onItemClick(id) {
			uni.navigateTo({
				url: `../../plate/detail/detail?id=${id}`
			});
		},
		// 上一页
		prevPage: async function(event) {
			if (this.pageNumber <= 1) {
				return false;
			}

			var self = this;
			self.pageNumber = parseInt(self.pageNumber) - 1;

			this.getData();
		},
		// 下一页
		nextPage: async function(event) {
			var self = this;
			if (this.pageNumber >= this.total / this.pageSize) {
				return false;
			}
			self.pageNumber = parseInt(self.pageNumber) + 1;
			this.getData();
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

/* 搜索 */
.clear_icon {
	margin-right: 20upx;
	z-index: 99;
}

.indexes {
	position: relative;
}
.indexBar {
	position: fixed;
	right: 0px;
	bottom: 0px;
	padding: 20upx 20upx 20upx 60upx;
	display: flex;
	align-items: center;
}

.indexBar .indexBar-box {
	width: 40upx;
	height: auto;
	background: #fff;
	display: flex;
	flex-direction: column;
	box-shadow: 0 0 20upx rgba(0, 0, 0, 0.1);
	border-radius: 10upx;
}

.indexBar-item {
	flex: 1;
	width: 40upx;
	height: 40upx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24upx;
	color: #888;
}

movable-view.indexBar-item {
	width: 40upx;
	height: 40upx;
	z-index: 9;
	position: relative;
}

movable-view.indexBar-item::before {
	content: '';
	display: block;
	position: absolute;
	left: 0;
	top: 10upx;
	height: 20upx;
	width: 4upx;
	background-color: #f37b1d;
}

.indexToast {
	position: fixed;
	top: 0;
	right: 80upx;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	width: 100upx;
	height: 100upx;
	border-radius: 10upx;
	margin: auto;
	color: #fff;
	line-height: 100upx;
	text-align: center;
	font-size: 48upx;
}

/* 循环 开始 */
.list_content {
	display: flex;
	flex-direction: column;
	margin-bottom: 60upx;
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

/* 添加 */
.right_bottom {
	display: flex;
	align-items: center;
	justify-content: center;
	background: #659d92;
	color: #ffffff;
	overflow: hidden;
	z-index: 9999;
	position: fixed;
	padding: 5upx;
	text-align: center;
	width: 100upx;
	height: 100upx;
	border-radius: 50%;

	right: 40upx;
	bottom: 180upx;
}
.add_img {
	width: 80upx;
	height: 80upx;
}
</style>
