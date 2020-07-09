<template>
    <v-dialog
        v-model="isShow"
        width="800"
        >
        <v-card
        height="550"
        >
            <v-card-title class="headline">Kiểm tra control</v-card-title>
            <v-card-subtitle  class="s-subtitle-control">
                Các control có công thức liên quan đến control <span class="control-name">{{controlName}}</span>
            </v-card-subtitle>
            <v-card-text style="height: calc(100% - 112px);    overflow: auto;">
                <!-- <v-list-item dense v-for="(formulas, index) in listFormulas" :key="index+formulas">
                    <v-list-item-content>
                        <v-list-item-title>{{formulas}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item> -->
                <v-data-table
                    :headers="headers"
                    :items="dataTable"
                    disable-pagination
                    fixed-header
                    hide-default-footer
                    dense
                    calculate-widths
                    
                    >
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>{{ item }}</td>
                        </tr>
                    </template>
                    
                    </v-data-table>
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
import {formulasApi} from './../../../api/Formulas'
export default {
    props:{
        controlCheck:{
            type:String,
            default:""
        }
    },
    watch:{
        controlCheck(after){
            this.controlName = after;
            this.getDataRelated()
        }
    },
    computed:{
        sDocumentStore(){
            return this.$store.state.document.documentProps
        }
    },
    data(){
        return {
            isShow:false,
            listFormulas:[],
            controlName:"",
            headers:  [
            { text: 'Vị trí', value: 'position' },
            { text: 'Nguồn', value: 'source' },
            { text: 'Công thức', value: 'formulas' },
            ],
            dataTable: [],
        }
    },
   
    methods:{
        
        showDialog(){
            this.isShow = true
        },
        hideDialog(){
            this.isShow = false
        },
        getDataRelated(){
            console.log(this.sDocumentStore);
            
            formulasApi.getRelated({fieldName:this.controlName,documentName:this.sDocumentStore.name.value}).then(res=>{
                
            }).always(() => {}).catch({});
        }
        
    },
    mounted(){
        
    }
}
</script>
<style scoped>
    .s-subtitle-control .control-name{
        font-weight: 600;
        
    }
    .s-subtitle-control{
        font-size: 13px;
        padding: 14px 0px 0px 24px !important;
    }
    .headline{
        padding: 8px 0px 0px 24px !important;
    }
</style>