<template>
	<div class="config-settings">
		<VuePerfectScrollbar :style="{ height: height + 'px' }" v-if="currentCellConfigs.rawConfigs">
			<cell-config-setting-template
				@add-y-axis="addYAxis"
				@change-column-setting="changeColumnSetting"
				v-for="(item, settingName) in currentCellConfigs.rawConfigs.setting"
				:key="settingName"
				:settingItem="item"
				:selectedCell="currentCellConfigs"
				:settingTplAgg="settingTplAgg"
			>
			</cell-config-setting-template>
		</VuePerfectScrollbar>
	</div>
</template>
<script>
import CellConfigSettingTemplate from '@/components/dashboard/components/reportConfig/CellConfigSettingTemplate';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import settingTplAgg from '@/components/dashboard/configPool/settingTplAgg';

export default {
	components: {
		CellConfigSettingTemplate: CellConfigSettingTemplate,
		VuePerfectScrollbar,
	},
	props: {
		instanceKey: {
			type: Number,
			default: 0,
		},
		height: {
			type: Number,
			default: 0,
		},
	},
	methods: {
		addYAxis(newLast) {
			let newYAxis = JSON.parse(JSON.stringify(this.settingItems.yAxis1));
			newYAxis.selectedColums = [];
			newYAxis.num = newLast;
			newYAxis.name = 'Y Axis ' + newLast;

			let tooltips = this.settingItems.tooltips;
			delete this.settingItems.tooltips;
			this.$set(this.settingItems, 'yAxis' + newLast, newYAxis);
			this.$set(this.settingItems, 'tooltips', tooltips);
			for (let name in this.settingItems) {
				if (name.includes('yAxis')) {
					this.settingItems[name].lastYaxis = newLast;
				}
			}
		},
		changeColumnSetting() {
			window.SDashboardEditor.onChangeCellConfigs('column');
		},
	},
	data() {
		return {
			cpnType: 'config_setting',
			settingItems: {},
			settingTplAgg: settingTplAgg,
		};
	},
	computed: {
		currentCellConfigs() {
			return this.$store.state.dashboard.allDashboard[this.instanceKey].currentCellConfigs;
		},
	},
};
</script>
<style scoped></style>
