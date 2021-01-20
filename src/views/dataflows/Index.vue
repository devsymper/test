<template>
	<div class="d-flex h-100 w-100">
		<div class="d-flex flex-column h-100  tab-select fs-13">
			<div
				v-for="(item, i) in listType"
				:key="i"
				:class="{ 'tab-select-item d-flex flex-column ml-1 mr-1 pl-1 pr-1 mt-1 pt-2 pb-2': true, 'selected-item': active == item.action }"
				@click="handleTab(item)"
			>
				<div>
					<v-icon small>
						mdi-circle-outline
					</v-icon>
					<span class="ml-2">{{ item.title }}</span>
				</div>
				<span class="fs-10" style="position:absolute;left:9px; top:10px">{{ i + 1 }}</span>
				<span class="fs-10 font-weight-light mt-1 "
					><v-icon x-small> mdi-information-outline</v-icon> <span class="ml-1">{{ item.subTitle }}</span></span
				>
			</div>
		</div>
		<div class="list-item flex-grow-1 w-100 h-100">
			<ListDataflow v-if="active == 'listDataflow'" :containerHeight="containerHeight" />
			<ListTrashDataflow v-if="active == 'listTrashDataflow'" :containerHeight="containerHeight" />
		</div>
	</div>
</template>

<script>
import ListDataflow from '@/views/dataflows/ListDataflow';
import { util } from '@/plugins/util.js';
import ListTrashDataflow from '@/views/dataflows/ListTrashDataflow';
export default {
	components: {
		ListDataflow,
		ListTrashDataflow,
	},
	created() {},
	mounted() {
		this.containerHeight = util.getComponentSize(this).h;
	},
	data() {
		let self = this;
		return {
			active: 'listDataflow',
			containerHeight: null,
			subActive: '',
			listType: [
				{
					title: self.$t('bi.dataflow.titleShowlist'),
					subTitle: 'Danh sách tập trung các dataflow trong báo cáo. Mỗi dataflow đảm nhiệm một chức năng riêng trong hệ thống ',
					action: 'listDataflow',
				},
				{
					title: self.$t('bi.dataflow.titleShowlistTrash'),
					subTitle: 'Danh sách tập trung các dataflow đã xóa. Mỗi dataflow đảm nhiệm chức năng lưu trữ các service trong hệ thống ',
					action: 'listTrashDataflow',
				},
			],
		};
	},
	methods: {
		handleTab(item) {
			this.active = item.action;
		},
	},
};
</script>

<style scoped>
.tab-select {
	width: 250px;
	border-right: 1px solid lightgray;
}
.selected-item {
	background-color: #f0f0f0;
	border-radius: 5px;
}
.tab-select-item,
.role-user-item {
	cursor: pointer;
	position: relative;
}
</style>
