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
                <td colspan="2" class="py-1">
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
                                            class="sym-select"
                                            dense
                                            flat
                                            style="float:right;width:200px"
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
    props:{
        // nodeData:{
        //     type: Object,
        //     default(){
        //         return {}
        //     }
        // },
    },
    data(){
        return{
            nodeData: {
                configs:{"wgName":"","wgDes":"","saveAs":[],"nameToSaveAs":"","newIdDataset":"stmp_1608611308121","selectedDataset":"","errorList":{"notFoundColumns":[]},"autoUpdatePeriod":{"time":5,"unit":"minutes"},"nextNodes":["2406dc99-c6bd-4b4c-9dce-72c61dde8cf9"],"prevNodes":["68f23029-80c9-4bb4-aeab-66bcc21bbaf1"],"allColumns":{"stmp_1608612473348_nct":{"uid":"stmp_1608612473348_nct","from":"68f23029-80c9-4bb4-aeab-66bcc21bbaf1","type":"date","title":"Ngày chứng từ","idDataset":"stmp_1608612473348","columnName":"nct","symperDocId":"stmp_1608612473348"},"stmp_1608612473348_sum_a":{"uid":"stmp_1608612473348_sum_a","from":"68f23029-80c9-4bb4-aeab-66bcc21bbaf1","type":"number","title":" sum A","idDataset":"stmp_1608612473348","columnName":"sum_a","symperDocId":"stmp_1608612473348"},"stmp_1608612473348_ca_lam":{"uid":"stmp_1608612473348_ca_lam","from":"68f23029-80c9-4bb4-aeab-66bcc21bbaf1","type":"text","title":"Ca làm","idDataset":"stmp_1608612473348","columnName":"ca_lam","symperDocId":"stmp_1608612473348"},"stmp_1608612473348_sum_a1":{"uid":"stmp_1608612473348_sum_a1","from":"68f23029-80c9-4bb4-aeab-66bcc21bbaf1","type":"number","title":" sum A1","idDataset":"stmp_1608612473348","columnName":"sum_a1","symperDocId":"stmp_1608612473348"},"stmp_1608612473348_day_chuyen":{"uid":"stmp_1608612473348_day_chuyen","from":"68f23029-80c9-4bb4-aeab-66bcc21bbaf1","type":"text","title":"Dây chuyền","idDataset":"stmp_1608612473348","columnName":"day_chuyen","symperDocId":"stmp_1608612473348"},"stmp_1608612473348_tb1_ma_hang":{"uid":"stmp_1608612473348_tb1_ma_hang","from":"68f23029-80c9-4bb4-aeab-66bcc21bbaf1","type":"text","title":"Mã sản phẩm","idDataset":"stmp_1608612473348","columnName":"tb1_ma_hang","symperDocId":"stmp_1608612473348"},"stmp_1608612473348_sum_nap_tu_lo":{"uid":"stmp_1608612473348_sum_nap_tu_lo","from":"68f23029-80c9-4bb4-aeab-66bcc21bbaf1","type":"number","title":" sum Nạp từ lò","idDataset":"stmp_1608612473348","columnName":"sum_nap_tu_lo","symperDocId":"stmp_1608612473348"},"stmp_1608612473348_tb1_cong_viec":{"uid":"stmp_1608612473348_tb1_cong_viec","from":"68f23029-80c9-4bb4-aeab-66bcc21bbaf1","type":"text","title":"Công việc","idDataset":"stmp_1608612473348","columnName":"tb1_cong_viec","symperDocId":"stmp_1608612473348"},"stmp_1608612473348_sum_phe_pham_sau_mai":{"uid":"stmp_1608612473348_sum_phe_pham_sau_mai","from":"68f23029-80c9-4bb4-aeab-66bcc21bbaf1","type":"number","title":" sum Phế phẩm sau mài","idDataset":"stmp_1608612473348","columnName":"sum_phe_pham_sau_mai","symperDocId":"stmp_1608612473348"},"stmp_1608612473348_sum_phe_pham_dong_dai":{"uid":"stmp_1608612473348_sum_phe_pham_dong_dai","from":"68f23029-80c9-4bb4-aeab-66bcc21bbaf1","type":"number","title":" sum Phế phẩm đóng đai","idDataset":"stmp_1608612473348","columnName":"sum_phe_pham_dong_dai","symperDocId":"stmp_1608612473348"},"stmp_1608612473348_sum_tb1_nap_tu_ke_khac_ca":{"uid":"stmp_1608612473348_sum_tb1_nap_tu_ke_khac_ca","from":"68f23029-80c9-4bb4-aeab-66bcc21bbaf1","type":"number","title":" sum tb1_nạp từ kệ khác ca","idDataset":"stmp_1608612473348","columnName":"sum_tb1_nap_tu_ke_khac_ca","symperDocId":"stmp_1608612473348"}},"addedColumns":[{"name":"sl_nap","type":"number","title":"SL nạp","formula":"[sum_tb1_nap_tu_ke_khac_ca] + [sum_nap_tu_lo]","columnAdd":{"type":"new","colInfp":[]},"invalidConfigs":false}]}
            },
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
}
.sym-select >>> .v-input__append-inner{
    margin: 0px!important;
}
</style>