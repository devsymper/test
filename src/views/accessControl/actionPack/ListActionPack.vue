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
            :debounceRowSelectTime="200"
            :headerPrefixKeypath="'common'"
            :currentItemData="currentItemData"
			:showExportButton="false"
            :customAPIResult="customAPIResult"
            :actionPanelWidth="800"
            @after-open-add-panel="handleAddItem"
            :commonActionProps="commonActionProps"
        >
            <template slot="right-panel-content" slot-scope="{itemData}">
                <ActionPackForm
                    @trigger-update-action-pack="updateActionPack"
                    @saved-item-data="handleSavedItem"
                    @close-form="closeForm"
                    :action="actionOnItem"
                    :itemData="itemData"
					
                    ref="actionPackForm"
                ></ActionPackForm>
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
import ActionPackForm from "./actionPackPanel/ActionPackForm";
import { permissionApi } from "@/api/permissionPack";
export default {
    data() {
        let self = this;
        return {
            commonActionProps: {
                "module": "action_pack",
                "resource": "action_pack",
                "scope": "action_pack",
            },
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
            containerHeight: 300,
            actionOnItem: "create",
            getListUrl: appConfigs.apiDomain.actionPacks,
            currentItemData: {
                id: 0,
                name: "",
                description: "",
                objectType: "document_definition",
                mapActionAndObjects: {}, // dạng: {workflow: {objectId: 'acx', create: true}, document: {objectId: 'acx', create: true}}}
                mapActionForAllObjects: {}, // dạng: {workflow: {create: true, ...}, document: {create: true, ...}}},
                operationMapByObjectType: {}
            },
            tableContextMenu: {
                update: {
                    name: "edit",
                    text: this.$t("common.edit"),
                    callback: (row, callback) => {
                        self.updateActionPack(row);
                    }
                },
                remove: {
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
                detail: {
                    name: "detail",
                    text: this.$t("common.detail"),
                    callback: (row, callback) => {
                        self.detailActionPack(row);
                    }
                }
            },
        };
    },
    mounted() {
        this.calcContainerHeight();
    },
    created() {
		this.$store.dispatch("app/getAllBA");
        this.$store.dispatch("actionPack/getAllActionByObjectType");
    },
    watch: {},
    computed: {
        mapObjectTypesAndAction() {
            return this.$store.getters["actionPack/listActionByObjectType"];
        }
    },
    methods: {
        closeForm(){
            this.$refs.listActionPack.closeactionPanel();
        },
        detailActionPack(row){
            let self = this;
            self.$refs.listActionPack.actionPanel = true;
            self.getActionPackOperations(row.id);
            self.actionOnItem = "detail";
            self.applyDataToForm(row);
            self.$refs.actionPackForm.objectTypeToDocumentDefinition();
        },
        updateActionPack(row){
            let self = this;
            self.getActionPackOperations(row.id);
            self.actionOnItem = "update";
            self.applyDataToForm(row);
            self.$refs.actionPackForm.objectTypeToDocumentDefinition();
        },
        // onRowSelected(row){
        //     let self = this;
        // 	this.focusingUser = row;
        //     if(this.$refs.listActionPack.alwaysShowActionPanel){
        //         self.$refs.listActionPack.actionPanel = true;
        //         this.updateActionPack(row);
        //     }
        // },
        makeOperationMapByObjectType(idActionPack, operations){
            let allActionByObjectType = this.$store.state.actionPack.allActionByObjectType;
            
            let map = Object.keys(allActionByObjectType).reduce( (obj, objectType) => {
                obj[objectType] = [];
                return obj;
            }, {});

            for(let op of operations){
                op.objectType = op.objectType ? op.objectType : 'document_definition' 
                map[op.objectType].push(op);
            }
            this.currentItemData.operationMapByObjectType[idActionPack] = map;
        },
        async getActionPackOperations(id) {
            let res = await permissionApi.getActionPackOperations(id);
            let operations = [];
            if (res.status == 200) {
                operations = res.data;
            } else {
                this.$snotifyError(
                    res,
                    "Can not get operations from action pack " + id
                );
                return;
            }
            this.makeOperationMapByObjectType(id, operations);
            let tableDatas = this.getTableDataFromOperations(operations);
            let mapActionAndObjects = tableDatas.mapActionAndObjects;
            let mapActionForAllObjects = tableDatas.mapActionForAllObjects;
            
            this.$set(this.currentItemData, 'mapActionAndObjects', mapActionAndObjects);
            this.$set(this.currentItemData, 'mapActionForAllObjects', mapActionForAllObjects);
            setTimeout((self) => {
                self.$refs.actionPackForm.handleChangeObjectType();
            }, 200, this);
        },

        createRowsForAllInstancesDocDef(operationForInstancesOfDocDef, rowsOfDocDefs){
            this.$refs.actionPackForm.setRowsForAllInstancesDocDef(operationForInstancesOfDocDef, rowsOfDocDefs);
        },
        getTableDataFromOperations(operations){
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
             * Schema cho row mới của từng object type, có dạng:
             * {
             *      document_definition: ['', false, false, ...]
             * }
             */
            let rowSchemaByObjectType = {};
            for (let objType in mapActionAndObjectTypes) {
                mapActionAndObjects[objType] = {};
                rowSchemaByObjectType[objType] = {
                    object: '',
                };
                mapActionForAllObjects[objType] = [{}];
                for (let actionName in mapActionAndObjectTypes[objType]) {
                    rowSchemaByObjectType[objType][actionName] = false;
                    mapActionForAllObjects[objType][0][actionName] = false;
                }
            }
            
            // khởi tạo các operation ứng với các objectType
            let sections, objectType, objectId, actionName;
            let operationForInstancesOfDocDef = []; // danh sách các operation của các doc definition mà áp dụng cho tất cả các instance bên trong
            for (let op of operations) {
                sections = op.objectIdentifier.split(":");
                objectType = op.objectType;
                if(objectType == "department"){
                    if(sections[1] != '0'){
                        objectId = sections[1]+':'+sections[2]+':'+sections[3]
                    }
                }else{
                    objectId = sections[1] ? sections[1] : 0;
                }

                if(objectType == 'document_instance' && (sections[2] === 0 || sections[2] === '0')){
                    op.documentId = objectId;
                    operationForInstancesOfDocDef.push(op);
                    continue;
                }
 
                if(!objectId || objectId == '0'){
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
                            if(allResource[objectType][objectId]){
                                actionByObject[objectId].object =
                                    allResource[objectType][objectId].fullText;
                            }else{
                                actionByObject[objectId].object = objectType== "department" ? objectId : '';
                            }
                        }
                        if(op.action){
                            actionByObject[objectId][op.action] = true;
                        }
                    }
                }
            }

            this.createRowsForAllInstancesDocDef(operationForInstancesOfDocDef, mapActionAndObjects['document_definition']);
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
            return {
                mapActionAndObjects,
                mapActionForAllObjects
            }
        },
        handleSavedItem() {
            this.$refs.listActionPack.refreshList();
        },
        handleAddItem() {
            this.actionOnItem = "create";
            this.currentItemData.name = "";
            this.currentItemData.id = 0;
            this.currentItemData.description = "";
            this.currentItemData.objectType = "document_definition";

            this.$set(this.currentItemData, 'mapActionAndObjects', {});
            this.$set(this.currentItemData, 'mapActionForAllObjects', {});
            this.$refs.actionPackForm.objectTypeToDocumentDefinition();
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
