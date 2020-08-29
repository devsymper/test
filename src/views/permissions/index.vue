<template>
    <v-container fluid>
        <ListItems
            ref="listPack"
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
        >
            <template slot="right-panel-content" slot-scope="{itemData}">
                <PermissionForm
                    @saved-item-data="handleSavedItem"
                    :action="actionOnItem"
                    :itemData="itemData">

                </PermissionForm>
            </template>
        </ListItems>
    </v-container>
</template>

<script>
import ListItems from "../../components/common/ListItems";
import grandPermission from "./grandPermission";
import UpdatePermission from "./Update";
import Api from "./../../api/api.js";
import { appConfigs } from "../../configs";
import { permissionApi } from '../../api/permissionPack';
import PermissionForm from "@/components/permission/PermissionForm.vue";
import { util } from '../../plugins/util';

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
        grandPermission,
        UpdatePermission,
        PermissionForm
    },
    computed: {
        getDataUrl: function() {
            return appConfigs.apiDomain.permissionPacks;
        }
    },
    data: function() {
        let self = this;
        return {
            customAPIResult: {
                reformatData(res) {
                    if (res.status == 200) {
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
                                    name: "type",
                                    title: "type",
                                    type: "text"
                                }
                            ]
                        };
                    } else {
                        this.$snotifyError(res, "Can not get permissions list");
                    }
                }
            },
            containerHeight: 300,
            actionOnItem: 'create',
            currentItemData: util.cloneDeep(defaultItemData),
            tableContextMenu: [
                {
                    name: "edit",
                    text: this.$t("permissions.contextMenu.edit"),
                    callback: async (pack, callback) => {

                        for(let key in pack){
                            self.$set(self.currentItemData, key, pack[key]);
                        }

                        self.actionOnItem = 'update';
                        let res = await permissionApi.getActionPackOfPermission(pack.id);
                        
                        if(res.status == 200){
                            let listActionPacks = res.data;
                            let mapActionPack = self.$store.state.permission.allActionPack;
                            self.currentItemData.actionPacks = listActionPacks.reduce((arr, el) => {
                                arr.push(mapActionPack[el.actionPackId]);
                                return arr;
                            }, []);
                        }else{
                            self.$snotifyError(res, "Can not get list action pack of permission "+pack.name);
                        }
                    }
                },
                {
                    name: "remove",
                    text: this.$t("permissions.contextMenu.remove"),
                    callback: async (rows, refreshList) => {
                        let ids = [];
                        for(let item of rows){
                            ids.push(item.id);
                        }
                        try {
                            let res = await permissionApi.deletePermissionPack(ids);
                            // if(res.status == 200){
                                self.$snotifySuccess("Deleted "+ids.length+' items');
                            // }else{
                            //     self.$snotifyError(res, "Can not delete selected items");
                            // }
                        } catch (error) {
                            self.$snotifyError(error, "Can not delete selected items");
                        }
                        refreshList();
                    }
                }
            ],
            tableHeight: 0
        };
    },
    mounted() {
        this.tableHeight = document.body.clientHeight - 0;
    },
    methods: {
        async getDetailSystemRole(id){
            let res = await systemRoleApi.detail(id);
            if(res.status == 200){
                for(let key in res.data){
                    this.$set(this.currentItemData, key, res.data[key]);
                }
            }else{
                this.$snotifyError(res, "Can not get item detail");
            }

            res = await permissionApi.getPermissionOfRole('system:'+id);
            if(res.status == 200){
                let mapIdToPermission = this.$store.state.permission.allPermissionPack;
                let permissions = res.data.reduce((arr, el) => {
                    if(mapIdToPermission[el.permissionPackId]){
                        arr.push(mapIdToPermission[el.permissionPackId]);
                    }
                    return arr;
                }, []);
                this.$set(this.currentItemData, 'permissions', permissions);
            }else{
                this.$snotifyError(res, "Can not get permission of role");
            }
        },
        handleSavedItem(){
            this.$refs.listPack.refreshList();
        },
        handleAddItem(){
            this.actionOnItem = 'create';
            this.currentItemData = null;
            this.currentItemData = util.cloneDeep(defaultItemData);
        },
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        },
        applyDataToForm(row){
            for(let key in row){
                this.$set(this.currentItemData, key, row[key]);
            }
        }
    }
};
</script>

<style></style>
