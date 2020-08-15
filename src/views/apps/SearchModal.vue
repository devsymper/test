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
			<div v-for="(itemT,i) in listItems" :key="i">
				<h4><v-icon>{{itemT.icon}}</v-icon>  {{ itemT.title}}</h4>
				<ul v-for="(childItem,i) in itemT.item" :key="i" @click="clickItem(childItem,itemT.title)">
					<li>
						{{childItem.name}} 
						<v-icon style="font-size:11px;float:right">mdi-star</v-icon>
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
				   icon : 'mdi-folder',
				   title: 'documents',
				   item:[
						
				   ]
			   },
			   orgcharts:{
 				   icon : 'mdi-folder',
				   title: 'orgcharts',
				   item:[
						
				   ]
			   },
			   reports:{
				    icon : 'mdi-folder',
				   title: 'reports',
				   item:[
					
				   ]
 				 
			   },
			   workflows:
			   {
			    icon : 'mdi-folder',
				   title: 'workflows',
				   item:[
						
				   ]
			   },
			},  
			 listItemsSelected:{
			   documents:
			   {
				   icon : 'mdi-folder',
				   title: 'documents',
				   item:[
				   ]
			   },
			   orgcharts:
			   {
 				   icon : 'mdi-folder',
				   title: 'orgcharts',
				   item:[
				   ]
			   },
			   reports:
			   {
				   icon : 'mdi-folder',
				   title: 'reports',
				   item:[
				   ]
			   },
			   workflows:
			   {
			  	   icon : 'mdi-folder',
				   title: 'workflows',
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
			
			let listItem = this.listItemsSelected[type].item;
			if(listItem.indexOf(obj) == -1){
				listItem.push(obj);
			}else{
				listItem.splice(listItem.indexOf(obj));
			}
			// console.log(this.listItemsSelected[type].item,'selected');
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
.search-modal >>>.v-input__slot{
	border: 1px solid lightblue;
    background-color: lightgray;
    min-height: unset;
    height: 36px;
	box-shadow: unset;
}
 .search-box{
	
}
ul {
	list-style: none;
}
 li{
	cursor: pointer;
	padding: 6px;
	margin-right: 10px;
}
 li:hover{
	background-color:lightgray;
}
</style>