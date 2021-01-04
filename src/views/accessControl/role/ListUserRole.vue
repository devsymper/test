<template>
    <div class="w-100 h-100">
        <list-items
            ref="listSystemRole"
            :useDefaultContext="false"
            :pageTitle="$t('systemRole.list.title')"
            :tableContextMenu="tableContextMenu"
            :containerHeight="containerHeight"
            :getDataUrl="getListUrl"
            :useActionPanel="true"
            :headerPrefixKeypath="'common'"
            :currentItemData="currentItemData"
			:showExportButton="false"
            @after-open-add-panel="handleAddItem"
            :commonActionProps="commonActionProps"
        >
            <template slot="right-panel-content" slot-scope="{itemData}">
                <SystemRoleForm
                    @saved-item-data="handleSavedItem"
                    :action="actionOnItem"
                    :itemData="itemData">
                </SystemRoleForm>
            </template>
        </list-items>
    </div>
</template>
<script>
import { util } from "@/plugins/util.js";
import { reformatGetListProcess } from "@/components/process/reformatGetListData.js";
import { appConfigs } from "@/configs.js";
import { systemRoleApi } from "@/api/systemRole.js";
import ListItems from "@/components/common/ListItems.vue";

import SystemRoleForm from "@/components/systemRole/SystemRoleForm.vue";
import { permissionPackageApi } from '@/api/PermissionPackage';
import RoleWorker from 'worker-loader!@/worker/accessControl/Role.Worker.js';
export default {
    data() {
        let self = this;
        return {
            commonActionProps: {
                "module": "role",
                "resource": "role",
                "scope": "role",
			},
			roleWorker: null,
            containerHeight: 300,
            actionOnItem: 'create',
            getListUrl: appConfigs.apiDomain.systemRole+'system-role',
            currentItemData: {
                name: '',
                description: '',
                users: [],
                permissions: []
            },
            tableContextMenu: {
                update: {
                    name: "edit",
                    text: this.$t("common.edit"),
                    callback: (row, callback) => {
                        self.getDetailSystemRole(row.id);
                        self.actionOnItem = 'update';
                        self.applyDataToForm(row);
                    }
                },
                drop: {
                    name: "remove",
                    text: this.$t("common.delete"),
                    callback: async (rows, refreshList) => {
                        let ids = [];
                        for(let item of rows){
                            ids.push(item.id);
						}
						self.roleWorker.postMessage({
							action: "deleteRole",
							data:{
								ids: ids
							}
						})
                    }
                },
                detail: {
                    name: "detail",
                    text: this.$t("common.detail"),
                    callback: (row, callback) => {
                        self.$refs.listSystemRole.actionPanel = true;
                        self.getDetailSystemRole(row.id);
                        self.actionOnItem = 'detail';
                        self.applyDataToForm(row);
                    }
                },
            }
        };
    },
    mounted() {
		this.calcContainerHeight();
		let self = this
		this.roleWorker = new RoleWorker()
		this.roleWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'getDetailSystemRole':
					self.handlerGetDetailSystemRole(data.dataAfter)
					break;
                case 'deleteRole':
					if(data.dataAfter == 'success'){
						self.$snotifySuccess("Xóa thành công")
					}else{
						self.$snotifyError("Có lỗi xảy ra")
					}
					self.$refs.listSystemRole.refreshList()
					break;
                default:
                    break;
            }
        });
    },
    created() {
	},
    watch: {},
    methods: {
		handlerGetDetailSystemRole(data){
			let self = this
			if(data.dataSystemRole.status == 200){
				for(let key in data.dataSystemRole.data){
					self.$set(self.currentItemData, key, data.dataSystemRole.data[key]);
				}
			}else{
				self.$snotifyError("Đã xảy ra lỗi")
			}
			if(data.dataPermission.status == 200){
                let mapIdToPermission = this.$store.state.permission.allPermissionPack;
                let permissions = data.dataPermission.data.reduce((arr, el) => {
                    if(mapIdToPermission[el.permissionPackId]){
                        arr.push(mapIdToPermission[el.permissionPackId]);
                    }
                    return arr;
                }, []);
				this.$set(this.currentItemData, 'permissions', permissions);
			}	
		},
        async getDetailSystemRole(id){
			this.roleWorker.postMessage({
				action: 'getDetailSystemRole',
				data:{
					id: id,
					getPermissionOfRole: 'system:'+id
				}
			})
        },
        handleSavedItem(){
            this.$refs.listSystemRole.refreshList();
            this.$refs.listSystemRole.actionPanel = false;
        },
        handleAddItem(){
            this.actionOnItem = 'create';
            for(let key in this.currentItemData){
                if(key == 'users' || key == 'permissions'){
                    this.currentItemData.users = [];
                }else{
                    this.currentItemData[key] = '';
                }
            }
        },
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        },
        applyDataToForm(row){
            for(let key in row){
                this.$set(this.currentItemData, key, row[key]);
            }
        }
    },
    components: {
        ListItems: ListItems,
        SystemRoleForm
    }
};
</script>
