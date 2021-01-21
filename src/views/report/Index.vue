<template>
	<div class="d-flex h-100 w-100" :class="{'sbs-report': !showSideBar}">
		<Sidebar  
			@after-toggle-sidebar="afterToggleSideBar"
			@selecting-show-list="handleSelectingShowList"
			/>
		<div class="flex-grow-1">
			<ListDashboard 
				v-if="selectingShowList == 'listDashboards'"
			/>
			<ListDataflow 
				v-else-if="selectingShowList == 'listDataflows'"
				:containerHeight="containerHeight"
			/>
			<ListTrashDataflow 
				v-else-if="selectingShowList == 'list-trash-dataflow'"
				:containerHeight="containerHeight"
			/>
			<ListDataset 
				v-else-if="selectingShowList == 'listDatasets'"
			/>
			<ListRelation 
				v-else-if="selectingShowList == 'listRelations'"
			/>
			<span v-else class="ml-12">
				{{selectingShowList}}
			</span>

		</div>	
	</div>
</template>

<script>
import ListDashboard from '@/views/dashboard/Index'
import ListDataflow from '@/views/dataflows/ListDataflow'
import ListTrashDataflow from '@/views/dataflows/ListTrashDataflow'
import ListDataset from '@/views/dataset/Index'
import ListRelation from '@/views/relation/Index'
import Sidebar from './ReportSideBar'
import { util } from '@/plugins/util.js';

export default {
	components:{
		Sidebar,
		ListDashboard,
		ListDataflow,
		ListTrashDataflow,
		ListDataset,
		ListRelation
	},
	data: function() {
		let self = this;
        return {
			showSideBar : false,
			containerHeight: 0,
			selectingShowList: 'listDashboards'
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