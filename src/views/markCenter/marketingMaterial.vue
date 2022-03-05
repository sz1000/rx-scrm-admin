<template>
	<div>
		<el-tabs type="border-card" v-model="activeName">
			<el-tab-pane label="企业活码" name="first">
				<EnterpriseLive></EnterpriseLive>
			</el-tab-pane>
			<el-tab-pane label="企业渠道管理" name="second">
				<ChannelManagement></ChannelManagement>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import EnterpriseLive from './enterpriseLive.vue'
import ChannelManagement from './channelManagement'

export default {
	components: {
		EnterpriseLive,
		ChannelManagement,
	},
	data() {
		return {
			activeName: 'first',
		}
	},
	methods: {},
}
</script>
<style lang="less" scoped>
.el-tabs {
	border-radius: 8px;
	.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
		border-radius: 8px 0 0 0;
	}
}
</style>
