<template>
    
    <v-dialog
        v-model="isShowTableSetting"
        width="800"
        scrollable
        style="overflow:hidden;"
        
        >
        <v-card height="600" :id="'dialog-editor-'+instance">
            <v-card-title class="s-card-title">
                 <v-tabs
                    class="s-tabs"
                    v-model="tab"
                    align-with-title
                    >
                    <v-tabs-slider color="orange"></v-tabs-slider>

                    <v-tab
                        v-for="item in items"
                        :key="item"
                    >
                        {{ item }}
                    </v-tab>
                </v-tabs>
            </v-card-title>
            <v-card-text>
               
                 <v-tabs-items v-model="tab">
                    <v-tab-item>
                        <div id="setting-control-table" class="setting-control-table">
                            <div class="content-setting-control-table">
                                <v-data-table hide-default-footer :headers="headers" fixed-header height="100%" >
                                    <template v-slot:body>
                                        <draggable
                                                :list="listRows"
                                                tag="tbody"
                                                :animation="200"
                                                >
                                                <s-row-table-setting
                                                    v-for="row in listRows"
                                                    :key="row.key"
                                                    :row="row"
                                                    @remove-row="removeRow"
                                                    />
                                                
                                                <!-- the row will go here -->
                                            </draggable>
                                    </template>
                                </v-data-table>
                                 
                                
                            </div>
                        </div>
                    </v-tab-item>
                     <v-tab-item>
                        <div class="setting-pivot">
                            <VuePerfectScrollbar style="height: 476px;width: 300px;">
                                <div class="s-title">Control</div>
                                <div class="list-columns">
                                    <draggable
                                            :list="listRowsForPivot"
                                            :animation="200"
                                            group="control-pivot"
                                            >
                                        <div class="column-item" v-for="(item,index) in listRowsForPivot" :data-index="index" :key="index">
                                            {{item.name}} -- {{item.title}} 
                                        </div>
                                    </draggable>
                                    
                                </div>
                            </VuePerfectScrollbar>
                            
                            <div class="detail-pivot-setting">
                                <div class="s-title">Rows</div>
                                <VuePerfectScrollbar class="s-scroll">
                                    <div class="detail-pivot-setting__rows">
                                        <draggable
                                            :list="tablePivotConfig.rows"
                                            :animation="200"
                                            group="control-pivot"
                                            class="h-100"
                                            >
                                            <div class="column-row-item" v-for="(item,index) in tablePivotConfig.rows" :key="index" >
                                                {{item.name}} -- {{item.title}}
                                                <!-- <span class="mdi mdi-close" @click="deleteItem('rows', index, item)"></span> -->
                                            </div>
                                        </draggable>
                                    </div>
                                </VuePerfectScrollbar>
                                <div class="s-title">Columns</div>
                                <VuePerfectScrollbar class="s-scroll">
                                   <div class="detail-pivot-setting__cols">
                                       <draggable
                                            :list="tablePivotConfig.cols"
                                            :animation="200"
                                            group="control-pivot"
                                            class="h-100"
                                            >
                                            <div class="column-col-item" v-for="(item,index) in tablePivotConfig.cols" :key="index" >
                                                {{item.name}} -- {{item.title}}
                                                <!-- <span class="mdi mdi-close" @click="deleteItem('cols', index, item)"></span> -->
                                            </div>
                                       </draggable>
                                       
                                    </div>
                                </VuePerfectScrollbar>
                                <div class="s-title">Values</div>
                                <VuePerfectScrollbar class="s-scroll">
                                   <div class="detail-pivot-setting__values">
                                       <draggable
                                            :list="tablePivotConfig.values"
                                            :animation="200"
                                            group="control-pivot"
                                            class="h-100"
                                            >
                                            <div class="column-value-item" v-for="(item,index) in tablePivotConfig.values" :key="index" >
                                                {{item.name}} -- {{item.title}}
                                                <!-- <span class="mdi mdi-close" @click="deleteItem('values', index, item)"></span> -->
                                            </div>
                                       </draggable>
                                       
                                    </div>
                                </VuePerfectScrollbar>
                                
                            </div>
                        </div>
                    </v-tab-item>
                    <v-tab-item>
                        <div class="d-flex">
                            <VuePerfectScrollbar style="height: 476px;width: 300px;">
                                <div class="s-title">Control</div>
                                <div class="list-columns">
                                    <draggable
                                            :list="listRowsForGroup"
                                            :animation="200"
                                            group="control-group"
                                            >
                                            <div class="column-item" v-for="(item,index) in listRowsForGroup" :data-index="index" :key="index">
                                                {{item.name}} -- {{item.title}} 
                                            </div>
                                    </draggable>
                                    
                                </div>
                            </VuePerfectScrollbar>
                            <div class="group-config">
                                <div class="s-title">Rows</div>
                                <VuePerfectScrollbar class="s-scroll" style="height:125px">
                                    <draggable
                                            :list="tableGroupConfig.rows"
                                            :animation="200"
                                            group="control-group"
                                            class="h-100 p-2"
                                            >
                                        <div class="column-row-item" v-for="(item,index) in tableGroupConfig.rows" :key="index" >
                                            {{item.name}} -- {{item.title}}
                                        </div>
                                    </draggable>
                                </VuePerfectScrollbar>
                                <div class="s-title">Columns</div>
                                <VuePerfectScrollbar class="s-scroll" style="height:125px">
                                    <draggable
                                            :list="tableGroupConfig.cols"
                                            :animation="200"
                                            group="control-group"
                                            class="h-100 p-2"
                                            >
                                        <div class="column-row-item" v-for="(item,index) in tableGroupConfig.cols" :key="index" >
                                            {{item.name}} -- {{item.title}}
                                        </div>
                                    </draggable>
                                </VuePerfectScrollbar>
                                <div class="s-title">Values</div>
                                <VuePerfectScrollbar class="s-scroll" style="height:125px">
                                    <draggable
                                        :list="tableGroupConfig.values"
                                        :animation="200"
                                        group="control-group"
                                        class="h-100 p-2"
                                        >
                                        <div class="column-value-item" v-for="(item,index) in tableGroupConfig.values" :key="index" >
                                            {{item.name}} -- {{item.title}}
                                        </div>
                                       </draggable>
                                </VuePerfectScrollbar>
                            </div>
                        </div>
                    </v-tab-item>
                </v-tabs-items>
                
            </v-card-text>
            <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>



            <input 
                class="prefix-name-control"
                v-model="prefixName"
                type="text" 
                placeholder="Tiền tố tên control" 
                >
            <v-btn
                color="green darken-1"
                text
                left
                @click="autoGenerateName"
            >
                Tên tự động
            </v-btn>
            <v-btn
                color="green darken-1"
                text
                left
                @click="addNewRow"
            >
                Thêm cột
            </v-btn>
            <v-btn
                color="green darken-1"
                text
                right
                @click="saveTable"
            >
                Lưu
            </v-btn>

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
   
    
</template>
<script>
import TableSettingRow  from "./TableSettingRow.vue";
import draggable from "vuedraggable";
import { str } from "./../../../plugins/utilModules/str.js"
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { util } from '../../../plugins/util';
export default {
    components:{
        's-row-table-setting' : TableSettingRow,
        VuePerfectScrollbar,
        draggable
    },
    props:{
        defaultRow:{
            type:Array
        },
        instance:{
            type:Number
        },
        defaultTablePivotConfig:{
            type:Object
        },
        defaultTableGroupConfig:{
            type:Object
        }
    },
    watch:{
        defaultRow:{
            deep:true,
            immediate:true,
            handler:function(vl){
                this.listRows = vl;
            }
        },
        defaultTablePivotConfig:{
            deep:true,
            immediate:true,
            handler:function(vl){
                if(Object.keys(vl).length > 0 ){
                    this.tablePivotConfig.cols = (vl.cols) ? vl.cols : [];
                    this.tablePivotConfig.rows = (vl.rows) ? vl.rows : [];
                    this.tablePivotConfig.values = (vl.values) ? vl.values : [];
                }
                
            }
        },
        defaultTableGroupConfig:{
            deep:true,
            immediate:true,
            handler:function(vl){
                if(Object.keys(vl).length > 0 ){
                    this.tableGroupConfig.cols = (vl.cols) ? vl.cols : [];
                    this.tableGroupConfig.rows = (vl.rows) ? vl.rows : [];
                    this.tableGroupConfig.values = (vl.values) ? vl.values : [];
                }
                
            }
        },
     
    },
    computed:{
        editorStore(){  
            return this.$store.state.document.editor[this.instance];
        },
    },
    data(){
        return {
            listRows:[],
            listRowsForGroup:[],
            listRowsForPivot:[],
            isShowTableSetting:false,
            prefixName:"",
            tab: null,
            items: [
            'Cài đặt chung', 'Pivot table','Group table',
            ],
            tablePivotConfig:{rows:[],cols:[],values:[]},
            tableGroupConfig:{rows:[],cols:[],values:[]},
            isSetDrag:false,
            headers: [
                {
                    text: 'Thông tin cột',
                    align: 'start',
                    value: 'columnName',
                },
                { text: 'Loại control', value: 'type' },
                { text: 'Tên control', value: 'name' },
                { text: 'Tiêu đề control', value: 'title' },
                { text: '', value: '' },
            ],
        }
    },
    methods:{
       
        deleteItem(type, index, item){
            this.tablePivotConfig[type].splice(index,1);
            for (let i = 0; i < this.listRows.length; i++) {
                let control = this.listRows[i];
                if(control.key == item.key){
                    this.listRows[i].disable = false;
                    break;
                }
            }
        },
        autoGenerateName(){
            for (let index = 0; index < this.listRows.length; index++) {
                let rowData = this.listRows[index];
                let engText = this.prefixName+"_"+str.nonAccentVietnamese(rowData.columnName);
                this.listRows[index].name = engText;
            }
        },
        setListRow(listRows){
            this.listRows = listRows;
            this.listRowsForGroup = util.cloneDeep(listRows);
            this.listRowsForPivot = util.cloneDeep(listRows);
            this.listRowsForPivot = this.listRowsForPivot.reduce((arr,obj) =>{
                arr.push({name:obj.name,title:obj.title,type:obj.type});
                return arr;
            },[]);
            this.listRowsForGroup = this.listRowsForGroup.reduce((arr,obj) =>{
                arr.push({name:obj.name,title:obj.title,type:obj.type});
                return arr;
            },[]);
        },
        showDialog(){
            this.tablePivotConfig = {rows:[],cols:[],values:[]}
            this.isShowTableSetting = true
        },
        hideDialog(){
            this.isShowTableSetting = false
        },
        addNewRow(){
            this.listRows.push({columnName :'', name:'',type:'',title:'',key:'s-control-id'+Date.now()})
        },
        removeRow(row){
            this.listRows.splice(this.listRows.findIndex(v => v.key === row.key), 1);
            
        },

        //call lại sự kiện cho editor để them cột vào control bảng
        saveTable(){
            this.filterRowNotExistType();
            if(this.listRows.length > 0){
                let dataEmit = {listRows:this.listRows};
                if(this.tablePivotConfig.rows.length > 0 || this.tablePivotConfig.cols.length > 0 || this.tablePivotConfig.values.length > 0){
                    dataEmit['tablePivotConfig'] = this.tablePivotConfig;
                }
                if(this.tableGroupConfig.rows.length > 0 || this.tableGroupConfig.cols.length > 0){
                    dataEmit['tableGroupConfig'] = this.tableGroupConfig;
                }
                this.$emit("add-columns-table",dataEmit);
            }
            this.listRows = [];
            this.hideDialog()
        },
        // hàm nào chưa set type thì xóa khỏi list
        filterRowNotExistType(){
            this.listRows = this.listRows.filter(row=>{
                return row.type != ''
            })
        },
    },
}
</script>
<style  scoped>
    .prefix-name-control{
        padding: 4px 8px;
        background: var(--symper-background-default);
        border-radius: 4px;
    }
    .s-tabs >>> .v-slide-group__wrapper .v-tab{
        font-size: 12px;
        margin-left: 0 !important;
    }
    .s-tabs >>> .v-slide-group__wrapper{
        height: 30px;
    }
    .s-tabs{
        height: 30px;
    }
    .s-card-title{
        padding-top: 8px !important;
    }
    .setting-pivot{
        display: flex;
    }
    .detail-pivot-setting{
        width: calc(100% - 300px);
        height: 425px;
    }
    .group-config{
        width: calc(100% - 300px);
    }
    .list-columns{
        font-size: 13px;
    }
    .column-item, .column-value-item, .column-col-item, .column-row-item{
        cursor: pointer;
        padding: 2px 8px;
        margin: 2px 0;
        border: var(--symper-border);
        border-radius: 4px;
    }
    .detail-pivot-setting__rows, .detail-pivot-setting__cols, .detail-pivot-setting__values{
        height: 100%;
        padding: 4px;
        font-size: 13px;
    }
    .detail-pivot-setting .s-scroll{
        height:130px;
        border: var(--symper-border);
        margin:4px;
        border-radius:4px;
    }
    .group-config .s-scroll{
        height:200px;
        border: var(--symper-border);
        margin:4px;
        border-radius:4px;
    }
    .s-title{ 
        font-size: 12px;
        font-weight: 500;
        margin-left: 8px;
    }
    .column-row-item, .column-col-item, .column-value-item{
        position: relative;
    }
    .mdi-close{
        position: absolute;
        right: 0;
        padding: 0 6px;
    }
</style>