<template>
	<div class="fs-13 pt-1 report-date-filter">
		<v-menu ref="menu" v-model="menu" content-class="report-date-filter-menu" :close-on-content-click="false" :return-value.sync="dates" transition="scale-transition" offset-y min-width="290px">
			<template v-slot:activator="{ on, attrs }">
				<v-combobox v-model="dateRangeText" solo prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"> </v-combobox>
			</template>
			<div class="d-flex" style="background-color: #ffffff">
				<div style="border-right: 1px solid lightgray ">
					<div v-for="(item, i) in pickerOptions.shortcuts" :key="i">
						<span class="fs-13 ml-2 mt-2 mr-4 picker-option-title">
							{{ item.text }}
						</span>
					</div>
				</div>
				<v-date-picker v-model="dates" range scrollable> </v-date-picker>
			</div>
		</v-menu>
	</div>
</template>
<script>
import DateTimePicker from '@/components/common/DateTimePicker';
export default {
	components: {
		DateTimePicker,
	},
	computed: {
		dataValue() {
			if (this.data.value) {
				return this.data;
			} else {
				let today = new Date().toISOString().slice(0, 10);
				return {
					value: [today, today],
					max: today,
					min: today,
				};
			}
		},
	},
	methods: {
		handleChangeValue() {
			this.$emit('change-filter-value', this.cellId);
		},
	},
	props: ['data', 'selectionType', 'selectedCol', 'cellId', 'cellView'],
	computed: {
		dateRangeText () {
			return this.dates.join(' ~ ')
		},
	},
	data() {
		return {
			selectAll: false,
			selectingRadioBox: -1,
			dates: ['2019-09-10', '2019-09-20'],
			pickerOptions: {
				shortcuts: [
					{
						text: 'Today',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: 'Yesterday',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: 'Last 7 days',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: 'Last 14 days',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: 'Last 28 days',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 28);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: 'Last 30 days',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						},
					},
				],
			},
		};
	},
};
</script>
<style>
.symper-date-filter {
	width: 100% !important;
}
.symper-date-filter .el-range-separator {
	margin-right: 7px;
	position: relative;
	left: 7px;
}

.symper-date-filter .el-range-input:nth-child(4) {
	position: relative;
	left: 20px;
}
.picker-option-title {
	cursor: pointer;
}
.picker-option-title:hover {
	color: blue;
}
</style>
<style scoped>
.report-date-filter >>> .v-text-field__details{
	display: none !important;
}
.report-date-filter >>> .v-input__icon{
	font-size: 14px !important;
	margin-top: -6px !important;
}
.report-date-filter >>> .v-input__control{
	min-height: unset !important;
}
.report-date-filter >>> .v-input__slot{
	box-shadow: unset !important;
	border: 1px solid lightgray;
}
</style>
