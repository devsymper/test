<template>
	<ListItems
		ref="listService"
		:containerHeight="containerHeight"
		:getDataUrl="getListUrl"
		:headerPrefixKeypath="'table'"
		:useDefaultContext="false"
		:tableContextMenu="tableContextMenu"
		:customAPIResult="customAPIResult"
	/>
</template>

<script>
import ListItems from "@/components/common/ListItems"
import { appConfigs } from "@/configs.js";
export default {
	components:{
		ListItems
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
			tableContextMenu: {
                detail: {
                    name: "detail",
                    text: this.$t("common.detail"),
                    callback: (row, callback) => {
						self.$goToPage( "/service/"+row.id+"/versions",
                            " Các version service" + (row.name ? row.name : "")
                        );
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