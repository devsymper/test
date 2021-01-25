<template>
	<div class="w-100 h-100 mt-2 report-select-filter" style="position:relative">
		<v-autocomplete
			style="width: calc(100% - 20px);margin-left: 10px;"
			v-model="selectedValues"
			:multiple="cellView.displayOptions.selectionType == 'multiple'"
			:items="data"
			solo
			small-chips
			class="report-filter"
			:item-text="selectedCol.as"
			:item-value="selectedCol.as"
			@change="handleChangeFilterValue"
			:loading="loading"
		>
			<template v-slot:selection="data">
				<div class="custom-selected-display">
					<v-chip x-small>
						{{ data.item[selectedCol.as] }}
					</v-chip>
				</div>
			</template>
		</v-autocomplete>
	</div>
</template>
<script>
export default {
	data() {
		return {
			selectedValues: [],
			loading: false,
		};
	},
	watch: {
		data: {
			deep: true,
			immediate: true,
			handler(arr) {
				this.loading = false;
			},
		},
	},
	methods: {
		handleChangeFilterValue(values) {
			if (typeof values == 'string') {
				values = [values];
			}
			for (let i in this.cellView.selectedValues) {
				delete this.cellView.selectedValues[i];
			}

			for (let vl of values) {
				this.cellView.selectedValues[vl] = true;
			}
			this.$emit('change-droplist-filter-value', this.cellId);
		},
		remoteMethod(query) {
			if (query !== '') {
				this.loading = true;
				if (this.filterAction) {
					clearTimeout(this.filterAction);
				}

				this.filterAction = setTimeout(
					(thisCpn, query) => {
						// SDashboardEditor.$emit('change-query-drop-list-filter', { cellId: thisCpn.cellId, query: query });
					},
					400,
					this,
					query
				);
			}
		},
	},
	props: ['data', 'selectionType', 'selectedCol', 'cellId', 'cellView'],
};
</script>
<style scoped>
.report-select-filter >>> .v-text-field__details {
	display: none !important;
}
.report-select-filter >>> .v-input__control {
	min-height: unset !important;
}
.report-select-filter >>> .v-input__slot {
	box-shadow: unset !important;
	border: 1px solid lightgray;
}
.report-select-filter >>> .v-select__selections{
	flex-wrap: unset !important;
	white-space: nowrap; 
	width: 90%; 
	overflow: hidden;
	text-overflow: ellipsis; 
}
.v-menu__content >>> .v-icon {
	font-size: 16px !important;
}
</style>
<style>
.v-list-item {
	min-height: unset ;
}
.v-list-item__title {
	font-size: 13px ;
}
.v-list-item__action {
	margin: unset ;
}
</style>
