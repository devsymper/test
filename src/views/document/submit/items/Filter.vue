<template>
    <div class="content-filter">
        <div class="search-filter">
            <v-text-field
                prepend-inner-icon="mdi-magnify"
                outlined
                dense
                height="30"
                class="search"
                @keyup="handleKeyupSearch"
                v-model="search"
                hide-details
            ></v-text-field>
        </div>
        <div>
            Tìm kiếm trên các trường {{fieldSearch}}
        </div>
        <div class="content-table">
            <!-- :style="{'max-height':tableMaxHeight+'px','overflow':'auto'}" -->
            <data-table ref="dataTable" :isRenderAllRows="true" :columns="columns" @cell-change="cellChange" :data="data" class="hot-table" ></data-table>

        </div>
        <div class="footer-filter">
            <span class="total-record">Tổng số bản ghi: {{totalRecord}}</span>
            <v-btn @click="saveInputFilter" small color="primary" right class="save-input-filter">Lưu</v-btn>
        </div>
    </div>
</template>
<script>
import DataTable from './../../../../components/common/customTable/DataTable.vue'
import { str } from "./../../../../plugins/utilModules/str.js"
export default {
    components:{
        'data-table':DataTable
    },
    props:{
        keyInstance:{
            type:Number,
            default:0
        },
        tableMaxHeight:{
            type: Number,
            default: 450
        }
    },
    data(){
        return {
            columns:null,
            data:null,
            colActive:null,
            curControlId:null,
            formulas:null,
            search:null,
            controlName:null,
            dataSelected:[],
            fieldSearch:"",
            mapNameToTitle:{},
            totalRecord:0
        }
    },
    created(){
       
    },
    beforeMount(){
        this.columns = []
        this.data = []
    },
    methods:{
        setData(controlId,colActive,data){
            this.colActive = colActive;
            let dataTable = [];
            this.columns = [];
            for (let index = 0; index < data.length; index++) {
                let row = data[index];
                if(index == 0){
                    for(let c in row){
                        let colName = str.nonAccentVietnamese(c);
                        let item = {name:colName,title:c,type:'text',readOnly:true};
                        this.columns.push(item)
                    }
                    this.columns.unshift({name:'active',title:'Chọn',type:'checkbox'})
                }
                let item1 = {};
                for(let c in row){
                    let colName = str.nonAccentVietnamese(c);
                    item1[colName] = row[c];
                }
                if(this.dataSelected.includes(row[this.colActive])){
                    item1['active'] = true;
                }
                else{
                    item1['active'] = false;
                }
                dataTable.push(item1)
            }   
            this.data = null;
            this.data = dataTable;
            this.curControlId = controlId;
            this.totalRecord = dataTable.length
        },
        cellChange(res){
            let changes = res.changes;
            let source = res.source;
            if(source == 'edit' && changes[0][1] == 'active'){
                let rowIndex = changes[0][0];
                let tableInstance = this.$refs.dataTable.getTableInstance();
                let rowData = tableInstance.getDataAtRow(rowIndex);
                let colHeader = tableInstance.getColHeader();
                let indexColDataActive = colHeader.indexOf(this.colActive);
                if(changes[0][3] == true){
                    this.dataSelected.push(rowData[indexColDataActive]);
                }
                else{
                    const index = this.dataSelected.indexOf(rowData[indexColDataActive]);
                    if (index > -1) {
                        this.dataSelected.splice(index, 1);
                    }
                }
            }
        },
        saveInputFilter(){
            this.$emit('save-input-filter',{controlId:this.curControlId,value:this.dataSelected.join()});
        },
        setFormulas(formulas,controlName){
            this.formulas = formulas;
            this.controlName = controlName;
            this.getSearchField(formulas.instance.formulas)
        },
        getSearchField(formulas){
            let titleFieldSearch = []
            let mapColumnToAlias = {}
            let allColumnQuery = formulas.match(/([0-9a-zA-Z_]+)\s+as\s+("(.*?)"|([0-9a-zA-Z_]+))/gm);
            for (let index = 0; index < allColumnQuery.length; index++) {
                const fieldSelect = allColumnQuery[index];
                fieldSelect = fieldSelect.split(' as ');
                if(fieldSelect.length > 1){
                    mapColumnToAlias[fieldSelect[0]] = fieldSelect[1].replace(/\"/gm,"");
                }
                else{
                    mapColumnToAlias[fieldSelect[0]] = fieldSelect[0].replace(/\"/gm,"");
                }
            }
            let allFieldCondition = formulas.match(/[a-zA-Z0-9_][^\s]*(?= ilike)/gm);
            for (let index = 0; index < allFieldCondition.length; index++) {
                const controlTitle = (mapColumnToAlias.hasOwnProperty(allFieldCondition[index])) ? mapColumnToAlias[allFieldCondition[index]] : "";
                titleFieldSearch.push(controlTitle)
            }
            if(titleFieldSearch.length>0){
                this.fieldSearch = titleFieldSearch.join(", ")
            }  
        },
        handleKeyupSearch(data){
            this.$emit('search-data',{controlName:this.controlName,search:this.search})
        }
    }
}
</script>

<style scoped> 
    .search >>> .v-input__slot{
        min-height: unset !important;
        margin-top: 8px;
        padding-left: 8px !important;
    }
    .search >>> input{
        font-size: 13px;
    }
    .search >>> .v-input__prepend-inner{
        margin-top: 3px !important;
    }
    .search >>> .mdi{
        font-size: 20px !important;
    }
    .search >>> .v-label{
        font-size: 13px;
        top: 6px !important;
    }
    .search >>> fieldset{
        border-color:#c1c1c1 !important;
    }
    .save-input-filter{
        float: right;
        margin-right: 8px;
        margin-top: 6px;
    }
    .hot-table >>> .handsontable:first-child:not(.ht_master){
        overflow-x: hidden !important;
        overflow-y: auto !important;
    }
    .hot-table >>> .handsontable .ht_master thead{
        visibility: visible !important;
    }
    .hot-table >>> .handsontable .ht_master .wtHolder{
        overflow-y: hidden !important;
    }
    .content-table{
        height: calc(100% - 90px);
        overflow-x: hidden;
        overflow-y: scroll;   
    }
    .content-filter{
        height: 100%;
    }
    .footer-filter .total-record{
        display: inline-block;
        margin-top: 16px;
    }
  
</style>