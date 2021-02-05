<template>
    <div class="w-100 fs-13">    
        <div class="d-flex justify-space-between pl-1 w-100">
            <div class="mr-1" style="width:50%">
                <div class="font-weight-medium">Column name title </div>
                <v-text-field
                    v-model="nodeData.configs.keyColumnTitle"
                    class="d-inline-block sym-small-size"
                    single-line
                    outlined
                    hide-details
                    dense
                    flat
                    style="width: 95%"
                ></v-text-field>
            </div>
            <div style="width:50%">
                <div class="font-weight-medium">Column value title </div>
                <v-text-field
                    v-model="nodeData.configs.dataColumnTitle"
                    class="d-inline-block sym-small-size"
                    single-line
                    outlined
                    hide-details
                    dense
                    flat
                    style="width: 95%"
                ></v-text-field>
            </div>
        </div>
      
        <div class="pt-1" style="height:200px">
            <span class="pl-1 font-weight-medium">Key columns</span>
            <dataset-column-selector 
                style="height:calc(100% - 15px)"
                :rowData="nodeData.configs.keyColumns"
            />
        </div>
        <div class="pt-1" style="height:calc(100% - 250px)">
            <span class="pl-1 font-weight-medium">Data columns</span>
            <dataset-column-selector 
                :rowData="nodeData.configs.dataColumns"
            />
        </div>
    </div>
</template>

<script>
import DatasetColumnSelector from '../../../dataset/DatasetColumnSelector.vue'
export default {
    components: { DatasetColumnSelector },
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

        }
    },

}
</script>

<style scoped>

</style>