<template>
	<div class="d-flex h-100 w-100" :class="{'sbs-report': !showSideBar}">
		<Sidebar  
			@after-toggle-sidebar="afterToggleSideBar"
			@selecting-show-list="handleSelectingShowList"
			/>
		<div class="flex-grow-1">
			<ListDashboard 
				v-if="selectingShowList == 'list-dashboard'"
				:containerHeight="containerHeight"
			/>
			<ListTrashDashboard 
				v-if="selectingShowList == 'list-trash-dashboard'"
				:containerHeight="containerHeight"
			/>
			<ListDataflow 
				v-else-if="selectingShowList == 'list-dataflow'"
				:containerHeight="containerHeight"
			/>
			<ListTrashDataflow 
				v-else-if="selectingShowList == 'list-trash-dataflow'"
				:containerHeight="containerHeight"
			/>
			<ListDataset 
				v-else-if="selectingShowList == 'list-dataset'"
				:containerHeight="containerHeight"
			/>
			<ListTrashDataset 
				v-else-if="selectingShowList == 'list-trash-dataset'"
				:containerHeight="containerHeight"
			/>
			<ListRelation 
				v-else-if="selectingShowList == 'list-relation'"
				:containerHeight="containerHeight"
			/>
			<ListTrashRelation 
				v-else-if="selectingShowList == 'list-trash-relation'"
				:containerHeight="containerHeight"
			/>

		</div>	
	</div>
</template>

<script>
import ListDashboard from '@/views/dashboard/Index'
import ListTrashDashboard from '@/views/dashboard/ListTrashDashboard'
import ListDataflow from '@/views/dataflows/ListDataflow'
import ListTrashDataflow from '@/views/dataflows/ListTrashDataflow'
import ListDataset from '@/views/dataset/Index'
import ListTrashDataset from '@/views/dataset/ListTrashDataset'
import ListRelation from '@/views/relation/Index'
import ListTrashRelation from '@/views/relation/ListTrashRelation'
import Sidebar from './ReportSideBar'
import { util } from '@/plugins/util.js';

export default {
	components:{
		Sidebar,
		ListDashboard,
		ListDataflow,
		ListTrashDataflow,
		ListDataset,
		ListRelation,
		ListTrashRelation,
		ListTrashDashboard,
		ListTrashDataset
	},
	data: function() {
		let self = this;
        return {
			showSideBar : false,
			containerHeight: 0,
			selectingShowList: 'list-dashboard'
        };
	},
	mounted(){
		this.containerHeight = util.getComponentSize(this).h;
	},
    methods: {
		afterToggleSideBar(value){
			this.showSideBar = !value
		},
		handleSelectingShowList(type){
			this.selectingShowList = type
		}
	}
}
</script>

<style scoped>
.sbs-report >>> .title-show-list{
	margin-left: 30px !important;
}
</style>