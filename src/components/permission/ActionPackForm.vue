<template>
    <div class="pa-2">
        <FormTpl
            :viewOnly="action == 'detail'"
            :singleLine="false"
            :allInputs="allInputs"
        >
        </FormTpl> 

        <div class="w-100">
            <hot-table
                :settings="tableSettings"
                :data="itemData.mapActionAndObjects[itemData.objectType]"
                ref="dataTable">

                <hot-column :name="'object'" :key="'searchItem'" title="Objects">
                    <CustomSelect @open-editor="handleEditorShow" hot-editor hot-renderer></CustomSelect>
                </hot-column>
                <hot-column 
                    v-for="col in listAction[itemData.objectType]" 
                    :key="col.name" 
                    :type="'checkbox'"
                    :objectType="itemData.objectType"
                    :title="col.title">

                </hot-column>
            </hot-table>
        </div>

        <div class="mt-2" v-if="action != 'view' ">
            <v-btn
                class="float-right mr-1"
                small
                depressed
                color="primary">

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

let firstTableColumn = {
    columnTitle: "Objects",
    data: "objects",
    type: "text"
};


export default {
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
        handleEditorShow(data){
            debugger
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
        }
    },
    data(){
        let self = this;
        return {
            isEditingCell : false,
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
            tableColumns: [
                util.cloneDeep(firstTableColumn),
                {
                    data: "edit",
                    type: "checkbox"
                },
                {
                    data: "add",
                    type: "checkbox"
                },
            ],
            colHeaders: [
                'Objects',
                'Edit',
                'Add'
            ],
            tableSettings: {
                // các setting cho handsontable
                filters: true,
                manualColumnMove: true,
                manualColumnResize: true,
                manualRowResize: true,
                stretchH: "all",
                minSpareRows: 1,
                licenseKey: "non-commercial-and-evaluation",
                afterRender: isForced => {
                    console.log(
                        "after render handsontablelllllllllllllllllllllllllll",
                        Date.now()
                    );
                },
                beforeKeyDown: (event)=>{
                    // chặn bấm lên xuống trái phải khi có autocomplete
                    if ((event.keyCode == 40 || event.keyCode == 38 ||
                            event.keyCode == 37 || event.keyCode == 39) && self.isEditingCell ) {
                        event.stopImmediatePropagation();
                    }
                },
                afterBeginEditing(){
                    self.isEditingCell = true;
                },
                afterBeginEditing(){
                    self.isEditingCell = true;
                },
                afterChange(){
                    self.isEditingCell = false;
                }
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
