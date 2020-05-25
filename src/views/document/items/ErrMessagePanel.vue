<template>
    
    <v-dialog
        v-model="isShowModalErr"
        width="800"
        >
        <v-card
        height="550"
        >
            <v-card-title class="headline">Thông báo</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: calc(100% - 112px);    overflow: auto;">
                <v-list-item dense v-for="(err, index) in listErr" :key="index">
                    <v-list-item-content>
                        <v-list-item-title>{{err}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
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
import TableSettingRow  from "./TableSettingRow.vue";
import FormTpl from "./../../../components/common/FormTpl.vue"
import Sortable from 'sortablejs';
let sortable = null;
export default {
    components:{
        's-row-table-setting' : TableSettingRow,
        'form-save-doc' : FormTpl
    },
    computed: {
      editorStore(){ 
          return this.$store.state.document.editor;
      }
    },
    props:{
        listErr:{
            type:Array,
            default:[]
        }
    },
    
    data(){
        return {
            isShowModalErr:false,
        }
    },
   
    methods:{
        
        showDialog(){
            this.isShowModalErr = true
        },
        hideDialog(){
            this.isShowModalErr = false
        },
       
        
    },
    mounted(){
        
    }
}
</script>
<style scoped>
    
</style>