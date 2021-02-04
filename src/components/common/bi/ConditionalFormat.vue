<template>
    <div class="w-100">
        <div 
            ref="attrConditionalFormatItem"
            v-for="(condItem, condIdx) in value" 
            @click="selectConditionFormat(condItem,condIdx)" 
            class="attr-conditional-format-item pa-1" 
            :key="condIdx"  
            style="position: relative;">
            <div style="line-height: 18px;">{{condItem.applyColumnObj.title ? condItem.applyColumnObj.title : 'No column selected'}}</div>
            <div style="line-height: 15px; color: grey">{{condItem.applyColumnObj.name ? condItem.applyColumnObj.name : ''}}</div>
            <v-icon style="position: absolute; top: 0px;right: 0px" class="fs-14"  @click.stop="removeCondFormatItem()" >mdi-close</v-icon>
        </div>
        <v-btn 
            @click="addMoreColumnForCondition()"
            small
            depressed
            class="mt-3 w-100" >
            <span>Add column</span>
        </v-btn>
    </div>
</template>

<script>
import defaultConfigs from "@/components/dashboard/configPool/defaultConfigs.js";
import { util } from '../../../plugins/util';

export default {
    props:{
        value: {
            default: []
        },
        items: {
            type: Array,
            default(){
                return []
            }
        },
    },
    data(){
        return{

        }
    },
    methods:{
        selectConditionFormat(condItem,condIdx){
            this.$evtBus.$emit('dashboard-select-condition-format',{condItem:condItem,condIdx:condIdx});
        },
        removeCondFormatItem(){

        },
        addMoreColumnForCondition(){
            let defaultItem = util.cloneDeep(defaultConfigs.defaultConditionFormat);
            this.value.push(defaultItem);
        }
    }
}
</script>

<style scoped>
.attr-conditional-format-item:hover{
    cursor: pointer;
    background-color: rgb(231, 231, 231);
}
</style>