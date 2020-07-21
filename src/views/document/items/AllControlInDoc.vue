<template>
    <div>
        <v-dialog
            v-model="isShow"
            width="90%"
            fullscreen
            >
            <v-card
            height="800px"
            >
                <v-card-title class="headline">Bảng tổng hợp control</v-card-title>
                <v-divider></v-divider>
                <v-card-text  style="height: calc(100% - 112px);overflow-y: auto;">
                    <v-tabs @change="changeTab">
                        <v-tab v-for="column in allColumns" :key="column.name">
                            {{column.title}}
                        </v-tab>
                    </v-tabs>
                    <data-table 
                        ref="table" 
                        class="mt-2" 
                        @on-cell-click="clickCellAgTable"
                        @on-cell-change="updatePropsControl"
                        :allColumns="columns" 
                        :rowData="dataTable"
                        :customComponents="customAgComponents"
                        :cellRendererParams="cellRendererParams"/>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="green darken-1"
                    text
                    right
                    @click="hideDialog"
                >
                    Đóng
                </v-btn>
                </v-card-actions>
                 
            </v-card>
            
        </v-dialog>
        <symper-drag-panel
                @before-close="closeLargeFormulaEditor()"
                :showPanel="largeFormulaEditor.open"
                :actionTitle="largeFormulaEditor.data.title"
                :panelData="largeFormulaEditor.data">
                <template slot="drag-panel-content" slot-scope="{panelData}">
                    
                    <formula-editor
                        v-model="panelData.valueChange"
                        :formulaValue="panelData.valueChange"
                        :width="'100%'"
                        :height="'370px'"
                    ></formula-editor>
                </template>
            </symper-drag-panel>
       
    </div>
   
</template>
<script>
import AgDataTable from "./../../../components/common/agDataTable/AgDataTable.vue"
import SymperDragPanel from "./../../../components/common/SymperDragPanel";
import FormulaEditor from "./../../../components/common/FormulaEditor";
import {getAllPropsControl,getIconFromType,getAllFormulasName} from "./../../../components/document/controlPropsFactory.js"
import { util } from "./../../../plugins/util.js";

import ImageRenderer from "@/components/common/agDataTable/ImageRenderer.vue";
import CheckBoxRenderer from "@/components/common/agDataTable/CheckBoxRenderer.vue";

export default {
    components:{
        'data-table' : AgDataTable,
        'formula-editor':FormulaEditor,
        'symper-drag-panel':SymperDragPanel
    },
    computed:{
        sAllControl(){
            let allControl = this.$store.state.document.editor.allControl;
            return allControl
        },
        allColumns(){
            let listColumnGroup = getAllPropsControl();
            listColumnGroup[0].listFields.shift();  // cần bỏ côt tên trong group name do treeview của ag-grid đã lấy theo cột tên
            return listColumnGroup;

        },
        
        
        allColumnFormulas(){
            return getAllFormulasName();
        }
    },
    data(){
        return{
            customAgComponents: {
                image : ImageRenderer,
                checkBoxRenderer : CheckBoxRenderer
            },
            cellRendererParams: { innerRenderer:'image' },
            isShow:false,
            columns:[],
            largeFormulaEditor: {
                name: "", // tên của input
                open: false, // có mở largeFormulaEditor hay ko
                data: {}, // Dữ liệu của input cần mở lên để edit trong khung lớn,
            },
            mapNameToControlId:{},
            dataTable : null,
        }
    },
    methods:{
        
        showDialog(){
            $('.sym-document-body').addClass('d-none');
            this.isShow = true
        },
        hideDialog(){
            this.isShow = false
             $('.sym-document-body').removeClass('d-none');
        },
        changeTab(e){
            if(this.$refs.table != undefined)
            this.$refs.table.refreshData(this.allColumns[e].listFields)
        },
        openLargeValueEditor(dataInput) {
            this.largeFormulaEditor.open = true;
            let inputInfo = {rowNode:dataInput.rowNode,field:dataInput.col.field,headerName:dataInput.col.headerName,valueChange:dataInput.curValue}
            this.$set(this.largeFormulaEditor, "data", inputInfo);
        },
        closeLargeFormulaEditor() {
            this.largeFormulaEditor.open = false;
            this.$refs.table.refreshCell(this.largeFormulaEditor.data.rowNode,this.largeFormulaEditor.data.field,this.largeFormulaEditor.data.valueChange);
        },
        clickCellAgTable(params){
            let colKey = params.col.field;
            if(this.allColumnFormulas.indexOf(colKey) !== -1){
                this.openLargeValueEditor(params)
            }
        },
        updatePropsControl(params){
            let controlName = null;
            let table = '';
            let value = params.newValue;
            if(params.colDef.field == 'name'){  // truowng hop thay doi ten control, cần gán lại tên control cũ để tìm trong store
                table = (params.oldValue.length > 1) ? params.oldValue[0] : ''
                value = (params.oldValue.length > 1) ? value[1] : value;
            }
            if(controlName == null){
                controlName = params.node.key;
            }

            
            let controlId = this.mapNameToControlId[controlName];
            let tableId = 0;
            if(table != ""){
                tableId = this.mapNameToControlId[params.tableName];
            }
            this.$store.commit(
                "document/updateProp",{id:controlId,name:params.colDef.field,value:value,tableId:tableId,type:"value"}
            );   
            
        },
        // hàm lấy dữ liệu cho ag-grid
        getData(){ 
            let allControl = util.cloneDeep(this.sAllControl);
            let allDataControl = [];
            for (let id in allControl) {
                let props = allControl[id].properties;
                let formulas = allControl[id].formulas;
                let type = allControl[id].type;
                let row = {};
                console.log(allControl[id]);
                
                for (let propType in props){
                    let value = props[propType].value;
                    if(props[propType].type == 'checkbox'){
                        value = (value === true) ? true : false;
                    }
                    row[propType] = value
                    if(propType == 'name'){
                        row[propType] = [value];
                    }
                }
                if(type == "submit" || type == "reset" || type == "draft"){
                    row['name'] = [type];
                    row['title'] = [type];
                }
                console.log(row);
                
                this.mapNameToControlId[row['name'][0]] = id;
                row['icon'] = getIconFromType(type);
                for (let f in formulas){
                    row[f] = formulas[f].value
                }


                if(type == "table"){
                        let tableName = props.name.value;
                        let listFields = allControl[id].listFields
                        for (let childId in listFields){
                            let childRow = {};
                            let childProps = listFields[childId].properties;
                            let childFormulas = listFields[childId].formulas;
                            let cType = listFields[childId].type;
                            for (let childPropType in childProps){
                                let cValue = childProps[childPropType].value;
                                if(childProps[childPropType].type == 'checkbox'){
                                    cValue = (cValue === true) ? true : false;
                                }
                                childRow[childPropType] = cValue
                                if(childPropType == 'name'){
                                    childRow[childPropType] = [tableName,cValue]
                                    this.mapNameToControlId[cValue] = childId;
                                }
                            }
                            for (let f in childFormulas){
                                childRow[f] = childFormulas[f].value
                            }
                            
                            childRow['icon'] = getIconFromType(cType);
                            allDataControl.push(childRow);
                        }
                    }
                allDataControl.push(row);
            }
            this.dataTable = allDataControl
        },
       
        
    },
    mounted(){
        this.columns = this.allColumns[1].listFields
    }
}
</script>   
<style scoped>
    .s-all-control-option{
        height: 90%;
    }
</style>