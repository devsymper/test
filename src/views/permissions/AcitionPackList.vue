<template>
    <div class="w-100 h-100">
        <list-items
            ref="listActionPack"
            :useDefaultContext="false"
            :pageTitle="$t('permissions.actionPack.list')"
            :tableContextMenu="tableContextMenu"
            :containerHeight="containerHeight"
            :getDataUrl="getListUrl"
            :useActionPanel="true"
            :headerPrefixKeypath="'common'"
            :currentItemData="currentItemData"
            :customAPIResult="customAPIResult"
            :actionPanelWidth="600"
            @after-open-add-panel="handleAddItem">
            <template slot="right-panel-content" slot-scope="{itemData}">
                <ActionPackForm
                    @saved-item-data="handleSavedItem"
                    :action="actionOnItem"
                    :itemData="itemData">
                </ActionPackForm>
            </template>
        </list-items>
    </div>
</template>
<script>
import { util } from "./../../plugins/util.js";
import { reformatGetListProcess } from "./../../components/process/reformatGetListData.js";
import { appConfigs } from "./../../configs.js";
import { systemRoleApi } from "@/api/systemRole.js";
import ListItems from "@/components/common/ListItems.vue";

import ActionPackForm from "@/components/permission/ActionPackForm.vue";
import { permissionPackageApi } from '../../api/PermissionPackage';
import { permissionApi } from '../../api/permissionPack';
export default {
    data() {
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
            getListUrl: appConfigs.apiDomain.actionPacks,
            currentItemData: {
                name: '',
                description: '',
                objectType: 'document',
                mapActionAndObjects: {} // dạng: {workflow: [....], document: [...]]}
            },
            tableContextMenu: [
                {
                    name: "edit",
                    text: this.$t("common.edit"),
                    callback: (row, callback) => {
                        self.getDetailActionPack(row.id);
                        self.actionOnItem = 'update';
                        self.applyDataToForm(row);
                    }
                },
                {
                    name: "remove",
                    text: this.$t("common.delete"),
                    callback: async (rows, refreshList) => {
                        let ids = [];
                        for(let item of rows){
                            ids.push(item.id);
                        }
                        try {
                            let res = await permissionApi.deleteActionPack(ids);
                            if(res.status == 200){
                                self.$snotifySuccess("Deleted "+ids.length+' items');
                            }else{
                                self.$snotifyError(res, "Can not delete selected items");
                            }
                        } catch (error) {
                            self.$snotifyError(error, "Can not delete selected items");
                        }
                        refreshList();
                    }
                },
                {
                    name: "detail",
                    text: this.$t("common.detail"),
                    callback: (row, callback) => {
                        self.$refs.listSystemRole.actionPanel = true;
                        self.getDetailActionPack(row.id);
                        self.actionOnItem = 'detail';
                        self.applyDataToForm(row);
                    }
                },
            ]
        };
    },
    mounted() {
        this.calcContainerHeight();
        setTimeout((self) => {
            self.$refs.listActionPack.addItem();
        }, 500, this);
    },
    created() {},
    watch: {},
    methods: {
        async getDetailActionPack(id){
            // let res = await systemRoleApi.detail(id);
            // if(res.status == 200){
            //     for(let key in res.data){
            //         this.$set(this.currentItemData, key, res.data[key]);
            //     }
            // }else{
            //     this.$snotifyError(res, "Can not get item detail");
            // }

            // res = await permissionApi.getPermissionOfRole('system:'+id);
            // if(res.status == 200){
            //     let mapIdToPermission = this.$store.state.permission.allPermissionPack;
            //     let permissions = res.data.reduce((arr, el) => {
            //         if(mapIdToPermission[el.permissionPackId]){
            //             arr.push(mapIdToPermission[el.permissionPackId]);
            //         }
            //         return arr;
            //     }, []);
            //     this.$set(this.currentItemData, 'permissions', permissions);
            // }else{
            //     this.$snotifyError(res, "Can not get permission of role");
            // }
        },
        handleSavedItem(){
            this.$refs.listSystemRole.refreshList();
        },
        handleAddItem(){
            this.actionOnItem = 'create';
            this.currentItemData.name = '';
            this.currentItemData.objectType = '';
            this.currentItemData.mapActionAndObjects = [];
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
        ActionPackForm
    }
};
</script>
