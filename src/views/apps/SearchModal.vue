<template>
<div width="500px" style="padding:10px">
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
				documents:{},
				orgcharts:{},
				reports:{},
				workflows:{}
			},
			 listItemsSelected2:{
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
			if(this.listItemsSelected[type][obj.id]){
				delete this.listItemsSelected[type][obj.id];
			}else{
				this.listItemsSelected[type][obj.id] = {name : obj.name};
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

<style>
ul {
	list-style: none;
}
li{
	cursor: pointer;
	
}
li:hover{
	background-color:lightgray;
}
</style>