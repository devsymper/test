<template>
    <div class="w-100 h-100">
        <list-items
            ref="listBAAccountList"
            :useDefaultContext="false"
            :pageTitle="$t('common.baAccount')"
            :tableContextMenu="tableContextMenu"
            :commonActionProps="commonActionProps"
            :containerHeight="containerHeight"
            :getDataUrl="getListUrl"
            :useActionPanel="true"
            :headerPrefixKeypath="'common'"
            :currentItemData="currentItemData"
            :customAPIResult="customAPIResult"
            @after-open-add-panel="handleAddItem"
        >
            <template slot="right-panel-content" slot-scope="{itemData}">
                <BAAccountForm
                    @saved-item-data="handleSavedItem"
                    :action="actionOnItem"
                    :itemData="itemData">
                </BAAccountForm>
            </template>
        </list-items>
    </div>
</template>
<script>
import { util } from "./../../plugins/util.js";
import { reformatGetListProcess } from "./../../components/process/reformatGetListData.js";
import { appConfigs } from "./../../configs.js";
import ListItems from "@/components/common/ListItems.vue";

import BAAccountForm from "./BAAccountForm.vue";
import { userApi } from '../../api/user.js';

export default {
    data() {
        let self = this;
        return {
            commonActionProps: {
                "module": "baAccount",
                "resource": "ba_account",
                "scope": "baAccount",
            },
            containerHeight: 300,
            actionOnItem: 'create',
            getListUrl: appConfigs.apiDomain.baAccount,
            currentItemData: {
                email: '',
                password: '',
                name: '',
            },
            customAPIResult: {
                reformatData(res){
                    if(res.status == 200){
                        return {
                            listObject: res.data.data,
                            total: res.data.total,
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
                                    name: "email",
                                    title: "email",
                                    type: "text"
                                }
                            ]
                        };
                    }else{
                        self.$snotifyError('Can not get list ba account', res);
                    }
                }
            },
            tableContextMenu: {
                update: {
                    name: "update",
                    text: this.$t("common.edit"),
                    callback: (row, callback) => {
                        self.actionOnItem = 'update';
                        self.applyDataToForm(row);
                    }
                },
                drop: {
                    name: "drop",
                    text: this.$t("common.delete"),
                    callback: async (rows, refreshList) => {
                        let ids = [];
                        for(let item of rows){
                            ids.push(item.id);
                        }
                        try {
                            let res = await userApi.deleteBAAccount(ids);
                            self.$snotifySuccess("Deleted "+ids.length+' items');
                        } catch (error) {
                            self.$snotifyError(error, "Can not delete selected items");
                        }
                        refreshList();
                    }
                },
                detail: {
                    name: "detail",
                    text: this.$t("common.detail"),
                    callback: (row, callback) => {
                        self.$refs.listBAAccountList.actionPanel = true;
                        self.actionOnItem = 'detail';
                        self.applyDataToForm(row);
                    }
                },
                update_password: {
                    name: "update_password",
                    text: this.$t("common.updatePassword"),
                    callback: (row, callback) => {
                        self.applyDataToForm(row);
                        self.$refs.listBAAccountList.actionPanel = true;
                        self.actionOnItem = 'updatePassword';
                    }
                },
            }
        };
    },
    mounted() {
        this.calcContainerHeight();
    },
    created() {},
    watch: {},
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
            this.$refs.listBAAccountList.refreshList();
        },
        handleAddItem(){
            this.actionOnItem = 'create';
            this.currentItemData.email = '';
            this.currentItemData.name = '';
            this.currentItemData.password = '';
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
        BAAccountForm
    }
};
</script>
