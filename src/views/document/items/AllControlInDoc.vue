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
                <v-tabs @change="changeTab">
                    <v-tab v-for="column in allColumns" :key="column.name">
                        {{column.title}}
                    </v-tab>
                   
                    <!--  -->
                </v-tabs>
                <data-table ref="table" class="mt-2" :allColumns="columns" :rowData="allData"/>
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
import AgDataTable from "./../../../components/common/AgDataTable.vue"
import {getAllPropsControl,getIconFromType} from "./../../../components/document/controlPropsFactory.js"
import { util } from "./../../../plugins/util.js";
export default {
    components:{
        'data-table' : AgDataTable
    },
    computed:{
        sAllControl(){
            let allControl = this.$store.state.document.editor.allControl;
            return allControl
        },
        allColumns(){
            let listColumnGroup = getAllPropsControl();
            listColumnGroup[0].listFields.shift();  // cần bỏ côt tên trong group name do treeview của ag-grid đã lấy theo cột tên
            return listColumnGroup;

        },
        // hàm lấy dữ liệu cho ag-grid
        allData(){ 
            let allControl = util.cloneDeep(this.sAllControl);
            let allDataControl = [];
            for (let id in allControl) {
                let props = allControl[id].properties;
                let formulas = allControl[id].formulas;
                let type = allControl[id].type;
                let row = {};
                for (let propType in props){
                    let value = props[propType].value;
                    if(props[propType].type == 'checkbox'){
                        value = (value === 1) ? true : false;
                    }
                    row[propType] = value
                    if(propType == 'name'){
                        row[propType] = [value];
                    }
                }
                if(type == "submit" || type == "reset" || type == "draft"){
                    row['name'] = [type];
                    row['title'] = [type];
                }
                row['icon'] = getIconFromType(type);
                for (let f in formulas){
                    row[f] = formulas[f].value
                }


                if(type == "table"){
                        let tableName = props.name.value;
                        let listFields = allControl[id].listFields
                        for (let childId in listFields){
                            let childRow = {};
                            let childProps = listFields[childId].properties;
                            let childFormulas = listFields[childId].formulas;
                            let cType = listFields[childId].type;
                            for (let childPropType in childProps){
                                let cValue = childProps[childPropType].value;
                                if(childProps[childPropType].type == 'checkbox'){
                                    cValue = (cValue === 1) ? true : false;
                                }
                                childRow[childPropType] = cValue
                                if(childPropType == 'name'){
                                    childRow[childPropType] = [tableName,cValue]
                                }
                            }
                            for (let f in childFormulas){
                                childRow[f] = childFormulas[f].value
                            }
                            row['icon'] = getIconFromType(cType);
                            allDataControl.push(childRow);
                        }
                    }
                allDataControl.push(row);
            }
            
            return allDataControl;
        }
    },
    data(){
        return{
            isShow:false,
            columns:[],
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
        changeTab(e){
            if(this.$refs.table != undefined)
            this.$refs.table.refreshData(this.allColumns[e].listFields)
        }
        
       
        
    },
    mounted(){
        this.columns = this.allColumns[0].listFields
    }
}
</script>   
<style scoped>
    .s-all-control-option{
        height: 90%;
    }
</style>