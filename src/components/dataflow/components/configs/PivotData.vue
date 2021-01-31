<template>
    <div class="w-100">
        <v-text-field
            v-model="searchKey"
            v-on:input="onSearch($event)"
            class="d-inline-block pa-2 sym-small-size"
            single-line
            append-icon="mdi-magnify"
            outlined
            hide-details
            dense
            flat
            label="Search"
            :placeholder="$t('common.search')"
            style="width: inherit"
        ></v-text-field>
        <VuePerfectScrollbar 
            style="height:calc(100% - 44px)"
        >
            <!-- all columns -->
            <v-expansion-panels
                multiple
                flat
                style="overflow: hidden;"
                v-model="panelAllColumns"
            >
                <v-expansion-panel class="sym-expand-panel ">
                    <v-expansion-panel-header class="v-expand-header px-4 py-0">
                        <span class="font-weight-medium">All columns ({{nodeData.configs.allColumns.length}})</span>  
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <drag-columns 
                            :searchKey="searchKey"
                            :columns="nodeData.configs.allColumns"
                            :putable="false"
                            :deleteItem="false"
                        />
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
            <!-- columns -->
            <v-expansion-panels
                multiple
                flat
                style="overflow: hidden;"
                v-model="panelColumns"
            >
                <v-expansion-panel class="sym-expand-panel ">
                    <v-expansion-panel-header class="v-expand-header px-4 py-0">
                        <span class="font-weight-medium">Columns ({{nodeData.configs.columns.length}})</span>  
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <drag-columns 
                            :searchKey="searchKey"
                            :pullMethod="null"
                            :columns="nodeData.configs.columns"
                        />
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
            <!-- rows -->
            <v-expansion-panels
                multiple
                flat
                style="overflow: hidden;"
                v-model="panelRows"
            >
                <v-expansion-panel class="sym-expand-panel ">
                    <v-expansion-panel-header class="v-expand-header px-4 py-0">
                        <span class="font-weight-medium">Rows ({{nodeData.configs.rows.length}})</span>  
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <drag-columns 
                            :searchKey="searchKey"
                            :pullMethod="null"
                            :columns="nodeData.configs.rows"
                        />
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
            <!-- values -->
            <v-expansion-panels
                multiple
                flat
                style="overflow: hidden;"
                v-model="panelValues"
            >
                <v-expansion-panel class="sym-expand-panel ">
                    <v-expansion-panel-header class="v-expand-header px-4 py-0">
                        <span class="font-weight-medium">Values ({{nodeData.configs.values.length}})</span>  
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <drag-columns 
                            :searchKey="searchKey"
                            :pullMethod="null"
                            :columns="nodeData.configs.values"
                        />
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </VuePerfectScrollbar>
    </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import DragColumns from '../../../common/bi/DragColumns.vue';
export default {
    components:{
        VuePerfectScrollbar,
        DragColumns
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
            panelAllColumns:[0],
            panelColumns:[0],
            panelRows:[0],
            panelValues:[0],
            nodeData: {
                configs:{"wgName":"","wgDes":"","saveAs":[],"nameToSaveAs":"","newIdDataset":"stmp_1608687152553","selectedDataset":"","errorList":[],"autoUpdatePeriod":{"time":5,"unit":"minutes"},"rows":[{"uid":"stmp_1608687135869_tb1_date","from":"33d9562d-ab4d-4de1-962f-0c96e051b68d","type":"date","title":"tb1 date","idDataset":"stmp_1608687135869","columnName":"tb1_date","symperDocId":"stmp_1608687135869"}],"values":[{"uid":"stmp_1608687135869_tb1_ma_hang_td","from":"33d9562d-ab4d-4de1-962f-0c96e051b68d","type":"text","title":"mã hàng trong bảng 1 bị thay đổi","idDataset":"stmp_1608687135869","columnName":"tb1_ma_hang_td","symperDocId":"stmp_1608687135869"}],"columns":[{"uid":"stmp_1608687135869_ma_hang_td","from":"33d9562d-ab4d-4de1-962f-0c96e051b68d","type":"text","title":"mã hàng ngoài bảng này bị thay đổi","idDataset":"stmp_1608687135869","columnName":"ma_hang_td","symperDocId":"stmp_1608687135869"},{"uid":"stmp_1608687135869_tb1_date","from":"33d9562d-ab4d-4de1-962f-0c96e051b68d","type":"date","title":"tb1 date","idDataset":"stmp_1608687135869","columnName":"tb1_date","symperDocId":"stmp_1608687135869"}],"nextNodes":[],"prevNodes":["33d9562d-ab4d-4de1-962f-0c96e051b68d"],"allColumns":[{"uid":"stmp_1608687135869_ma_hang_ngoai_bang","from":"33d9562d-ab4d-4de1-962f-0c96e051b68d","type":"text","title":"mã hàng","idDataset":"stmp_1608687135869","columnName":"ma_hang_ngoai_bang","symperDocId":"stmp_1608687135869"},{"uid":"stmp_1608687135869_ma_cty_xxxxx","from":"33d9562d-ab4d-4de1-962f-0c96e051b68d","type":"text","title":"ma cong ty","idDataset":"stmp_1608687135869","columnName":"ma_cty_xxxxx","symperDocId":"stmp_1608687135869"},{"uid":"stmp_1608687135869_tb2_ten_hang","from":"33d9562d-ab4d-4de1-962f-0c96e051b68d","type":"text","title":"tên hàng bảng 2","idDataset":"stmp_1608687135869","columnName":"tb2_ten_hang","symperDocId":"stmp_1608687135869"},{"uid":"stmp_1608687135869_tb1_ma_hang","from":"33d9562d-ab4d-4de1-962f-0c96e051b68d","type":"text","title":"mã hàng trong bảng 1","idDataset":"stmp_1608687135869","columnName":"tb1_ma_hang","symperDocId":"stmp_1608687135869"},{"uid":"stmp_1608687135869_tb1_date","from":"33d9562d-ab4d-4de1-962f-0c96e051b68d","type":"date","title":"tb1 date","idDataset":"stmp_1608687135869","columnName":"tb1_date","symperDocId":"stmp_1608687135869"},{"uid":"stmp_1608687135869_ten_hang","from":"33d9562d-ab4d-4de1-962f-0c96e051b68d","type":"text","title":"tên hàng","idDataset":"stmp_1608687135869","columnName":"ten_hang","symperDocId":"stmp_1608687135869"},{"uid":"stmp_1608687135869_vvvv","from":"33d9562d-ab4d-4de1-962f-0c96e051b68d","type":"text","title":"ccccc","idDataset":"stmp_1608687135869","columnName":"vvvv","symperDocId":"stmp_1608687135869"}]}
            },
            searchKey:""
        }
    },
    methods:{
        onSearch(vl){
            this.panelAllColumns = [0];
            this.panelColumns = [0];
            this.panelRows = [0];
            this.panelValues = [0];
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
.font-weight-medium {
    font-size: 13px;
}
</style>