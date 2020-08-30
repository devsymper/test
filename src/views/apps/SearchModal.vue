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
						<div style="position:relative">
							<v-tooltip bottom v-if="itemT.name == 'document_definition'">
								<template v-slot:activator="{ on, attrs }">
								<div class="title-document" 	
									v-bind="attrs"
									v-on="on" >
									<span>{{childItem.title}}</span> 
									<span style="font:10px;opacity:0.4">{{childItem.name}}</span>
								</div>
								</template>
									<span style="font:13px roboto">{{childItem.title}}</span> 
									<span style="font:8px;opacity:0.4">{{childItem.name}}</span>
							</v-tooltip>
							<div v-else>{{childItem.name}}</div>
							<v-icon  v-if="sAppManagement[itemT.name].item.includes(childItem)" style="position:absolute;top:0px;right:0px">mdi-check</v-icon> 
								<!-- v-if=""  sAppManagement.listItemSelected[itemT.name].item.includes(childItem)-->
						</div>						
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
import { debounce } from "debounce";
var delayTimer;
let self =  this;
export default {
	 data: function() {
        return {
			myValue: '',
			menuItemsHeight: '450px',
            listItems:{
			   document_definition:{
				   icon : 'mdi-file-edit-outline',
				   title: this.$t('apps.listType.documents'),
				   name:  'document_definition',
				   item:[

				   ]
			   },
			   orgchart:{
 				   icon : 'mdi-widgets-outline',
				   title: this.$t('apps.listType.orgcharts'),
				   name: 'orgchart',
				   item:[
				   ]
			   },
			   dashboard:{
				   icon : 'mdi-view-dashboard',
				   title: this.$t('apps.listType.reports'),
				   name: 'dashboard',
				   item:[
				   ]
			   },
			   workflow_definition:
			   {
			       icon : 'mdi-lan',
				   title:  this.$t('apps.listType.workflows'),
				   name: 'workflow_definition',
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
	computed:{
		sAppManagement(){
			return this.$store.state.appConfig.listItemSelected
		}
	},
	methods:{
		clickItem(obj,type){
			obj.active = !obj.active
			this.$store.commit('appConfig/updateListItemSelected',{obj:obj,type:type});
		},
		doSearch(val,time) {
			clearTimeout(delayTimer);
			let self = this;
			delayTimer = setTimeout(function() {
				self.getListSearch(val)
			}, time); 
		},
		checkChildrenItem(resData,storeData){
			if(resData.length > 0){
				resData.forEach(function(e){
					if(storeData.length > 0){
						storeData.forEach(function(f){
							if(e.id === f.id){
								e.active = true
							}else{
								e.active = false
							}
						})
					}else{
						e.active = false
					}
				})
			}
			return resData	
		},
		getListSearch(value){
			let self = this
			this.listItems.document_definition.item = []
			this.listItems.orgchart.item = []
			this.listItems.workflow_definition.item = []
			this.listItems.dashboard.item = []
			orgchartApi.getOrgchartList({search:value,pageSize:50}).then(res => {
				this.checkChildrenItem(res.data.listObject,self.sAppManagement.orgchart.item)
				this.listItems.orgchart.item = res.data.listObject;
			});
			documentApi.searchListDocuments({search:value,pageSize:50}).then(res => {
				this.checkChildrenItem(res.data.listObject,self.sAppManagement.document_definition.item)
				this.listItems.document_definition.item = res.data.listObject;
			});
			BpmnEngine.getListModels({search:value,pageSize:50}).then(res => {
				this.checkChildrenItem(res.data.listObject,self.sAppManagement.workflow_definition.item)
				this.listItems.workflow_definition.item = res.data.listObject;
			});
			dashboardApi.getDashboards({search:value,pageSize:50}).then(res => {
				this.checkChildrenItem(res.data.listObject,self.sAppManagement.dashboard.item)
				this.listItems.dashboard.item = res.data.listObject;
			});
		},
	},
	 watch: {
        'myValue': function(val){
			this.doSearch(val,500)
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
	font-weight: 500;
}
.search-modal >>> .app-item .app-child-item .v-icon{
	font-size:13px;
	float:right;
	padding-top:2px;
	color: green;
}
.search-modal >>> .app-item .app-child-item .title-document{
	white-space: nowrap; 
	width: 480px; 
	overflow: hidden;
	text-overflow: ellipsis; 
}
.search-modal >>> .app-item li{
	cursor: pointer;
	padding: 8px 8px;
	margin-right: 6px;
	margin-left: -10px;
}
.search-modal >>> .app-item li:hover{
	background-color:#f7f7f7;
	border-radius: 5px;
}
</style>