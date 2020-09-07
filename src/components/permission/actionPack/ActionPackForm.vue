<template>
    <div class="pa-2 h-100">
        <FormTpl
            ref="comonAttr"
            :viewOnly="action == 'detail'"
            :singleLine="false"
            :allInputs="allInputs"
            @input-value-changed="handleInputValueChange"
        >
        </FormTpl> 

        <div class="w-100">
            <div class="my-2 fs-12">
                {{$t('permissions.actionPack.allOperation')}}
            </div>
            <hot-table
                :settings="tableSettingsForObjectType"
                :data="tableDataForObjectType"
                :height="55"
                :columns="tableColumnsForObjectType"
                :colHeaders="colHeadersForObjectType"
                class="fs-13"
                ref="dataTableForObjectType">

            </hot-table>
        </div>

        <div class="w-100">
            <div class="my-2 fs-12">
                {{$t('permissions.actionPack.operation')}}
            </div>
            <hot-table
                :settings="tableSettings"
                :data="tableData"
                :height="tableHeight"
                :columns="tableColumns"
                :colHeaders="colHeaders"
                :dataSchema="dataSchema"
                class="fs-13"
                ref="dataTable">

            </hot-table>
        </div>

        <ObjectInApplication 
            v-if="allInputs.objectType.value == 'application_definition'"
            :tableDataDefinition="multipleLevelObjects.application_definition"
            :commonTableSetting="commonTableSetting"
            :idApplication="focusingIdApplication"
            @app-detail-get="translateAppObjectIdToTableData" />

        <DocumentInstanceOperation 
            v-if="allInputs.objectType.value == 'document_definition'"
            :tableDataDefinition="multipleLevelObjects.document_definition"
            :commonTableSetting="commonTableSetting"
            :tableHeight="tableHeight - 32"/>

        <div class="mt-2" v-if="action != 'view' ">
            <v-btn
                class="float-right mr-1"
                small
                depressed
                color="primary"
                @click="saveActionPack">

                <v-icon class="mr-2" primary>mdi-content-save</v-icon>
                {{action == 'create' ? $t('common.save') : $t('common.update')}}
            </v-btn>
        </div>
    </div>
</template>

<script>
import FormTpl from "@/components/common/FormTpl.vue";
import { HotTable, HotColumn } from "@handsontable/vue";
import { util } from '../../../plugins/util';
import CustomSelect from ".././HandsonCustomSelect";
import { permissionApi } from '../../../api/permissionPack';
import { permissionPackageApi } from '../../../api/PermissionPackage';
import ObjectInApplication from "./ObjectInApplication";
import DocumentInstanceOperation from "./DocumentInstanceOperation";

let defaultTabConfig = {
    tableData: [],
    columns: [],
    colHeaders: [],
    dataSchema: []
};

const actionForObjectType = {
    create: true,
    list: true
};

let commonTableSetting = {
    // các setting cho handsontable
    filters: true,
    manualColumnMove: true,
    manualColumnResize: true,
    manualRowResize: true,
    stretchH: "all",
    rowHeaders: true,
    licenseKey: "non-commercial-and-evaluation",
}
export default {
    mounted(){
        this.reCaculateTableHeight();
    },
    created(){
    },
    methods: { 
        caculateTableDataForAllInstancesDocDef(rowsOfDocDefs){
            let operationForInstancesOfDocDef = this.multipleLevelObjects.document_definition.savedOpsForAllInstancesDocDef;
            operationForInstancesOfDocDef = operationForInstancesOfDocDef ? operationForInstancesOfDocDef : [];
            let dataTable = util.cloneDeep(rowsOfDocDefs);
            for(let docId in dataTable){
                for(let action in dataTable[docId]){
                    if(action != 'object'){
                        dataTable[docId][action] = false;
                    }
                }
            }

            for(let op of operationForInstancesOfDocDef){
                dataTable[op.documentId][op.action] = true;
            }
            this.multipleLevelObjects.document_definition.tableData = Object.values(dataTable);
        },
        setRowsForAllInstancesDocDef(operationForInstancesOfDocDef, rowsOfDocDefs){
            this.multipleLevelObjects.document_definition.savedOpsForAllInstancesDocDef = operationForInstancesOfDocDef;
            this.caculateTableDataForAllInstancesDocDef(rowsOfDocDefs);
        },
        genDocumentInstanceOperations(){
            let docDefs = this.itemData.mapActionAndObjects['document_definition'];
            let initDocObjDataTable = {};
            let schema = this.getDataSchema('document_instance', false);

            for(let row of docDefs){
                let key = row['object'];
                if(key){
                    let id = key.slice(0, key.indexOf(' -'));
                    let newRow = util.cloneDeep(schema);
                    newRow.object = row.object;
                    initDocObjDataTable[id] = newRow;
                }
            }
            // this.multipleLevelObjects.document_definition.tableData = initDocObjDataTable;
            this.caculateTableDataForAllInstancesDocDef(initDocObjDataTable);
        },
        objectTypeToDocumentDefinition(){
            // debugger
            // this.itemData.objectType = 'document_definition'
            // this.allInputs.objectType.value = 'document_definition'
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

                            if(allResource[objectType][objectId]){
                                actionByObject[objectId].object =
                                    allResource[objectType][objectId].fullText;
                            }else{
                                actionByObject[objectId].object = '';
                            }
                        }
                        if(op.action){
                            actionByObject[objectId][op.action] = true;
                        }
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
            
            return {
                mapActionAndObjects,
                mapActionForAllObjects
            }
        },
        initAllResource(needInitResources){
            // let needInitResources = [
            //     'document_definition',
            //     'workflow_definition',
            //     'orgchart',
            //     'dashboard'
            // ];
            for(let type of needInitResources){
                this.getObjectsOfObjectType(type);
            }
        },
        async translateAppObjectIdToTableData(data){
            let appId = data.id;
            let objs = data.objects;
            let actionPackId = this.itemData.id;
            let initOperations = {}; // các operation mà có action rỗng để đảm bảo luôn hiển thị các object của app ngay cả khi các object này chưa có quyền
            let objectTypeDataTable = {};
            // let allOperation = await permissionApi.

            if(Number(appId) > 0){
                let objsOfApp = this.multipleLevelObjects.application_definition;
                for(let objectType in objsOfApp){
                    objsOfApp[objectType].tableData = [];
                }
            }

            for(let objectType in objs){
                initOperations[objectType] = {};
                for(let obj of objs[objectType]){
                    let objIdentify = objectType+":"+obj.id;
                    initOperations[objectType][objIdentify] = {
                        objectIdentifier: objIdentify,
                        objectType: objectType,
                    };
                }
            }

            let savedOperations = {};
            for(let objectType in initOperations){
                savedOperations[objectType] = [];
                if(this.itemData.operationMapByObjectType[actionPackId]){
                    for(let op of this.itemData.operationMapByObjectType[actionPackId][objectType]){
                        if(initOperations[objectType][op.objectIdentifier]){
                            savedOperations[objectType].push(op);
                        }
                    }
                }
            }

            for(let objectType in objs){
                objectTypeDataTable[objectType] = [];
                let operations = Object.values(initOperations[objectType]);
                if(savedOperations[objectType]){
                    operations = operations.concat(savedOperations[objectType]);
                }
                let dataTable = this.getTableDataFromOperations(operations);
                objectTypeDataTable[objectType] = dataTable.mapActionAndObjects[objectType];
            }

            for(let objectType in objectTypeDataTable){
                this.multipleLevelObjects.application_definition[objectType].tableData = objectTypeDataTable[objectType];
            }
        },
        setConfigForApplicationObjects(){
            let appDef = this.multipleLevelObjects.application_definition;
            for(let key in appDef){
                appDef[key].columns = this.getTableColumns(key);
                appDef[key].colHeaders = ['Objects'].concat(this.getColumnHeadersFromAction(['create'], key));
                appDef[key].dataSchema = this.getDataSchema(key);
            }
        },
        setConfigForDocumentInstanceOperations(){
            let docObjDef = this.multipleLevelObjects.document_definition;
            let key = 'document_instance';

            docObjDef.columns = this.getTableColumns(key);
            this.$set(docObjDef.columns[0],'readOnly',true);
            docObjDef.colHeaders = ['Documents'].concat(this.getColumnHeadersFromAction(['create'], key));
            docObjDef.dataSchema = this.getDataSchema(key, false);
        },
        triggerRerenderTable(){
            setTimeout((self) => {
                if(self.$refs.dataTable){
                    self.$refs.dataTable.hotInstance.updateSettings({});
                }

                if(self.$refs.dataTableForObjectType){
                    self.$refs.dataTableForObjectType.hotInstance.updateSettings({});
                }
            }, 2000, this);
        },
        getDataSchema(objectType = null, defaultValue = true){
            if(!objectType){
                objectType = this.allInputs.objectType.value;
            }
            let schema = {
                object: ''
            };
            if(this.listAction[objectType]){
                for(let actionKey in this.listAction[objectType]){
                    schema[actionKey] = defaultValue;
                }
            }
            return schema;
        },
        getTableColumns(objectType = null){
            if(!objectType){
                objectType = this.allInputs.objectType.value;
            }
            let self = this;
            let cols = this.getActionAsColumns(['create'], objectType);
            cols.unshift(
            {
                data: "object",
                type: "autocomplete",
                width: 400,
                source: function (query, process) {
                    if(self.allResourceForSearch[objectType]){
                        process(self.allResourceForSearch[objectType]);
                    }else{
                        process([]);
                    }
                }
            });
            return cols;
        },
        handleInputValueChange(name, inputInfo, data){
            if(name == 'objectType'){
                this.handleChangeObjectType();
            }
        },
        handleChangeObjectType(){
            this.dataSchema = this.getDataSchema();
            this.tableColumnsForObjectType = this.getActionAsColumns();
            this.tableColumns = this.getTableColumns();

            this.colHeaders = ["Objects"].concat(this.getColumnHeadersFromAction(['create']));
            this.colHeadersForObjectType = this.getColumnHeadersFromAction();
            // Tiêu đề của các cột  cần hiển thị

            this.getObjectsOfObjectType();
            this.setTableData();
            this.setTableDataForObjectType();
            this.reCaculateTableHeight();
        },
        reCaculateTableHeight(){
            let h = util.getComponentSize(this).h - util.getComponentSize(this.$refs.comonAttr).h - 180;
            if(this.allInputs.objectType.value == 'application_definition'){
                h = h*2/3;
            }else if(this.allInputs.objectType.value == 'document_definition'){
                h = h/2;
            }
            this.tableHeight = h;
        },
        setTableData(){
            let objectType = this.allInputs.objectType.value;
            let rows = this.itemData.mapActionAndObjects[objectType];
            if(rows && rows.length){
                this.tableData =  rows;
            }else{
                this.tableData = [{}];
            }

            if(this.$refs.dataTable){
                this.$refs.dataTable.hotInstance.updateSettings({});
            }
        },
        setTableDataForObjectType(){
            let objectType = this.allInputs.objectType.value;
            let rows = this.itemData.mapActionForAllObjects[objectType];
            if(rows && rows.length){
                this.tableDataForObjectType = rows;
            }else{
                this.tableDataForObjectType = [{}];
            }

            if(this.$refs.dataTableForObjectType){
                this.$refs.dataTableForObjectType.hotInstance.updateSettings({});
            }
        },
        createNewOperations(){
            let self = this;
            return new Promise(async (resolve, reject) => {
                let newOperations = this.getNewOperationData();
                let data = {
                   operations : JSON.stringify(newOperations)
                };
                let res = await permissionApi.createMultipleOperation(data);
                if(res.status == 200){
                    resolve(res.data);
                }else{
                    self.$snotifyError(res, "Can not create new operation!");
                    reject(res);
                }
            });
        },
        getOperationToSaveFromDataTable(dataTable, allResource, objectType){
            let newOperations = [];
            for (let row of dataTable) {
                let key = row['object'];
                let id = '';
                if(key){
                    id = key.slice(0, key.indexOf(' -'));
                }
                
                if(allResource.hasOwnProperty(objectType) ){
                    if(allResource[objectType][id]){
                        for(let actionName in row){
                            if(actionName == 'object'){
                                continue
                            }
                            if(row[actionName]){
                                newOperations.push({
                                    objectType: objectType,
                                    action: actionName,
                                    objectIdentifier: allResource[objectType][id].objectIdentifier,
                                    name: actionName.replace(/_/g, ' ') + ' '+ objectType.replace(/_/g, ' ') + ' ' + id
                                });
                            }
                        }
                    }else if(key.trim() != ''){
                        for(let actionName in row){
                            if(actionName == 'object'){
                                continue
                            }
                            if(row[actionName]){
                                newOperations.push({
                                    objectType: objectType,
                                    action: actionName,
                                    objectIdentifier: key,
                                    name: key
                                });
                            }
                        }
                    }
                }
            }
            return newOperations;
        },
        removeDuplicateOperations(newOperations){
            let opMap = newOperations.reduce( (map, op) => {
                map[op.objectIdentifier+'|||'+op.action] = op;
                return map;
            }, {});
            return Object.values(opMap);
        },


        /**
         * Tạo operation cho tất cả document instance trong màn hình cấu hình action cho các document definition
         */
        getOperationForAllDocInstance(){
            let objectType = 'document_instance';
            let dataTable = this.multipleLevelObjects.document_definition.tableData
            let newOperations = [];
            let rowSchema = this.getDataSchema(objectType);
            delete rowSchema.object;

            for (let row of dataTable) {
                let key = row['object'];
                let id = '';
                if(key){
                    id = key.slice(0, key.indexOf(' -'));
                    id = id.trim();
                }

                if(id){
                    for(let actionName in row){
                        if(actionName == 'object' || !rowSchema.hasOwnProperty(actionName)){
                            continue
                        }
                        if(row[actionName]){
                            newOperations.push({
                                objectType: objectType,
                                action: actionName,
                                objectIdentifier: `${objectType}:${id}:0`,
                                name: actionName.replace(/_/g, ' ') + ' for all instance of document definition ' + id
                            });
                        }
                    }
                }
            }
            return newOperations;
        },
        getNewOperationData(){
            let newOperations = [];
            let allResource = this.$store.state.actionPack.allResource;
            for(let objectType in this.itemData.mapActionAndObjects){
                let dataTable = this.itemData.mapActionAndObjects[objectType];
                newOperations = newOperations.concat(this.getOperationToSaveFromDataTable(dataTable, allResource, objectType));
            }
            
            for(let objectType in this.multipleLevelObjects.application_definition){
                let dataTable = this.multipleLevelObjects.application_definition[objectType].tableData;
                newOperations = newOperations.concat(this.getOperationToSaveFromDataTable(dataTable, allResource, objectType));
            }

            newOperations = newOperations.concat(this.getOperationForAllDocInstance());
            newOperations = this.removeDuplicateOperations(newOperations);

            for(let objectType in this.itemData.mapActionForAllObjects){
                let dataTable = this.itemData.mapActionForAllObjects[objectType];
                let row = dataTable[0];

                if(allResource.hasOwnProperty(objectType)){
                    for(let actionName in row){
                        let objectIdentifier = actionForObjectType[actionName] ? objectType : (objectType + ':0' );
                        if(row[actionName]){
                            newOperations.push({
                                objectType: objectType,
                                action: actionName,
                                objectIdentifier: objectIdentifier,
                                name: actionName.replace(/_/g, ' ') + ' '+ objectType.replace(/_/g, ' ')
                            });
                        }
                    }
                }
            }
            return newOperations;
        },
        async saveActionPack(){
            let listNewOperations = await this.createNewOperations();
            let operationsIds = listNewOperations.reduce((arr, el) => {
                arr.push(el.id);
                return arr;
            }, []);
            let dataToSave = {
                name: this.allInputs.name.value,
                type: 'ba',
                description: this.allInputs.description.value,
                listOperations: JSON.stringify(operationsIds)
            };

            let res;
            try {
                if(this.action == 'update'){
                    res = await permissionApi.updateActionPack(this.itemData.id, dataToSave);
                    if(res.status == '200'){
                        this.$snotifySuccess("Updated item successfully");
                    }else{
                        this.$snotifyError(res, "Error when update item");
                    }
                }else if(this.action == 'create'){
                    res = await permissionApi.createActionPack(dataToSave);
                    if(res.status == '200'){
                        this.$snotifySuccess("Create item successfully");
                    }else{
                        this.$snotifyError(res, "Error when create item");
                    }
                }
                this.$emit('saved-item-data',res);
            } catch (error) {
                this.$snotifyError(error, "Error when save item");
            }
        },
        handleEditorShow(data){
            this.isEditingCell = data;
        },
        async getObjectsOfObjectType(objectType = null){
            let allResource = this.$store.state.actionPack.allResource;
            if(!objectType){
                objectType = this.allInputs.objectType.value;
            }
            if(!allResource[objectType]){
                let res = await permissionApi.getObjectsByObjectType({
                    type : objectType,
                    pageSize: 2000,
                    page: 1
                });

                if(res.status == 200){
                    let dataToStore = this.translateDataToStore(res.data, objectType);
                    this.$store.commit('actionPack/cacheAllResourceItem',{
                        type: objectType,
                        data: dataToStore
                    });
                }else{
                    this.$snotifyError(res, "Can not get objects of " + objectType);
                }
            }
        },
        translateDataToStore(items, type){
            let resources = items.reduce((obj, el) => {
                let iden = el.objectIdentifier;
                let id = iden.substring(iden.lastIndexOf(':') + 1, iden.length);
                obj[id] = {
                    id: id,
                    name: el.name,
                    title: el.title ? el.title : '',
                    fullText: `${id} - ${el.name} ${el.title ? (' : ' + el.title) : ''} `,
                    objectIdentifier: iden
                };
                return obj; 
            }, {});
            return resources;
        },
        getActionAsColumns(ignoreColumns = [], objectType = null){
            ignoreColumns = ignoreColumns.reduce((obj, el) => {
                obj[el] = true;
                return obj;
            }, {});
            let self = this;
            if(!objectType){
                objectType = this.allInputs.objectType.value;
            }

            let listAction = this.listAction[objectType];
            let cols = [];
            if(listAction){
                for(let actionKey in listAction){
                    if(!ignoreColumns[actionKey]){
                        cols.push({
                            data: actionKey,
                            type: "checkbox"
                        });
                    }
                }
            }
            return cols;
        },
        getColumnHeadersFromAction(ignoreColumns = [], objectType = null){
            ignoreColumns = ignoreColumns.reduce((obj, el) => {
                obj[el] = true;
                return obj;
            }, {});

            if(!objectType){
                objectType = this.allInputs.objectType.value;
            }
            let arr = [];
            let listAction = this.listAction[objectType];

            if(listAction){
                for(let actionKey in listAction){
                    if(!ignoreColumns[actionKey]){
                        let el = listAction[actionKey];
                        let nameAction  = el.title.toLowerCase();
                        arr.push(this.$t('actions.listActions.document.'+ nameAction));
                       // arr.push(this.$t(nameAction));

                    }
                }
            }
            return arr;
        },
        getObjectTypeSelections(){
            let allActionByObjectType = this.$store.state.actionPack.allActionByObjectType;
            let rsl = [];
            for(let key in allActionByObjectType){
                rsl.push({
                    text: util.str.getCamelSpaceFromPascalText(key),
                    value: key
                });
            }
            return rsl;
        }
    },
    data(){
        let self = this;
        return {
            tableHeight: 200,
            isEditingCell : false,
            tableColumnsForObjectType: [],
            tableColumns: [],
            dataSchema: [],
            tableData: [],
            tableDataForObjectType: [],
            commonTableSetting : commonTableSetting,
            tableSettings: {
                ...commonTableSetting,
                afterChange: function(changes, source) {
                    if(!changes){
                        return;
                    }
                    let htIst = this;
                    let lastIndex = htIst.getData().length;
                    if(changes[0][0] == lastIndex - 1){
                        this.alter('insert_row', lastIndex + 1, 1, 'add_row_on_enter');
                    }
                    setTimeout(function() {
                        let objectType = self.allInputs.objectType.value;
                        htIst.selectCell(lastIndex, htIst.propToCol(changes[0][1]));
                        self.itemData.mapActionAndObjects[objectType] = htIst.getSourceData();

                        if(objectType == 'document_definition'){
                            self.genDocumentInstanceOperations();
                        }
                    }, 0);
                },
                afterSelectionEnd(rowNum	, column, row2 , column2 , preventScrolling, selectionLayerLevel){
                    let objectType = self.allInputs.objectType.value;
                    if(objectType == 'application_definition'){
                        let object = this.getDataAtRow(rowNum)[0];
                        if(object){
                            let id = String(object).split(' ')[0].trim();
                            if(!isNaN(id)){
                                self.focusingIdApplication = Number(id);
                            }else{
                                self.focusingIdApplication = 0;
                            }
                        }else{
                            self.focusingIdApplication = 0;
                        }
                    }
                }
            },
            tableSettingsForObjectType: {
                ...commonTableSetting,
                afterChange: function(changes, source) {
                    let htIst = this;
                    setTimeout(function() {
                        self.itemData.mapActionForAllObjects[self.itemData.objectType] = htIst.getSourceData();
                    }, 0);
                },
            },

            // cấu trúc data giành cho các loại đối tượng có nhiều tầng object settings
            multipleLevelObjects: {
                application_definition: {
                    document_definition : util.cloneDeep(defaultTabConfig),
                    workflow_definition : util.cloneDeep(defaultTabConfig),
                    orgchart : util.cloneDeep(defaultTabConfig),
                    dashboard : util.cloneDeep(defaultTabConfig),
                },
                document_definition: util.cloneDeep(defaultTabConfig),
            },
            focusingIdApplication: 0,
            // Tiêu đề của các cột  cần hiển thị
            colHeaders: [],
            colHeadersForObjectType: [],
        }
    },
    components: {
        FormTpl,
        HotTable,
        CustomSelect,
        HotColumn,
        ObjectInApplication,
        DocumentInstanceOperation
    },
    props: {
        itemData: {
            type: Object,
            default(){
                return {}
            }
        },
        action: {
            type: String,
            default: ''
        }
    },
    computed: {
        mapObjectTypesAndAction() {
            return this.$store.getters["actionPack/listActionByObjectType"];
        },
        // các action ứng với object type
        listAction() {
            return this.$store.getters['actionPack/listActionByObjectType'];
        },
        allResourceForSearch(){
            let rsl = {};
            let allResource = this.$store.state.actionPack.allResource;
            for(let name in allResource){
                rsl[name] = [];
                for(let resourceId in allResource[name]){
                    rsl[name].push(allResource[name][resourceId].fullText);
                }
            }
            return rsl;
        },
        allInputs(){
            return {
                name: {
                    "title": this.$t('common.name'),
                    "type": "text",
                    "value": this.itemData.name,
                    "info": "",
                },
                description: {
                    "title": this.$t('common.description'),
                    "type": "text",
                    "value": this.itemData.description,
                    "info": "",
                },
                objectType: {
                    "title": this.$t('permissions.actionPack.objectType'),
                    "type": 'select',
                    "value": this.itemData.objectType,
                    "info": "",
                    options: this.getObjectTypeSelections()
                }
            };
        }, 
    },
    watch: {
        listAction: {
            immediate: true,
            deep: true,
            handler(value){
                this.handleChangeObjectType();
                if(!$.isEmptyObject(value)){
                    this.setConfigForApplicationObjects();
                    this.setConfigForDocumentInstanceOperations();
                    this.initAllResource(Object.keys(value));
                }
            }
        }
    }
}
</script>

<style>
</style>
