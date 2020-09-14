<template>
    
    <v-dialog
        v-model="isShow"
        width="800"
        scrollable
        style="overflow:hidden;"
        >
        <v-card
         height="550">
            <v-card-title class="headline">Cấu hình in</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-simple-table fixed-header height="100%" >
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">Thông tin cột</th>
                                <th class="text-center">Chiều rộng</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="tableDrag">
                            <tr v-for="(row,i) in listRows" :key="i">
                                <td>{{row.title}}</td>
                                <td class="text-center"><input 
                                    v-model="row.colWidth"
                                    type="text" placeholder="Chiều rộng"></td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
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
export default {
    data(){
        return {
            listRows:[],
            isShow:false
        }
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
    },
  
}
</script>
