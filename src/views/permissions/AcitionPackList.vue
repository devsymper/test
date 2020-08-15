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
            @after-open-add-panel="handleAddItem"
        >
            <template slot="right-panel-content" slot-scope="{itemData}">
                <ActionPackForm
                    @saved-item-data="handleSavedItem"
                    :action="actionOnItem"
                    :itemData="itemData"
                ></ActionPackForm>
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
import { permissionPackageApi } from "../../api/PermissionPackage";
import { permissionApi } from "../../api/permissionPack";
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
            actionOnItem: "create",
            getListUrl: appConfigs.apiDomain.actionPacks,
            currentItemData: {
                name: "",
                description: "",
                objectType: "document_definition",
                mapActionAndObjects: {}, // dạng: {workflow: {objectId: 'acx', create: true}, document: {objectId: 'acx', create: true}}}
                mapActionForAllObjects: {} // dạng: {workflow: {create: true, ...}, document: {create: true, ...}}}
            },
            tableContextMenu: [
                {
                    name: "edit",
                    text: this.$t("common.edit"),
                    callback: (row, callback) => {
                        self.getActionPackOperations(row.id);
                        self.actionOnItem = "update";
                        self.applyDataToForm(row);
                    }
                },
                {
                    name: "remove",
                    text: this.$t("common.delete"),
                    callback: async (rows, refreshList) => {
                        let ids = [];
                        for (let item of rows) {
                            ids.push(item.id);
                        }
                        try {
                            let res = await permissionApi.deleteActionPack(ids);
                            if (res.status == 200) {
                                self.$snotifySuccess(
                                    "Deleted " + ids.length + " items"
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
                    }
                },
                {
                    name: "detail",
                    text: this.$t("common.detail"),
                    callback: (row, callback) => {
                        self.$refs.listActionPack.actionPanel = true;
                        self.getDetailActionPack(row.id);
                        self.actionOnItem = "detail";
                        self.applyDataToForm(row);
                    }
                }
            ]
        };
    },
    mounted() {
        this.calcContainerHeight();
        setTimeout(
            self => {
                self.$refs.listActionPack.addItem();
            },
            500,
            this
        );
    },
    created() {
        this.$store.dispatch("actionPack/getAllActionByObjectType");
    },
    watch: {},
    computed: {
        mapObjectTypesAndAction() {
            return this.$store.getters["actionPack/listActionByObjectType"];
        }
    },
    methods: {
        async getActionPackOperations(id) {
            let res = await permissionApi.getActionPackOperations(id);
            let operations = [];
            if (res.status == 200) {
                operations = res.data;
                // operations = [ { id: "38", name: "list trash document_definition 1538", description: "", action: "list_trash", objectName: "", objectIdentifier: "document_definition", objectType: "", status: "1", listForeignKey: [] }, { id: "39", name: "list trash document_definition 1538", description: "", action: "list_trash", objectName: "", objectIdentifier: "document_definition", objectType: "", status: "1", listForeignKey: [] }, { id: "40", name: "list instance document_definition 1538", description: "", action: "list_instance", objectName: "", objectIdentifier: "document_definition:1538", objectType: "", status: "1", listForeignKey: [] }, { id: "41", name: "list instance document_definition 1538", description: "", action: "list_instance", objectName: "", objectIdentifier: "document_definition", objectType: "", status: "1", listForeignKey: [] }, { id: "42", name: "create document_definition 1766", description: "", action: "create", objectName: "", objectIdentifier: "document_definition:1766", objectType: "", status: "1", listForeignKey: [] }, { id: "43", name: "edit document_definition 1766", description: "", action: "edit", objectName: "", objectIdentifier: "document_definition:1766", objectType: "", status: "1", listForeignKey: [] }, { id: "44", name: "submit document_definition 1766", description: "", action: "submit", objectName: "", objectIdentifier: "document_definition:1766", objectType: "", status: "1", listForeignKey: [] }, { id: "45", name: "drop document_definition 1766", description: "", action: "drop", objectName: "", objectIdentifier: "document_definition:1766", objectType: "", status: "1", listForeignKey: [] }, { id: "46", name: "restore document_definition 1766", description: "", action: "restore", objectName: "", objectIdentifier: "document_definition:1766", objectType: "", status: "1", listForeignKey: [] }, { id: "47", name: "list document_definition 1766", description: "", action: "list", objectName: "", objectIdentifier: "document_definition:1766", objectType: "", status: "1", listForeignKey: [] }, { id: "48", name: "list trash document_definition 1766", description: "", action: "list_trash", objectName: "", objectIdentifier: "document_definition:1766", objectType: "", status: "1", listForeignKey: [] }, { id: "49", name: "list instance document_definition 1766", description: "", action: "list_instance", objectName: "", objectIdentifier: "document_definition:1766", objectType: "", status: "1", listForeignKey: [] }, { id: "50", name: "create document_definition 1765", description: "", action: "create", objectName: "", objectIdentifier: "document_definition:1765", objectType: "", status: "1", listForeignKey: [] }, { id: "51", name: "edit document_definition 1765", description: "", action: "edit", objectName: "", objectIdentifier: "document_definition:1765", objectType: "", status: "1", listForeignKey: [] }, ];
            } else {
                this.$snotifyError(
                    res,
                    "Can not get operations from action pack " + id
                );
                return;
            }

            let mapActionAndObjectTypes = this.mapObjectTypesAndAction;
            let allResource = this.$store.state.actionPack.allResource;

            /**
             * Map giữa object type và action , có dạng
             * {
             *      document_definition: {
             *          id_doc: [
             *              'display text', true, true, false ....
             *          ]
             *      }
             * }
             */
            let mapActionAndObjects = {};
            let mapActionForAllObjects = {};


            /**
             * Schema cho row mới của từ object type, có dạng:
             * {
             *      document_definition: ['', false, false, ...]
             * }
             */
            let rowSchemaByObjectType = {};
            for (let key in mapActionAndObjectTypes) {
                mapActionAndObjects[key] = {};
                rowSchemaByObjectType[key] = {
                    object: '',
                };
                mapActionForAllObjects[key] = [{}];
                for (let actionName in mapActionAndObjectTypes[key]) {
                    rowSchemaByObjectType[key][actionName] = false;
                    mapActionForAllObjects[key][0][actionName] = false;
                }
            }
            
            // khởi tạo các operation ứng với các objectType
            let sections, objectType, objectId, actionName;
            for (let op of operations) {
                sections = op.objectIdentifier.split(":");
                objectType = sections[0];
                objectId = sections[1] ? sections[1] : 0;

                if(!objectId){
                    // Nếu các action áp dụng cho toàn bộ object của object type
                    mapActionForAllObjects[objectType][0][op.action] = true;
                }else{
                    // Nếu áp dụng cho các object cụ thể
                    let actionByObject = mapActionAndObjects[objectType];
                    if (actionByObject) {
                        if (!actionByObject[objectId]) {
                            actionByObject[objectId] = util.cloneDeep(
                                rowSchemaByObjectType[objectType]
                            );
                            actionByObject[objectId].object =
                                allResource[objectType][objectId].fullText;
                        }
                        actionByObject[objectId][op.action] = true;
                    }
                }
            }

            // chế biến về cho đúng định dạng hiển thị của bảng
            for(let objectType in mapActionAndObjects){
                mapActionAndObjects[objectType] = Object.values(mapActionAndObjects[objectType]);

                let lastEmptyRow = util.cloneDeep(rowSchemaByObjectType[objectType]);
                for(let actionName in lastEmptyRow){
                    if(actionName != 'object'){
                        lastEmptyRow[actionName] = true;
                    }
                }
                mapActionAndObjects[objectType].push(lastEmptyRow);

            }
            
            this.$set(this.currentItemData, 'mapActionAndObjects', mapActionAndObjects);
            this.$set(this.currentItemData, 'mapActionForAllObjects', mapActionForAllObjects);
        },
        handleSavedItem() {
            this.$refs.listActionPack.refreshList();
            if(this.actionOnItem = "create"){
                this.handleAddItem();
            }
        },
        handleAddItem() {
            this.actionOnItem = "create";
            this.currentItemData.name = "";
            this.currentItemData.description = "";
            this.currentItemData.objectType = "document_definition";
            this.currentItemData.mapActionAndObjects = [];
            this.currentItemData.mapActionForAllObjects = [];
        },
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        },
        applyDataToForm(row) {
            for (let key in row) {
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
