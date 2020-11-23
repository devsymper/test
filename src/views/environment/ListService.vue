<template>
	<div>
		<ListItems
		ref="listService"
		:pageTitle="'Danh sách service'"
		:containerHeight="containerHeight"
		:getDataUrl="getListUrl"
		:headerPrefixKeypath="'table'"
		:showExportButton="false"
		:useDefaultContext="false"
		:tableContextMenu="tableContextMenu"
		:actionPanelWidth="550"
		:customAPIResult="customAPIResult"
		:showButtonAdd="false"	

	>
		 <template slot="right-panel-content" slot-scope="{}">
			 <AddServiceForm 
				@add-success="handleAddSuccess"
			 />
		</template>
	</ListItems>
	<AddVersion 
		:showDialog="showDialog"
		@cancel="showDialog = false"
	/>
	</div>
</template>

<script>
import ListItems from "@/components/common/ListItems"
import { appConfigs } from "@/configs.js";
import AddServiceForm from './panels/AddServiceForm'
import AddVersion from './dialogs/AddVersion'
export default {
	components:{
		ListItems,
		AddServiceForm,
		AddVersion
	},
	methods:{
		handleAddSuccess(){
			this.$refs.listService.refreshList()
		}
	},
	props:{
		containerHeight:{
			type: Number, 
			default:0
		}
	},
	data(){
		let self = this
		return{
			showDialog: false,
			tableContextMenu: {
                detail: {
                    name: "detail",
                    text: "Danh sách version",
                    callback: (row, callback) => {
						self.$goToPage( "/service/"+row.id+"/versions",
                            "Chi tiết " + (row.name ? row.name : "")
                        );
                    }
                },
                viewInstance: {
                    name: "viewInstance",
                    text: "Danh sách instance",
                    callback: (row, callback) => {
						self.$goToPage( "/service/"+row.id+"/instances",
                            "Danh sách instance "
                        );
                    }
                },
                addVersion: {
                    name: "addVersion",
                    text: "Thêm version",
                    callback: (row, callback) => {
						self.$store.commit('environmentManagement/setCurrentServieId', row.id)
						self.showDialog = true
                    }
                }
            },
			customAPIResult:{
				reformatData(res){
					let listBA = self.$store.state.app.allBA;
					res.data.listObject.forEach(function(e){
						if(!e.userCreate){
							e.userCreateName = ""  
						}else{
							listBA.forEach(function(k){
								if(k.id == e.userCreate){
									e.userCreateName =  k.name
								}
							})
						}
						if(!e.userUpdate){
							e.userUpdateName =""
						}else{
							listBA.forEach(function(k){
								if(k.id == e.userUpdate){
									e.userUpdateName =  k.name
								}
							})
						}
					})
					return {
						columns:[
							{name: "id", title: "id", type: "text"},
							{name: "name", title: "name", type: "text"},
							{name: "description", title: "description", type: "text"},
							{name: "lastVersion", title: "lastVersion", type: "text"},
							{name: "language", title: "language", type: "text"},
							{name: "status", title: "status", type: "numeric"},
							{name: "userCreateName", title: "userCreate", type: "text"},
							{name: "userUpdateName", title: "userUpdate", type: "text"},
							{name: "createAt", title: "createAt", type: "text"},
							{name: "updateAt", title: "updateAt", type: "text"},
						],
						listObject: res.data.listObject,
						total:res.total
					}
				}
			},
			getListUrl: appConfigs.apiDomain.environmentManagement+'services',
		}
	}
}
</script>

<style>

</style>