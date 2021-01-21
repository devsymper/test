<template>
	<div class="column-condition-area position-relative">
		<div class="title ml-1 mt-1" style="font-size: 13px !important">
			{{ $t('bi.dashboard.condition-config') }}
		</div>
		<draggable group="drop-column" :list="conditions" @change="handleChangeCondition" class="dragArea list-group mt-1">
			<VuePerfectScrollbar :style="{ height: height - 50 + 'px' }">
				<v-expansion-panels accordion>
					<div class="columns-condition" v-for="(condColumn, idx) in currentCellConfigs.rawConfigs.condition" :key="idx">
						<ConditionItem :condColumn="condColumn" :idx="idx" @remove="removeCondition" />
					</div>
				</v-expansion-panels>
			</VuePerfectScrollbar>
			<div class="placeholder-div-condition fs-13">
				{{ $t('bi.dashboard.config.add-field') }}
			</div>
		</draggable>
	</div>
</template>
<script>
import conditionType from '@/components/dashboard/configPool/conditionType.js';
import ConditionItem from './ConditionItem';
let cpnCondType = conditionType;
import VuePerfectScrollbar from 'vue-perfect-scrollbar';

export default {
	props: {
		conditions: {
			type: Array,
			default() {
				return [
					{
						as: 'REPORT BỞI',
						agg: 'first',
						cond: { val: '0', type: 'isnot' },
						edit: false,
						name: 'nguoi_report',
						type: 'text',
						dataset: '3614',
						validValue: true,
						origin_type: 'text',
					},
					{
						as: 'REPORT BỞI',
						agg: 'first',
						cond: { val: '', type: 'notblank' },
						edit: false,
						name: 'nguoi_report',
						type: 'text',
						dataset: '3614',
						validValue: true,
						origin_type: 'text',
					},
					{
						as: 'TRẠNG THÁI',
						agg: 'first',
						cond: { val: 'TESTING', type: 'is' },
						edit: false,
						name: 'ttsd',
						type: 'text',
						dataset: '3614',
						validValue: true,
						origin_type: 'text',
					},
				];
			},
		},
		height: {
			type: Number,
			default: 0,
		},
		instanceKey: {
			type: Number,
			default: 0,
		},
	},
	components: {
		ConditionItem,
		VuePerfectScrollbar,
	},
	computed: {
		currentCellConfigs() {
			return this.$store.state.dashboard.allDashboard[this.instanceKey].currentCellConfigs;
		},
	},
	data() {
		return {
			cpnType: 'config_condition',
			condTypes: cpnCondType,
		};
	},
	methods: {
		renderView(conds) {
			this.conditions = conds;
		},
		handleChangeCondition() {},
		removeCondition(idx) {
			this.conditions.splice(idx, 1);
		},
	},
};
</script>
<style>
.placeholder-div-condition {
	height: 20px;
	border-radius: 4px;
	color: #c8c8c8;
	text-align: center;
	background-color: #f6f6f6;
	border: 1px solid #e9e9e9;
	width: calc(100% - 20px);
	margin: 10px;
	line-height: 20px;
}
.columns-condition {
	width: 100%;
}
</style>
