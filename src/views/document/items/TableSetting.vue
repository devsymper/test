<template>
    
    <v-dialog
        v-model="isShowTableSetting"
        width="800"
        >
        <v-card
        height="550"
        >
            <v-card-title class="headline">Table setting</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: calc(100% - 112px);    overflow: auto;">
            
                <div id="setting-control-table" class="setting-control-table">
                    <div class="content-setting-control-table scroll-thin">
                        <v-simple-table fixed-header height="100%" >
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-left">Thông tin cột</th>
                                        <th class="text-left">Loại control</th>
                                        <th class="text-left">Tên control</th>
                                        <th class="text-left">Tiêu đề control</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="tableDrag">
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
            </v-card-text>
                <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>

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
import Sortable from 'sortablejs';
let sortable = null;
export default {
    components:{
        's-row-table-setting' : TableSettingRow
    },
    
    data(){
        return {
            listRows:[],
            isShowTableSetting:false
        }
    },
   
    methods:{
        setListRow(listRows){
            this.listRows = listRows;
        },
        showDialog(){
            this.isShowTableSetting = true
        },
        hideDialog(){
            this.isShowTableSetting = false
        },
        addNewRow(){
            this.listRows.push({columnName :'', name:'',type:'',title:'',key:'s-control-id'+Date.now()})
            this.setOnDrag()
        },
        removeRow(row){
            this.listRows.splice(this.listRows.findIndex(v => v.key === row.key), 1);
            
        },
        saveTable(){
            this.filterRowNotExistType();
            if(this.listRows.length > 0){
                this.$emit("add-columns-table",this.listRows);
            }
            this.listRows = [];
            this.hideDialog()
        },
        filterRowNotExistType(){
            this.listRows = this.listRows.filter(row=>{
                return row.type != ''
            })
        },
        dragReorder (oldIndex, newIndex) {
            const movedItem = this.listRows.splice(oldIndex, 1)[0]
            this.listRows.splice(newIndex, 0, movedItem)
        },
        setOnDrag(){
            let thisCpn = this;
            var el = document.getElementById('tableDrag');
            if(this.sortable == null)
            this.sortable = Sortable.create(
                el,
                {
                    draggable: "#rowDrag",
                    handle: '.sortHandle',
                    animation: 150,
                    easing: "cubic-bezier(1, 0, 0, 1)",
                    sort: true,  // sorting inside list
                    delay: 0,
                    onEnd: function (/**Event*/evt) {
                        var itemEl = evt.item;  // dragged HTMLElement
                        thisCpn.dragReorder(evt.oldIndex,evt.newIndex);
                    },
                }
            )
        }
    },
    mounted(){
        
    }
}
</script>
<style  scoped>
    
</style>