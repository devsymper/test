<template>
    
    <v-dialog
        v-model="isShow"
        width="800"
        scrollable
        style="overflow:hidden;"
        >
        <v-card
         height="auto">
            <v-card-title class="headline">Cấu hình in</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <VuePerfectScrollbar style="position:relative;height:100px;padding: 8px 0;">
                    <table border="0" class="table" v-columns-resizable>
                    <thead>
                        <tr>
                            <th class="text-center" v-for="(col,index) in listRows" :key="index"><span contenteditable="true" @blur="afterChangeColWidth($event,col)" class="col-width">{{col.colWidth}}</span></th>
                        </tr>
                        <tr>
                            <th class="text-center title-control" v-for="(col,index) in listRows" :key="index">{{col.title}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="text-center" v-for="(col,index) in listRows" :key="index"><button class="btn-delete-column" @click="deleteColumn($event,col)">Xóa cột</button></td>
                        </tr>
                    </tbody>
                    </table>
                </VuePerfectScrollbar>
            </v-card-text>
                <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>

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
import Vue from "vue";
import VueColumnsResizableVuetify from 'vue-columns-resizable-vuetify';
import VuePerfectScrollbar from "vue-perfect-scrollbar";
 
Vue.use(VueColumnsResizableVuetify);
export default {
    data(){
        return {
            listRows:[],
            isShow:false
        }
    },
    components:{
        VuePerfectScrollbar,
    },
   
    methods:{
        setListRow(listRows){
            this.listRows = listRows;
        },
        showDialog(){
            this.isShow = true
        },
        hideDialog(){
            this.isShow = false
        },

        //call lại sự kiện cho editor để them cột vào control bảng
        saveTable(){
            if(this.listRows.length > 0){
                this.$emit("config-column-table-print",this.listRows);
            }
            this.listRows = [];
            this.hideDialog()
        },
        deleteColumn(e, col){
            let colIndex = $(e.target).closest('td').index();
            this.listRows.splice(colIndex,1);
        },
        afterChangeColWidth(e,col){
            col.colWidth = $(e.target).text();
        }
        
    },
  
       
}

</script>

<style  scoped>
    .table{
        width: 100%;
        font-size: 13px;
    }
    .table th .col-width{
        background: orange;
        border-radius: 4px;
        color: white;
        padding: 0 8px;
        font-weight: 300;
        display: inline-block;
        margin-bottom: 5px;
    }
    .table th .col-width:focus{
        outline: none;
    }
    .table th input:focus{
        outline: none;
    }
    .title-control{
        min-width: 130px;
    }
    td {
        border: var(--symper-border);
        border-collapse: collapse;
    }
    table thead tr:nth-child(2) th {
        border: var(--symper-border);
        border-collapse: collapse;
        padding: 3px;
    }
    .btn-delete-column{
        padding: 0 8px;
    }
    .btn-delete-column:focus{
        outline: none;
    }
</style>