<template>
	<ListItem 
		:containerHeight="containerHeight"
		 ref="listActionPack"
		:useDefaultContext="false"
		:pageTitle="$t('permissions.actionPack.list')"
		:getDataUrl="getListUrl"
		:tableContextMenu="tableContextMenu"
		:headerPrefixKeypath="'common'"
		:showExportButton="false"
		:debounceRowSelectTime="200"
		:customAPIResult="customAPIResult"
		@after-open-add-panel="handleShowPanel('add')"
		:showActionPanelInDisplayConfig="true"
		:actionPanelWidth="1000"
	>
		<template slot="right-panel-content" slot-scope="{}">
			<ActionPackPanel
				:action="actionOnPanel"
			/>
		</template>
	</ListItem>

</template>

<script>
import { appConfigs } from "@/configs.js";
import ListItem from "@/components/common/ListItems.vue"
import { permissionApi } from "@/api/permissionPack";
import ActionPackPanel from "./../panels/ActionPackPanel"
export default {
	components:{
		ListItem,
		ActionPackPanel
	},
	props:{
		containerHeight:{
			type: Number,
		}
	},
	data(){	
		let self = this
		return{
			getListUrl: appConfigs.apiDomain.actionPacks,
			actionOnPanel: "",
			customAPIResult: {
                reformatData(res) {
                    if (res.status == 200) {
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
                            listObject: res.data,
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
                                    name: "userCreateName",
                                    title: "userCreateName",
                                    type: "text"
                                },
                                {
                                    name: "userUpdateName",
                                    title: "userUpdateName",
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
						self.handleShowPanel('view')
                    },
                },
               	edit: {
                    name: "Edit",
                    text: "Chỉnh sửa ",
                    callback: (user, callback) => {
						self.handleShowPanel('edit')
                    },
                },
               	delete: {
                    name: "Delete",
                    text: "Xóa",
                    callback: async (rows, refreshList) => {
                        try {
                            let res = await permissionApi.deleteActionPack(rows.id);
                            if (res.status == 200) {
                                self.$snotifySuccess(
                                    "Xóa Thành công"
                                );
                            } else {
                                self.$snotifyError(
                                    res,
                                    "Can not delete selected items"
                                );
                            }
                        } catch (error) {
                            self.$snotifyError(
                                error,
                                "Can not delete selected items"
                            );
                        }
                        refreshList();
                    },
                },
             
            },
		}
	},
	methods:{
		handleShowPanel(action){
			this.$refs.listActionPack.actionPanel = true;
			this.actionOnPanel = action
		}
	}
}
</script>

<style>

</style>