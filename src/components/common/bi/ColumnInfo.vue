<template>
    <div class="single-row px-4 item-column-dataset justify-space-between">
        <span class="text-ellipsis">
            <v-icon color="#000" class="fs-14 pr-2">{{icon[infoColumn.type]}}</v-icon>
            <span :title="infoColumn.title ? infoColumn.title : infoColumn.as" class="mr-2" :class="{ 'highlight' : infoColumn.isSelected}">{{infoColumn.title ? infoColumn.title : infoColumn.as  }}</span>
        </span>
        <div  class="float-right d-flex" style="color: #909399">
           <span :title="infoColumn.name ? infoColumn.name : infoColumn.columnName">{{infoColumn.name ? infoColumn.name : infoColumn.columnName}}</span> 
            <v-icon title="Remove" v-if="showIconRemove" @click.prevent.stop="removeItem(infoColumn)" x-small class=" ml-2 mr-1">mdi-close</v-icon>
        </div>
    </div>
</template>

<script>
import { DATATYPE_ICONS } from "@/components/dataflow/configPool/dataflowConfig.js";
export default {
    props:{
        infoColumn:{
            type: Object,
            default(){
                return {}
            }
        },
        showIconRemove:{
            type: Boolean,
            default: false
        }

    },
    data(){
        return {
            icon: DATATYPE_ICONS
        }
    },
    methods:{
        removeItem(item){
            this.$emit("remove-item",item);
        }
    }

}
</script>

<style scoped>
.single-row:hover {
    background: #f5f5f5;
    cursor: all-scroll;
}
.item-column-dataset{
    display: flex;
    margin-top: 6px;
    font-size: 12px;
}
.highlight{
    color: #f58634;
}
</style>