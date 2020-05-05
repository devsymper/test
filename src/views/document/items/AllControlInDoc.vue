<template>
     <v-dialog
        :key="Date.now()"
        v-model="isShow"
        width="90%"
        fullscreen
        >
        <v-card
        height="800px"
        >
            <v-card-title class="headline">Bảng tổng hợp control</v-card-title>
            <v-divider></v-divider>
            <v-card-text  style="height: calc(100% - 112px);overflow-y: auto;">
                <data-table :columns="allColumns" :data="allData"/>
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
import { util } from "./../../../plugins/util.js";
export default {
    components:{
        'data-table' : DataTable
    },
    computed:{
        sAllControl(){
            let allControl = this.$store.state.document.editor.allControl;
            return allControl
        },
        allColumns(){
            return getAllPropsControl();
        },
        allData(){
            let allControl = util.cloneDeep(this.sAllControl);
            let allDataControl = [];
            for (let id in allControl) {
                let props = allControl[id].properties;
                console.log(props);
                
                let formulas = allControl[id].formulas;
                let row = {};
                for (let propType in props){
                    let value = props[propType].value;
                    if(props[propType].type == 'checkbox'){
                        value = (value === 1) ? true : false;
                    }
                    row[propType] = value
                }
                for (let f in formulas){
                    row[f] = formulas[f].value
                }
                allDataControl.push(row);
            }
            return allDataControl;
        }
    },
    data(){
        return{
            isShow:false,
           
        }
    },
    methods:{
        
        showDialog(){
            $('.sym-document-body').addClass('d-none');
            this.isShow = true
        },
        hideDialog(){
            this.isShow = false
             $('.sym-document-body').removeClass('d-none');
        },
        
       
        
    },
    mounted(){
        
    }
}
</script>   
<style scoped>
    .s-all-control-option{
        height: 90%;
    }
</style>