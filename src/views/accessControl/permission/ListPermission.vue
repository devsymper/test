<template>
    <div class="h-100 w-100">
        <ListItems
            ref="listPermission"
            :getDataUrl="getDataUrl"
            :headerPrefixKeypath="'permissions.header'"
            :pageTitle="$t('permissions.title')"
            :containerHeight="tableHeight"
            :tableContextMenu="tableContextMenu"
            :useDefaultContext="false"
            :actionPanelWidth="600"
            @after-open-add-panel="handleAddItem"
            :currentItemData="currentItemData"
            :customAPIResult="customAPIResult"
            :commonActionProps="commonActionProps"
			:showExportButton="false"
        > 
            <template slot="right-panel-content" slot-scope="{itemData}">
                <PermissionForm
                    @close-form="closeForm"
                    @saved-item-data="handleSavedItem"
                    :action="actionOnItem"
                    :itemData="itemData">
                </PermissionForm>
            </template>
        </ListItems>
    </div>
</template>

<script>
import ListItems from "@/components/common/ListItems";
import UpdatePermission from "@/views/permissions/Update";
import Api from "@/api/api.js";
import accountApi from "@/api/account";
import { appConfigs } from "@/configs";
import PermissionForm from "@/components/permission/PermissionForm.vue";
import { util } from '@/plugins/util';
import PermissionWorker from 'worker-loader!@/worker/accessControl/Permission.Worker.js';

let defaultItemData = {
    id: '',
    name: '',
    description: '',
    actionPacks: []
};

export default {
    name: "ListPermissions",
    components: {
        ListItems,
        UpdatePermission,
        PermissionForm
    },
    computed: {
        getDataUrl: function() {
            return appConfigs.apiDomain.permissionPacks;
        }
    },
    created(){
		this.$store.dispatch("app/getAllBA");
		this.permissionWorker = new PermissionWorker()
    },
    data: function() {
        let self = this;
        return {
			listUser:[],
			permissionWorker: null,
            nameUser:[],
            commonActionProps: {
                "module": "permission_pack",
                "resource": "permission_pack",
                "scope": "permission_pack",
            },
            customAPIResult: {
                reformatData(res) {
                    if (res.status == 200) {
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
							],
							total: res.data.length
                        };
                    } else {
                        this.$snotifyError(res, "Can not get permissions list");
                    }
                }
            },
            containerHeight: 300,
            actionOnItem: 'create',
            currentItemData: util.cloneDeep(defaultItemData),
            tableContextMenu: {
                viewDetails: {
                    name: "view",
                    text: this.$t("permissions.contextMenu.viewDetails"),
                    callback: async (pack, callback) => {
						self.updatePermissionData(pack, true);
                    }
                },
                update: {
                    name: "edit",
                    text: this.$t("permissions.contextMenu.edit"),
                    callback: async (pack, callback) => {
                        self.updatePermissionData(pack);
                    }
                },
                remove: {
                    name: "remove",
                    text: this.$t("permissions.contextMenu.remove"),
                    callback: async (rows, refreshList) => {
                        let ids = [];
                        for(let item of rows){
                            ids.push(item.id);
						}
						this.permissionWorker.postMessage({
							action: "deletePermission",
							data:{
								ids: ids
							}
						})
                    }
                }
            },
            tableHeight: 0
        };
    },
    mounted() {
		this.tableHeight = util.getComponentSize(this).h;
		let self = this
		this.permissionWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'deletePermission':
					if(data.dataAfter == 'success'){
						self.$snotifySuccess("Xóa thành công")
					}else{
						self.$snotifyError("Có lỗi xảy ra")
					}
					self.$refs.listPermission.refreshList();
					break;
                case 'getActionPackOfPermission':
					let listActionPacks = data.dataAfter;
					let mapActionPack = self.$store.state.permission.allActionPack;
					self.currentItemData.actionPacks = listActionPacks.reduce((arr, el) => {
						arr.push(mapActionPack[el.actionPackId]);
						return arr;
					}, []);
					break;
               
                default:
                    break;
            }
        });
    },
    methods: {
        closeForm(){
            this.$refs.listPermission.closeactionPanel();
        },
        async updatePermissionData(pack , view = false){
            let self = this;
            for(let key in pack){
                self.$set(self.currentItemData, key, pack[key]);
            }
			self.actionOnItem = view == false ? 'update' : 'detail';
			this.permissionWorker.postMessage({
				action: 'getActionPackOfPermission',
				data:{
					packId: pack.id
				}
			})
        },
        setNameForUserId(listData){
            let list = this.$store.state.app.allBA;
            for(let i = 0; i<listData.length; i++){
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
        handleSavedItem(){
            this.$refs.listPermission.refreshList();
            this.$refs.listPermission.actionPanel = false
        },
        handleAddItem(){
            this.actionOnItem = 'create';
            this.currentItemData = null;
            this.currentItemData = util.cloneDeep(defaultItemData);
        },
    }
};
</script>

<style></style>
