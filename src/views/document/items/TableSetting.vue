<template>
    
    <v-dialog
        v-model="isShowTableSetting"
        width="800"
        scrollable
        style="overflow:hidden;"
        >
        <v-card height="600">
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
                            <div class="content-setting-control-table scroll-thin">
                                <v-simple-table fixed-header height="100%" >
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-left">Thông tin cột</th>
                                                <th class="text-center">Loại control</th>
                                                <th class="text-left">Tên control</th>
                                                <th class="text-left">Tiêu đề control</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody id="table-body-drag">
                                            <s-row-table-setting
                                            v-for="row in listRows"
                                            :key="row.key"
                                            :row="row"
                                            @remove-row="removeRow"
                                            />
                                        </tbody>
                                    </template>
                                </v-simple-table>
                                
                            </div>
                        </div>
                    </v-tab-item>
                     <v-tab-item>
                        <div class="setting-pivot">
                            <VuePerfectScrollbar style="height: 425px;width: 300px;">
                                <div class="s-title">Control</div>
                                <div class="list-columns">
                                    <div class="column-item" v-for="(item,index) in listRows" :data-index="index" :key="index" draggable :style="{display:(item.disable) ? 'none':''}">
                                        {{item.name}} -- {{item.title}} 
                                        
                                    </div>
                                </div>
                            </VuePerfectScrollbar>
                            
                            <div class="detail-pivot-setting">
                                <div class="s-title">Rows</div>
                                <VuePerfectScrollbar class="s-scroll">
                                    <div class="detail-pivot-setting__rows">
                                        <div class="column-row-item" v-for="(item,index) in tablePivotConfig.rows" :key="index" >
                                            {{item.name}} -- {{item.title}}
                                            <span class="mdi mdi-close" @click="deleteItem('rows', index, item)"></span>
                                        </div>
                                    </div>
                                </VuePerfectScrollbar>
                                <div class="s-title">Columns</div>
                                <VuePerfectScrollbar class="s-scroll">
                                   <div class="detail-pivot-setting__cols">
                                       <div class="column-col-item" v-for="(item,index) in tablePivotConfig.cols" :key="index" >
                                            {{item.name}} -- {{item.title}}
                                            <span class="mdi mdi-close" @click="deleteItem('cols', index, item)"></span>
                                        </div>
                                    </div>
                                </VuePerfectScrollbar>
                                <div class="s-title">Values</div>
                                <VuePerfectScrollbar class="s-scroll">
                                   <div class="detail-pivot-setting__values">
                                       <div class="column-value-item" v-for="(item,index) in tablePivotConfig.values" :key="index" >
                                            {{item.name}} -- {{item.title}}
                                            <span class="mdi mdi-close" @click="deleteItem('values', index, item)"></span>
                                        </div>
                                    </div>
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
import { str } from "./../../../plugins/utilModules/str.js"
import Sortable from 'sortablejs';
import VuePerfectScrollbar from "vue-perfect-scrollbar";
let sortable = null;
export default {
    components:{
        's-row-table-setting' : TableSettingRow,
        VuePerfectScrollbar
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
                if(Object.keys(vl).length > 0 )
                this.tablePivotConfig = vl;
            }
        },
        tab(vl){
            if(vl >= 1){
                setTimeout((self) => {
                    self.makeDrag();
                }, 500,this);
            }
        }
    },
    computed:{
        editorStore(){  
            return this.$store.state.document.editor[this.instance];
        },
    },
    data(){
        return {
            listRows:[],
            isShowTableSetting:false,
            prefixName:"",
            tab: null,
            items: [
            'Cài đặt chung', 'Pivot table',
            ],
            tablePivotConfig:{rows:[],cols:[],values:[]}
        }
    },
    created(){
        
    },
    methods:{
        makeDrag(){
            let self = this;
            let controlInd = null;
            $('.column-item').on('dragstart',function(e){
                controlInd = $(e.target).attr('data-index');
                let data = self.listRows[controlInd];
                e.originalEvent.dataTransfer.setData("control", JSON.stringify(data));
            })
           
            $('.detail-pivot-setting__rows')
            .on('dragover', false) 
            .on('drop', function (event) {
                var e;
                if (event.isTrigger)
                    e = triggerEvent.originalEvent;
                else
                    var e = event.originalEvent;
                try {
                    var control = e.dataTransfer.getData('control');
                    control = JSON.parse(control);
                    self.listRows[controlInd].disable = true;
                    self.tablePivotConfig.rows.push(control)
                } catch (error) {
                    
                }
                return false;
            });
            $('.detail-pivot-setting__cols')
            .on('dragover', false) 
            .on('drop', function (event) {
                var e;
                if (event.isTrigger)
                    e = triggerEvent.originalEvent;
                else
                    var e = event.originalEvent;
                try {
                    var control = e.dataTransfer.getData('control');
                    control = JSON.parse(control);
                    self.listRows[controlInd].disable = true;
                    self.tablePivotConfig.cols.push(control)
                } catch (error) {
                    
                }
                return false;
            });
            $('.detail-pivot-setting__values')
            .on('dragover', false) 
            .on('drop', function (event) {
                var e;
                if (event.isTrigger)
                    e = triggerEvent.originalEvent;
                else
                    var e = event.originalEvent;
                try {
                    var control = e.dataTransfer.getData('control');
                    control = JSON.parse(control);
                    self.tablePivotConfig.values.push(control)
                } catch (error) {
                    
                }
                return false;
            });
        },
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
            this.setOnDrag();
        },
        showDialog(){
            this.isShowTableSetting = true
        },
        hideDialog(){
            this.isShowTableSetting = false
        },
        addNewRow(){
            this.listRows.push({columnName :'', name:'',type:'',title:'',key:'s-control-id'+Date.now()})
            this.setOnDrag();
        },
        removeRow(row){
            this.listRows.splice(this.listRows.findIndex(v => v.key === row.key), 1);
            
        },

        //call lại sự kiện cho editor để them cột vào control bảng
        saveTable(){
            this.filterRowNotExistType();
            if(this.listRows.length > 0){
                this.$emit("add-columns-table",{listRows:this.listRows, tablePivotConfig:this.tablePivotConfig});
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
        //update lại listrow khi drop
        dragReorder (oldIndex, newIndex) {
            const movedItem = this.listRows.splice(oldIndex, 1)[0]
            this.listRows.splice(newIndex, 0, movedItem)
        },
        // drag row
        setOnDrag(){
            setTimeout((self) => {
                var el = $('#table-body-drag')[0];
                if(self.sortable == null)
                self.sortable = Sortable.create(
                    el,
                    {
                        draggable: "#setting-control-table #rowDrag",
                        handle: '#setting-control-table .sortHandle',
                        animation: 150,
                        easing: "cubic-bezier(1, 0, 0, 1)",
                        sort: true,  // sorting inside list
                        delay: 0,
                        onEnd: function (/**Event*/evt) {
                            var itemEl = evt.item;  // dragged HTMLElement
                            self.dragReorder(evt.oldIndex,evt.newIndex);
                        },
                    }
                ) 
            }, 500, this);
        }
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
    .s-scroll{
        height:130px;
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