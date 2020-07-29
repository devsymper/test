<template>
    <div>
        <div>
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
        <data-table ref="dataTable" :columns="columns" :data="data" class="hot-table" :style="{'max-height':tableMaxHeight+'px','overflow':'auto'}"></data-table>
        <v-btn @click="saveInputFilter" small right class="save-input-filter">Lưu</v-btn>
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
            controlName:null
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
                item1['active'] = false;
                dataTable.push(item1)
            }   
            this.data = dataTable;
            this.curControlId = controlId;
            // setTimeout(() => {
            //     this.$refs.dataTable.reRender();
            // }, 1000);
        },
        saveInputFilter(){
            let data = this.$refs.dataTable.getData();
            let data1 = data.filter(d => {
                return d[d.length - 1] == true;
            })
            let index1 = this.$refs.dataTable.getColName(this.colActive);
            let dataResult = ""
            for (let index = 0; index < data1.length; index++) {
                let item = data1[index];
                dataResult += item[index1] + ","
            }
            dataResult = dataResult.substring(0, dataResult.length - 1);
            this.$emit('save-input-filter',{controlId:this.curControlId,value:dataResult});
            
        },
        setFormulas(formulas,controlName){
            this.formulas = formulas;
            this.controlName = controlName;
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
</style>