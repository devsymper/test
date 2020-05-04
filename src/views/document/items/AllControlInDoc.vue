<template>
     <v-dialog
        v-model="isShow"
        width="90%"
        >
        <v-card
        height="100%"
        >
            <v-card-title class="headline">Bảng tổng hợp control</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: calc(100% - 112px);    overflow: auto;">
                <data-table />
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
   
</template>
<script>
import DataTable from "./../../../components/common/customTable/DataTable.vue"
import {getAllPropsControl} from "./../../../components/document/controlPropsFactory.js"
export default {
    components:{
        'data-table' : DataTable
    },
    computed:{
        sAllControl(){
            return this.$store.state.document.editor.allControl;
        },
        allColumns(){
            let x = getAllPropsControl();
            return x
            
        }
    },
    data(){
        return{
            isShow:false
        }
    },
    methods:{
        
        showDialog(){
            
            this.isShow = true
        },
        hideDialog(){
            this.isShow = false
        },
       
        
    },
    mounted(){
        console.log(this.allColumns);
        
    }
}
</script>   
<style scoped>
    .s-all-control-option{
        height: 90%;
    }
</style>