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
                    @update-props="updatePropsControl"
                    :allColumns="columns" 
                    :rowData="dataTable"/>
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
            let controlName = params.controlName;
            let propName = params.propName;
            let value = params.value;
            let controlId = this.mapNameToControlId[controlName];
            let tableId = 0;
            if(params.tableName != undefined && params.tableName !=null && params.tableName != ""){
                tableId = this.mapNameToControlId[params.tableName];
            }
            this.$store.commit(
                "document/updateProp",{id:controlId,name:propName,value:value,tableId:tableId}
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
                        value = (value === 1) ? true : false;
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
                                    cValue = (cValue === 1) ? true : false;
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
        this.columns = this.allColumns[0].listFields
    }
}
</script>   
<style scoped>
    .s-all-control-option{
        height: 90%;
    }
</style>