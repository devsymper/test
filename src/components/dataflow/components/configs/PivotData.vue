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
        nodeData:{
            type: Object,
            default(){
                return {}
            }
        },

    },
    data(){
        return{
            panelAllColumns:[0],
            panelColumns:[0],
            panelRows:[0],
            panelValues:[0],
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