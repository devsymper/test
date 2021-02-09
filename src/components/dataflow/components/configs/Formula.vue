<template>
    <div class="w-100">
        <table class="w-100 fs-13">
            <thead>
                <tr style="text-align:left">
                    <th style="padding-left:10px">Title</th>
                    <th style="padding-left:10px">Name</th>
                </tr>
            </thead>
            <tr style="border-bottom:1px solid #eee"  v-for="(col,idx) in nodeData.configs.addedColumns" :key="idx" :name="idx">
                <td colspan="2" class="py-2">
                    <v-expansion-panels
                        multiple
                        flat
                        style="overflow: hidden;"
                    >
                        <v-expansion-panel class="sym-expand-panel ">
                            <v-expansion-panel-header class="v-expand-header px-1 py-0">
                                <v-text-field
                                    class="d-inline-block px-1 sym-small-size"
                                    v-model="col.title"
                                    single-line
                                    outlined
                                    hide-details
                                    dense
                                    flat
                                    style="width: inherit;width:45%"
                                ></v-text-field>
                                <v-text-field
                                    v-model="col.name"
                                    class="d-inline-block px-1 sym-small-size"
                                    single-line
                                    outlined
                                    hide-details
                                    dense
                                    flat
                                    style="width: inherit;width:40%"
                                ></v-text-field>
                                <v-icon  @click="removeCol(idx)" class="fs-16">mdi-close</v-icon>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content class="sym-v-expand-content py-1">
                                <div>
                                    <formula-editor 
                                        v-model="col.formula"
                                        :width="'100%'"
                                        :height="'80px'"
                                        ref="formulaEditor"
                                        class="formular-editor"
                                    />
                                    <div class="w-100">
                                        <span class="font-weight-medium">Data type: </span>
                                        <v-select
                                            class="sym-select fs-13"
                                            dense
                                            flat
                                            style="float:right;width:110px;margin-right:5px"
                                            v-model="col.type"
                                            :items="dataTypes"
                                            outlined
                                        ></v-select>
                                    </div>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                
                </td>
            </tr>
            <tfoot>
                <tr>
                    <td colspan="2">
                        <div class="w-100">
                            <v-btn  @click="addFormulaColumn" depressed small class="mx-2 mt-1" style="width:95%">Add Column</v-btn>
                        </div>
                    </td>
                </tr>
               
            </tfoot>
            
        </table>
    </div>
</template>

<script>
import FormulaEditor from '../../../formula/editor/FormulaEditor.vue'

export default {
    components: { 
        FormulaEditor,
    
    },
    computed:{
        addedColumns(){
            return this.nodeData.configs.addedColumns;
        }
    },
    props:{
        nodeData:{
            type: Object,
            default(){
                return {}
            }
        },

    },
    watch:{
        addedColumns:{
            deep:true,
            handler(vl){
                if (vl && Object.keys(vl).length > 0) {
                    this.$emit('change-configs');
                }
            }
        }
    },
    data(){
        return{
            dataTypes:[
                {
                    text:'Text',
                    value:'text'
                },
                {
                    text:'Number',
                    value:'number'
                },
                {
                    text:'Date',
                    value:'date'
                },
                {
                    text:'Datetime',
                    value:'datetime'
                },
                {
                    text:'Time',
                    value:'time'
                },
            ],
        }
    },
    methods:{
        addFormulaColumn(){
            let defaultFmlColConfig = {
                columnAdd:{
                    type:'new', // hoặc exist
                    colInfp:{}
                },
                title:'',
                name:'',
                type:'text',
                formula:''
            };
            this.nodeData.configs.addedColumns.push(defaultFmlColConfig);
        },
        removeCol(idx){
            this.nodeData.configs.addedColumns.splice(idx,1);
        },
    }

}
</script>

<style scoped>
.v-expand-header{
    min-height: 25px;
}
.v-expansion-panel-header{
    min-height: 25px;
}
.sym-v-expand-content >>>.v-expansion-panel-content__wrap{
    padding: 0px;
    padding-left: 8px;
}
.formular-editor >>> .margin-view-overlays{
    background: #eee;
    width: 45px!important;
}
.sym-select {
    height: 25px!important;
}
.sym-select >>> .v-input__slot{
    min-height: 20px!important;
    height: 25px;
    padding-right:4px!important;
}
.sym-select >>> .v-input__append-inner{
    margin: 0px!important;
}
</style>