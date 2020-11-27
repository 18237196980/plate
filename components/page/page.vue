<template>
	<view class="page-group" v-if="showPage">
		<view  :class="[enablePrev ? '' : 'disabled']" @click="prevPage">
			<text class="cuIcon-back" style="margin-right: 8rpx;"></text>
			上一页
		</view>
		<view  :class="[enableNext ? '' : 'disabled']" @click="nextPage">
			下一页
			<text class="cuIcon-right" style="margin-left: 8rpx;"></text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'page',
	props: {
		showPage: {
			type: Boolean,
			default: false //是否显示分页界面
		},
		enablePrev: {
			type: Boolean,
			default: false //是否启用上一页
		},
		enableNext: {
			type: Boolean,
			default: false //是否启用下一页
		}
	},
	data() {
		return {};
	},
	methods: {
		prevPage: async function(event) {
			if (this.enablePrev) {
				this.$emit('onPrevClick', event);
			}
		},
		nextPage: async function(event) {
			if (this.enableNext) {
				this.$emit('onNextClick', event);
			}
		}
	}
};
</script>

<style>
/* 分页样式 */
.page-group {
	background: #fff;
	margin-top: 20rpx;
	margin-bottom: 20rpx;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
}

.page-group view {
	height: 108rpx;
	flex: 1;
	font-size: 29rpx;
	color: #333;
	text-align: center;
	line-height: 108rpx;
}

.page-group .disabled {
	color: #ccc;
}
</style>
