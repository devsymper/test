<template>
<div width="500px" style="padding:10px" class="search-modal">
		<v-text-field
			:label="$t('apps.search')"
			single-line
			solo
			append-icon="mdi-magnify"
			v-model="myValue"
		></v-text-field>
		 <VuePerfectScrollbar :style="{height: menuItemsHeight}">
			<div class="app-item" v-for="(itemT,i) in listItems" :key="i">
				<div class="title-app" ><v-icon>{{itemT.icon}}</v-icon><h4> {{ itemT.title}}</h4> </div>
				<ul class="app-child-item" v-for="(childItem,i) in itemT.item" :key="i" @click="clickItem(childItem,itemT.name)">
					<li>
						{{childItem.name}}
						<v-icon>mdi-check</v-icon>
					</li>
				</ul>
			</div>
		</VuePerfectScrollbar>
</div>
</template>
<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import {documentApi} from './../../api/Document';
import {orgchartApi} from './../../api/orgchart';
import {dashboardApi} from './../../api/dashboard';
import BpmnEngine from './../../api/BPMNEngine';
export default {
	 data: function() {
        return {
			myValue: '',
			menuItemsHeight: '270px',
            listItems:{
			   documents:{
				   icon : 'mdi-file-document',
				   title: this.$t('apps.listType.documents'),
				   name:  'documents',
				   item:[
				   ]
			   },
			   orgcharts:{
 				   icon : 'mdi-folder',
				   title: this.$t('apps.listType.orgcharts'),
				   name: 'orgcharts',
				   item:[
				   ]
			   },
			   reports:{
				   icon : 'mdi-view-dashboard',
				   title: this.$t('apps.listType.reports'),
				   name: 'reports',
				   item:[
				   ]
			   },
			   workflows:
			   {
			       icon : 'mdi-lan',
				   title:  this.$t('apps.listType.workflows'),
				   name: 'workflows',
				   item:[
				   ]
			   },
			},  
    	};
	},
	components: {
        VuePerfectScrollbar,
	},
	created(){
		this.getListSearch('');
	},
	methods:{
		clickItem(obj,type){
			this.$store.commit('appConfig/updateListItemSelected',{obj:obj,type:type});
		},
		getListSearch(value){
			this.listItems.documents.item =[]
			this.listItems.orgcharts.item =[]
			this.listItems.workflows.item =[]
			this.listItems.reports.item =[]
			orgchartApi.getOrgchartList({search:value,pageSize:50}).then(res => {
				this.listItems.orgcharts.item = res.data.listObject;
			});
			documentApi.searchListDocuments({search:value,pageSize:50}).then(res => {
				this.listItems.documents.item = res.data.listObject;
			});
			BpmnEngine.getListModels({search:value,pageSize:50}).then(res => {
				this.listItems.workflows.item = res.data.listObject;
			});
			dashboardApi.getDashboards({search:value,pageSize:50}).then(res => {
				this.listItems.reports.item = res.data.listObject;
				console.log(res.data,'getDashboardgetDashboardgetDashboardgetDashboardgetDashboard');
			});
		},
	},
	 watch: {
        'myValue': function(val){
			this.getListSearch(val);
	    }
	}
}
</script>

<style scoped> 
.search-modal{
	font: 13px roboto;
}
.search-modal >>> .v-input__control{
	box-shadow: unset;
	text-shadow: unset;
}
.search-modal >>> .v-input__control .v-input__slot{
    background-color: #f7f7f7;
    min-height: unset;
    height: 36px;
	box-shadow: unset !important;
}
.search-modal >>> .v-input__control .v-icon{
	font-size: 13px;
}
.search-modal >>> .v-input__control .v-text-field__details{
	display: none;
}
.search-modal >>> .app-item ul{
	list-style: none;
}
.search-modal >>> .app-item .title-app{
	display: flex;
	cursor: pointer;
	padding:10px 0px;
	
}
.search-modal >>> .app-item .title-app .v-icon{
	font-size: 13px;
}
.search-modal >>> .app-item .title-app h4{
	padding-left:10px;
	font-weight: unset;
}
.search-modal >>> .app-item .app-child-item .v-icon{
	font-size:13px;
	float:right;
	padding-top:2px;
	color: greenyellow;
}
.search-modal >>> .app-item li{
	cursor: pointer;
	padding: 8px 0px;
	margin-right: 10px;
}
.search-modal >>> .app-item li:hover{
	background-color:#f7f7f7;
	border-radius: 10px;
}
</style>