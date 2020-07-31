<template>
    <div class="pa-2 h-100">
        <FormTpl
            ref="comonAttr"
            :viewOnly="action == 'detail'"
            :singleLine="false"
            :allInputs="allInputs"
        >
        </FormTpl> 

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



export default {
    mounted(){
        this.tableHeight = util.getComponentSize(this).h - util.getComponentSize(this.$refs.comonAttr).h - 90;
    },
    created(){
        let self = this;
        this.$evtBus.$on('symper-cache-set-all-resource', (data) => {
            if(!self._inactive){
                self.setAllItemOfResource(data);
            }
        });
        
        self.setAllItemOfResource();
    },
    methods: {

        createNewOperation(){
            let self = this;

            return new Promise((resolve, reject) => {
                let newOperations = this.getNewOperationData();
                let apiPromises = [];
                for(let op of newOperations){
                    apiPromises.push(permissionApi.createOperation(op));
                }

                Promise.all(apiPromises).then((ress) => {
                    // tắc rồi , ko lấy được id của operation vừa tạo thì sao insert vào được action pack đây???????
                }).catch((err) => {
                    self.$snotifyError(err, "Can not create new operations!");
                });
            });
        },
        getNewOperationData(){
            let dataTable = this.$refs.dataTable.hotTable.getData();
            let newOperations = [];
            let allResource = this.$store.state.actionPack.allResource;


            for(let objectType in this.itemData.mapActionAndObjects){

                for (let row of dataTable) {
                    let key = row[0];
                    let id = '';
                    if(row[0] != ''){
                        id = key.slice(0, key.indexOf(' -'));
                    }

                    if(allResource.hasOwnProperty(objectType) && allResource[objectType][id]){
                        for(let i = 1; i < row.length ; i++){
                            if(row[i]){
                                let actionName = this.listAction[objectType][i - 1].name;
                                newOperations.push({
                                    action: actionName,
                                    objectIdentifier: objectType + ':' + id,
                                });
                            }
                        }
                    }
                }
            }

            return newOperations;
        },
        async saveActionPack(){
            let listNewOperations = await createNewOperations();

            let dataToSave = {
                name: this.allInputs.name.value,
                type: 'ba',
                description: this.allInputs.description.value,
                listActionPacks: JSON.stringify(listActionPacks)
            };


            let res;
            try {
                debugger
                if(this.action == 'update'){
                    res = await permissionApi.updatePermission(this.itemData.id, dataToSave);
                    if(res.status == '200'){
                        this.$snotifySuccess("Updated item successfully");
                    }else{
                        this.$snotifyError(res, "Error when update item");
                    }
                }else if(this.action == 'create'){
                    res = await permissionApi.createPermission(dataToSave);
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
        setAllItemOfResource(data = null){
            if(data){
                data.data = this.getItemForCacheResource(data);
                if(data.data.length > 0){
                    this.$store.commit('actionPack/cacheAllResourceItem', data);
                }
            }else{
                let itemsInStoreMap = {
                    document: this.$store.state.document.listAllDocument,
                };

                for(let module in itemsInStoreMap){
                    let data = {
                        type: module,
                        data: itemsInStoreMap[module]
                    };
                    data.data = this.getItemForCacheResource(data);
                    if(data.data.length > 0){
                        this.$store.commit('actionPack/cacheAllResourceItem', data);
                    }
                }
            }
        },
        getItemForCacheResource(data){
            let itemConvertMethods = {
                document: (items) => {
                    return items.reduce((arr, el) => {
                        arr.push({
                                id: el.id,
                                name: el.name,
                                title: el.title 
                            });
                        return arr;
                    }, []);
                }
            }

            let type = data.type;
            if(itemConvertMethods[type]){
                return itemConvertMethods[type](data.data);
            }else{
                console.warn('[SYMPER-ACTIONPACK: object type not found in itemConvertMethods]');
                return [];
            }
        },
    },
    data(){
        let self = this;
        return {
            tableHeight: 200,
            isEditingCell : false,
            // các action ứng với object type
            listAction: {
                document: [
                    {
                        name: 'add',
                        title: 'Add'  
                    },
                    {
                        name: 'edit',
                        title: 'Edit'  
                    },
                ]
            },

            tableSettings: {
                // các setting cho handsontable
                filters: true,
                manualColumnMove: true,
                manualColumnResize: true,
                manualRowResize: true,
                hiddenColumns: {
                    columns: [0],
                    indicators: false
                },
                stretchH: "all",
                rowHeaders: true,
                licenseKey: "non-commercial-and-evaluation",
                
                afterChange: function(changes, source) {
                    let htIst = this;
                    console.log(changes, source, htIst);
                    let lastIndex = htIst.getData().length;
                    if(changes[0][0] == lastIndex - 1){
                        this.alter('insert_row', lastIndex + 1, 1, 'add_row_on_enter');
                    }
                    setTimeout(function() {
                        htIst.selectCell(lastIndex, htIst.propToCol(changes[0][1]));
                        self.itemData.mapActionAndObjects[self.itemData.objectType] = htIst.getData();
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
        tableData(){
            let rows = this.itemData.mapActionAndObjects[this.itemData.objectType];
            if(rows && rows.length){
                return rows;
            }else{
                return [{}];
            }
        },
        dataSchema(){
            let objectType = this.allInputs.objectType.value;
            return this.listAction[objectType].reduce((schema, el) => {
                schema[el.name] = true;
                schema.idOperation = 0;
                return schema;
            }, {
                object: ''
            });
        },
        allResourceForSearch(){
            let rsl = {};
            let allResource = this.$store.state.actionPack.allResource;
            for(let name in allResource){
                rsl[name] = allResource[name].reduce((arr, el) => {
                    arr.push(`${el.id} - ${el.name} : ${el.title ? el.title : el.name} `);
                    return arr;
                }, []);
            }
            return rsl;
        },
        // Tiêu đề của các cột  cần hiển thị
        colHeaders() {
            let objectType = this.allInputs.objectType.value;
            return ["id","Objects"].concat(this.listAction[objectType].reduce((arr, el) => {
                arr.push(el.title);
                return arr;
            }, []));
        },
        tableColumns(){
            let self = this;
            let objectType = this.allInputs.objectType.value;
            let allResource = this.$store.state.actionPack.allResource;

            let cols = [
                {
                    data: "idOpertion",
                    type: "text",
                },
                {
                    data: "object",
                    type: "autocomplete",
                    width: 400,
                    source: function (query, process) {
                        process(self.allResourceForSearch[objectType]);
                    }
                }
            ];
            return cols.concat(this.listAction[objectType].reduce((arr, el) => {
                arr.push({
                    data: el.name,
                    type: "checkbox"
                });
                return arr;
            }, []));
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
                    options: [{
                            text: 'Document',
                            value: 'document'
                        },
                        {
                            text: 'Workflow',
                            value: 'workflow'
                        },
                        {
                            text: 'Orgchart',
                            value: 'orgchart'
                        },
                        {
                            text: 'Users',
                            value: 'users'
                        }
                    ],
                }
            };
        },
    }
}
</script>

<style>
</style>
