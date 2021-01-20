<template>
    <div class="w-100 h-100 mt-2" style="position:relative">
        <v-select
            style="width: calc(100% - 20px);margin-left: 10px;"
            v-model="selectedValues"
            :multiple="cellView.displayOptions.selectionType == 'multiple'"
            filterable
            remote
            collapse-tags
            reserve-keyword
			:items="Object.keys(data)"
            @change="handleChangeFilterValue"
            placeholder="Enter key word"
            size="mini"
            :remote-method="remoteMethod"
            :loading="loading">
            <!-- <el-option
                v-for="item in data"
                :key="item[selectedCol.as]"
                :label="item[selectedCol.as]"
                :value="item[selectedCol.as]">
            </el-option> -->
        </v-select>
        <i class="el-icon-arrow-down" style="position:absolute;    right: 15px;top: 8px;"></i>
    </div>
</template>
<script>
export default {   
    data(){
        return {
            selectedValues : [],
            loading : false,
        }
    },
    watch : {
        data(){
            this.loading = false;
        }
    },
    methods:{
         handleChangeFilterValue(values){
            if(typeof values == 'string'){
                values = [values];
            }
            for(let i in this.cellView.selectedValues){
                delete this.cellView.selectedValues[i];
            }

            
            for(let vl of values){
                this.cellView.selectedValues[vl] = true;
            }
            this.$emit('change-droplist-filter-value',this.cellId);
        },
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                if(this.filterAction){
                    clearTimeout(this.filterAction);
                }

                this.filterAction = setTimeout((thisCpn, query) => {
                    SDashboardEditor.$emit('change-query-drop-list-filter',{cellId : thisCpn.cellId , query : query});
                }, 400, this, query);
            }
        }
    },
    props:['data','selectionType','selectedCol','cellId','cellView'],
}
</script>
<style scoped>

</style>