<template>
	<ListItem 
		:pageTitle="'Danh sách permission'"
		:containerHeight="containerHeight"
		 ref="listPermission"
		:getDataUrl="getDataUrl"
		:headerPrefixKeypath="'permissions.header'"
		:useDefaultContext="false"
		:tableContextMenu="tableContextMenu"
		:showExportButton="false"
		:customAPIResult="customAPIResult"
		:showActionPanelInDisplayConfig="true"
	/>

</template>

<script>
import ListItem from "@/components/common/ListItems.vue"
import { appConfigs } from "@/configs";
export default {
	components:{
		ListItem
	},
	props:{
		containerHeight:{
			type: Number,
		}
	},
	computed: {
        getDataUrl: function() {
            return appConfigs.apiDomain.permissionPacks;
        }
	},
	created(){
	},
	data(){
		let self = this
		return{
			customAPIResult: {
                reformatData(res) {
                    if (res.status == 200) {
						self.containerHeight
						debugger
                        return {
                            listObject: self.setNameForUserId(res.data),
                            columns: [
                                {
                                    name: "id",
                                    title: "id",
                                    type: "numeric"
                                },
                                {
                                    name: "name",
                                    title: "name",
                                    type: "text"
                                },
                                {
                                    name: "description",
                                    title: "description",
                                    type: "text"
                                },
                                {
                                    name: "type",
                                    title: "type",
                                    type: "text"
                                },
                                {
                                    name: "createAt",
                                    title: "createAt",
                                    type: "text"
                                },
                                {
                                    name: "updateAt",
                                    title: "updateAt",
                                    type: "text"
                                },
                                {
                                    name: "userCreate",
                                    title: "userCreate",
                                    type: "text"
                                },
                                 {
                                    name: "userUpdate",
                                    title: "userUpdate",
                                    type: "text"
                                }
                            ]
                        };
                    } else {
                        this.$snotifyError(res, "Can not get permissions list");
                    }
                }
			},
			tableContextMenu: {
               	viewDetails: {
                    name: "View details",
                    text: "Xem chi tiết",
                    callback: (user, callback) => {
                    },
                },
               	edit: {
                    name: "Edit",
                    text: "Chỉnh sửa ",
                    callback: (user, callback) => {
                    },
                },
               	delete: {
                    name: "Delete",
                    text: "Xóa",
                    callback: (user, callback) => {
                    },
                },
             
            },
		}
	},
	
	methods:{
		setNameForUserId(listData){
			let list = this.$store.state.app.allBA;
            for(let i = 0; i < listData.length; i++){
                listData[i].userCreate = this.getBAName(list, listData[i].userCreate);
                listData[i].userUpdate = this.getBAName(list, listData[i].userUpdate);
            }
            return listData;
		},
		getBAName(list, id){
            for(let i = 0; i<list.length;i++){
                if(list[i].id==id){
                    return list[i].name;
                }
            }
        },
	}
}
</script>

<style>

</style>