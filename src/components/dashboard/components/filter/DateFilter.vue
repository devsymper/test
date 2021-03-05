<template>
	<div class="fs-13 pt-1 report-date-filter">
		<v-menu ref="menu" v-model="menu" content-class="report-date-filter-menu" :close-on-content-click="false" :return-value.sync="dataValue.value" transition="scale-transition" offset-y min-width="290px">
			<template v-slot:activator="{ on, attrs }">
				<v-combobox v-model="dateRangeText" solo  readonly v-bind="attrs" v-on="on"> </v-combobox>
			</template>
			<div class="d-flex flex-column" style="background-color: #ffffff; z-index: 100000	">
				<div class="d-flex" >
					<div style="border-right: 1px solid lightgray" class="mt-2">
						<div v-for="(item, i) in pickerOptions.shortcuts" :key="i">
							<span class="fs-13 ml-2 mt-2 mr-4 picker-option-title" @click="item.onClick()">
								{{ item.text }}
							</span>
						</div>
					</div>
					<div class="d-flex mt-2">
						<div class="d-flex flex-column">
							<div class="d-flex align-center mx-1 justify-content-center" style="background-color: #E0E0E0">
								<span class="fs-13 py-1" style="margin-left: auto; margin-right: auto" >Ngày bắt đầu</span>
							</div>
							<v-date-picker 
								no-title 
								scrollable 
								v-model="startDate"
							>
							</v-date-picker>
						</div>
						<div class="d-flex flex-column" style="border-left: 1px solid lightgray">
							<div class="d-flex mx-1 justify-content-center" style="background-color: #E0E0E0">
								<span class="fs-13 py-1" style="margin-left: auto; margin-right: auto">Ngày kết thúc</span>
							</div>
							<v-date-picker 
								no-title 
								scrollable 
								v-model="endDate"
							>
							</v-date-picker>
						</div>
					</div>
				</div>
				<div class="d-flex  flex-row-reverse mr-2 mb-2 mt-2">
					<v-btn small color="primary" class="ml-2" @click="applyFilter">
						Áp dụng
					</v-btn>
					<v-btn small @cancel="cancel">
						Huỷ
					</v-btn>
				</div>
			</div>
		</v-menu>
	</div>
</template>
<script>
export default {
	computed: {
		dataValue() {
			if (this.data.value){
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
		dateRangeText() {
			return this.dates.join(' ~ ');
		},
	},
	created(){
		this.max = this.data.max
		this.min =  this.data.min
		debugger
		this.dates = [this.min, this.max]
	},
	methods: {
		applyFilter(){
			if(this.endDate >= this.startDate){
				this.handleChangeValue()
			}else{
				this.$snotifyError("Ngày kết thúc phải lớn hơn ngày bắt đầu", "Ngày kết thúc phải lớn hơn ngày bắt đầu")
			}
		},
		cancel(){
			this.menu = false
		},
		handleChangeValue() {
			this.dates = [this.startDate, this.endDate];
			this.$emit('change-filter-value', this.dates, this.cellId);
			this.cancel()
		},
		pickDateRange(start, end){
			this.endDate = this.$moment(end).format("YYYY-MM-DD")
			this.startDate = this.$moment(start).format("YYYY-MM-DD")
			this.handleChangeValue()
		},
		
	},

	props: ['data', 'selectionType', 'selectedCol', 'cellId', 'cellView'],
	data() {
		let self = this
		return {
			selectAll: false,
			selectingRadioBox: -1,
			menu: false,
			startDate: "",
			endDate: "",
			dates: [],
			pickerOptions: {
				shortcuts: [
					{
						text: 'Today',
						onClick(picker) {
							const start = new Date();
							const end = new Date();
							self.pickDateRange(start, end)
						},
					},
					{
						text: 'Yesterday',
						onClick(picker) {
							const start = new Date();
							const end = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24);
							self.pickDateRange(start, end)
						},
					},
					{
						text: 'Last 7 days',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							self.pickDateRange(start, end)
						},
					},
					{
						text: 'Last 14 days',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
							self.pickDateRange(start, end)
						},
					},
					{
						text: 'Last 28 days',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 28);
							self.pickDateRange(start, end)
						},
					},
					{
						text: 'Last 30 days',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							self.pickDateRange(start, end)
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
	font-size: 13px !important;
}
.picker-option-title:hover {
	color: blue;
}
</style>
<style scoped>
.report-date-filter >>> .v-text-field__details {
	display: none !important;
}
.report-date-filter >>> input{
	font-size: 13px !important;
}
.report-date-filter >>> .v-input__icon {
	font-size: 14px !important;
	margin-top: -6px !important;
}
.report-date-filter >>> .v-input__control {
	min-height: unset !important;
}
.report-date-filter >>> .v-input__slot {
	box-shadow: unset !important;
	border: 1px solid lightgray;
	height: 28px !important;
}
.report-date-filter  >>> .v-input__icon {
	display: none !important;
}

</style>
