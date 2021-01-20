<template>
    <div class="pl-2 pr-2" v-if="displayOptions.selectionMode == 'default'">
        <date-filter 
            @change-filter-value="handleChangeFilterValue"
            :data="displayOptions.data"
            :selectionType="displayOptions.selectionType"
            :selectedCol="selectedCol"
            :cellId="cellConfigs.sharedConfigs.cellId"
            :cellView="cellConfigs.viewConfigs"
            v-if="selectedCol.type == 'date'">
        </date-filter>
        <select-filter 
            @change-filter-value="handleChangeFilterValue"
            :data="displayOptions.data"
            :selectionType="displayOptions.selectionType"
            :selectedCol="selectedCol"
            :cellId="cellConfigs.sharedConfigs.cellId"
            :cellView="cellConfigs.viewConfigs"
            v-else-if="selectedCol.type != 'number'">
        </select-filter>
        <div class="pl-3 pr-3" v-else>
            <div style="margin-bottom: -10px" class="filter-base">
                <v-text-field
                    size="nano"
                    :controls="false"
                    class=" mr-2 w-45"
					solo
                    style="min-width:50px;max-width:100px"
                    @change="handleChangeFilterValue(cellConfigs.sharedConfigs.cellId)"
                    placeholder="Please Input"
                    v-model="sliderDataValue.value[0]">
                </v-text-field>
                <v-text-field
                    style="min-width:50px;max-width:100px"
					solo
                    size="nano"
                    :controls="false"
                    @change="handleChangeFilterValue(cellConfigs.sharedConfigs.cellId)"
                    class="w-45"
                    placeholder="Please Input"
                    v-model="sliderDataValue.value[1]">
                </v-text-field>
            </div>
            <!-- <el-slider
                v-model="sliderDataValue.value"
                range
                class="mini-slider"
                @change="handleChangeFilterValue(cellConfigs.sharedConfigs.cellId)"
                :max="sliderDataValue.max"
                :min="sliderDataValue.min">
            </el-slider> -->
        </div>
    </div>
    <div v-else-if="displayOptions.selectionMode == 'dropList'">
        <drop-list-filter 
            @change-droplist-filter-value="handleChangeFilterValue"
            :data="displayOptions.data"
            :selectedCol="selectedCol"
            :cellId="cellConfigs.sharedConfigs.cellId"
            :cellView="cellConfigs.viewConfigs">
        </drop-list-filter>
    </div>
</template>
<script>
import SelectFilter  from "@/components/dashboard/components/filter/SelectFilter";
import SliderFilter  from "@/components/dashboard/components/filter/SliderFilter";
import HorizontalFilter  from "@/components/dashboard/components/filter/HorizontalFilter";
import DateFilter  from "@/components/dashboard/components/filter/DateFilter";
import DropListFilter  from "@/components/dashboard/components/filter/DropListFilter";


export default {
	props: {
        cellConfigs: {
            default(){
                return {}
            }
        }
    },
    methods:{
        handleChangeFilterValue(cellId){
            // SDashboardEditor.applyFilterFromCell(cellId);
        }
    },
    created(){
    },
    computed:{
        selectedCol(){
            let col = this.cellConfigs.rawConfigs.setting.value.selectedColums;
			col = col.length > 0 ? col[0] : {};
            return col;
        },
        displayOptions(){
            return this.cellConfigs.viewConfigs.displayOptions;
        },
        sliderDataValue(){
            if(!this.displayOptions.data.value){
                return {
                    value : [0,0],
                    max : 0,
                    min : 0
                }
            }else{
                return this.displayOptions.data;
            }
        }
    },
    data(){
        return {}
    },
    components:{
        'select-filter': SelectFilter,
        'slider-filter': SliderFilter,
        'horizontal-filter': HorizontalFilter,
        'date-filter': DateFilter,
        'drop-list-filter': DropListFilter,
    }
}
</script>
<style scoped>
.filter-base >>> .v-text-field__details{
	display: none !important;
}
.filter-base >>> .v-input__control{
	min-height: unset !important;
}
.filter-base >>> .v-input__slot{
	box-shadow: unset !important;
	border: 1px solid lightgray;
}
</style>