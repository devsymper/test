<template>
<div width="500px" style="padding:10px" class="search-modal">
		<v-text-field
			label="Search"
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
				   title: 'Documents',
				   name: 'documents',
				   item:[
						
				   ]
			   },
			   orgcharts:{
 				   icon : 'mdi-folder',
				   title: 'Orgcharts',
				   name: 'orgcharts',
				   item:[
						
				   ]
			   },
			   reports:{
				    icon : 'mdi-view-dashboard',
				   title: 'Reports',
				   name: 'reports',
				   item:[
					
				   ]
 				 
			   },
			   workflows:
			   {
			       icon : 'mdi-lan',
				   title: 'Workflows',
				   name: 'workflows',
				   item:[
						
				   ]
			   },
			},  
			 listItemsSelected:{
			   documents:
			   {
				   icon : 'mdi-file-document',
				   title: 'Documents',
				   item:[
				   ]
			   },
			   orgcharts:
			   {
 				   icon : 'mdi-view-dashboard',
				   title: 'Orgcharts',
				   item:[
				   ]
			   },
			   reports:
			   {
				   icon : 'mdi-folder',
				   title: 'Reports',
				   item:[
				   ]
			   },
			   workflows:
			   {
			  	   icon : 'mdi-lan',
				   title: 'Workflows',
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
			// debugger
			let listItem = this.listItemsSelected[type].item;
			if(listItem.indexOf(obj) == -1){
				listItem.push(obj);
			}else{
				listItem.splice(listItem.indexOf(obj));
			}
			this.$store.commit('appConfig/updateListItemSelected',this.listItemsSelected);
		},
		getListSearch(value){
			orgchartApi.getOrgchartList({search:value,pageSize:50}).then(res => {
			this.listItems.orgcharts.item = res.data.listObject;
			});
			documentApi.searchListDocuments({search:value,pageSize:50}).then(res => {
				this.listItems.documents.item = res.data.listObject;
			});
			BpmnEngine.getListModels({search:value,pageSize:50}).then(res => {
				console.log(res.data);
				this.listItems.workflows.item = res.data.listObject;
			});
			dashboardApi.searchDashboard({search:value,pageSize:50}).then(res => {
				this.listItems.reports.item = res.data.listObject;
				console.log(res.data);
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
	text-shadow: unset;
}
.search-modal >>> .v-input__control .v-input__slot{
	/* border: 1px solid lightblue; */
    background-color: lightgray;
    min-height: unset;
    height: 36px;
	box-shadow: unset;
}
.search-modal >>> .v-input__control .v-icon{
	font-size:13px
}
.search-modal >>> .v-input__control .v-text-field__details{
	display: none;
}
.search-modal >>> .app-item ul{
	list-style: none;
}
.search-modal >>> .app-item .title-app{
	/* padding-left: 15px; */
	display: flex;
	cursor: pointer;
	padding:10px 15px;
	
}
.search-modal >>> .app-item .title-app .v-icon{
	font-size: 13px;
}
.search-modal >>> .app-item .title-app h4{
	padding-left:8px;
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
	padding: 8px 12px;
	margin-right: 10px;
}
.search-modal >>> .app-item li:hover{
	background-color:lightgray;
}
</style>