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
import { util } from '../../plugins/util';
import CustomSelect from "./HandsonCustomSelect";
import { permissionApi } from '../../api/permissionPack';
import { permissionPackageApi } from '../../api/PermissionPackage';



export default {
    mounted(){
        this.tableHeight = util.getComponentSize(this).h - util.getComponentSize(this.$refs.comonAttr).h - 180;
    },
    created(){
        this.getObjectsOfObjectType();
    },
    methods: { 
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
        getDataSchema(){
            let objectType = this.allInputs.objectType.value;
            let schema = {
                object: ''
            };
            if(this.listAction[objectType]){
                for(let actionKey in this.listAction[objectType]){
                    schema[actionKey] = true;
                }
            }
            return schema;
        },
        getTableColumns(){
            let self = this;
            let cols = this.getActionAsColumns();
            cols.unshift(
            {
                data: "object",
                type: "autocomplete",
                width: 400,
                source: function (query, process) {
                    let objectType = self.allInputs.objectType.value;
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
            this.getObjectsOfObjectType();
            this.setTableData();
            this.setTableDataForObjectType();
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
        getNewOperationData(){
            let newOperations = [];
            let allResource = this.$store.state.actionPack.allResource;
            for(let objectType in this.itemData.mapActionAndObjects){
                let dataTable = this.itemData.mapActionAndObjects[objectType];
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
            }

            for(let objectType in this.itemData.mapActionForAllObjects){
                let dataTable = this.itemData.mapActionForAllObjects[objectType];
                let row = dataTable[0];
                if(allResource.hasOwnProperty(objectType)){
                    for(let actionName in row){
                        if(row[actionName]){
                            newOperations.push({
                                objectType: objectType,
                                action: actionName,
                                objectIdentifier: objectType,
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
        getActionAsColumns(){
            let self = this;
            let objectType = this.allInputs.objectType.value;
            let listAction = this.listAction[objectType];
            let cols = [];
            if(listAction){
                for(let actionKey in listAction){
                    cols.push({
                        data: actionKey,
                        type: "checkbox"
                    });
                }
            }
            return cols;
        },
        getColumnHeadersFromAction(){
            let objectType = this.allInputs.objectType.value;
            let arr = [];
            let listAction = this.listAction[objectType];

            if(listAction){
                for(let actionKey in listAction){
                    let el = listAction[actionKey];
                    arr.push(el.title);
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
        return {
            tableHeight: 200,
            isEditingCell : false,
            tableColumnsForObjectType: [],
            tableColumns: [],
            dataSchema: [],
            tableData: [],
            tableDataForObjectType: [],
            tableSettings: {
                ...commonTableSetting,
                afterChange: function(changes, source) {
                    if(!changes){
                        return;
                    }
                    let htIst = this;
                    console.log(changes, source, htIst);
                    let lastIndex = htIst.getData().length;
                    if(changes[0][0] == lastIndex - 1){
                        this.alter('insert_row', lastIndex + 1, 1, 'add_row_on_enter');
                    }
                    setTimeout(function() {
                        htIst.selectCell(lastIndex, htIst.propToCol(changes[0][1]));
                        self.itemData.mapActionAndObjects[self.itemData.objectType] = htIst.getSourceData();
                    }, 0);

                },
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
        }
    },
    components: {
        FormTpl,
        HotTable,
        CustomSelect,
        HotColumn
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
        // Tiêu đề của các cột  cần hiển thị
        colHeaders() {
            return ["Objects"].concat(this.getColumnHeadersFromAction());
        },
        colHeadersForObjectType(){
            return this.getColumnHeadersFromAction();
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
            handler(){
                this.handleChangeObjectType();
            }
        }
    }
}
</script>

<style>
</style>
