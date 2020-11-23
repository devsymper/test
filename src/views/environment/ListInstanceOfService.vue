<template>
	<div class="h-100 w-100">
		<ListItems
			ref="listService"
			:pageTitle="'Danh sách instance'"
			:containerHeight="containerHeight"
			:getDataUrl="getListUrl"
			:headerPrefixKeypath="'table'"
			:useDefaultContext="false"
			:showExportButton="false"	
			:showButtonAdd="false"
			:tableContextMenu="tableContextMenu"
			:customAPIResult="customAPIResult"
			:apiMethod="'POST'"
			:custumDataForApi="custumDataForApi"
		/>
		<DialogDeloy 
			:showDialog="showDialog"
			@cancel="showDialog = false"
		/>
	</div>
</template>

<script>
import ListItems from "@/components/common/ListItems"
import { appConfigs } from "@/configs.js";
import { util } from "@/plugins/util.js";
import DialogDeloy from './dialogs/DialogDeloy'
export default {
	components:{
		ListItems,
		DialogDeloy
	},
	mounted(){
		this.containerHeight = util.getComponentSize(this).h
	},
	data(){
		let self = this
		return{
			showDialog: false,
			containerHeight:0,
			custumDataForApi(configs, columns, filterData){
				let serviceId = self.$route.params.serviceId
				return {
					serviceId:serviceId
				}
			},
			tableContextMenu: {
			
            },
			customAPIResult:{
				reformatData(res){
					let listBA = self.$store.state.app.allBA;
					res.data.forEach(function(e){
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
							{name: "versionName", title: "versionName", type: "text"},
							{name: "environmentIdentifier", title: "environmentIdentifier", type: "text"},
							{name: "environmentName", title: "environmentName", type: "numeric"},
							{name: "status", title: "status", type: "numeric"},
							{name: "userCreateName", title: "userCreate", type: "text"},
							{name: "userUpdateName", title: "userUpdate", type: "text"},
							{name: "createAt", title: "createAt", type: "text"},
							{name: "updateAt", title: "updateAt", type: "text"},
						],
						listObject: res.data,
						total:res.data.length
					}
				}
			},
		}
	},
	computed:{
		getListUrl(){
			return appConfigs.apiDomain.environmentManagement+"instances/query"
		}
	}
}
</script>

<style>

</style>