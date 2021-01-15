<template>
    <div class="single-row px-4 item-column-dataset justify-space-between">
        <span class="text-ellipsis">
            <v-icon color="#000" class="fs-14 pr-2">{{icon[infoColumn.type]}}</v-icon>
            <span :title="infoColumn.title" class="mr-2" :class="{ 'highlight' : infoColumn.isSelected}">{{infoColumn.title}}</span>
        </span>
        <span :title="infoColumn.name" class="float-right pr-1" style="color: #909399">{{infoColumn.name}}</span>
    </div>
</template>

<script>
export default {
    props:{
        infoColumn:{
            type: Object,
            default(){
                return {}
            }
        }

    },
    data(){
        return {
            icon:{
                'number' : "mdi-numeric",  
                'text' : "mdi-format-letter-case",  
                'date' : "mdi-calendar",  
            }
        }
    }

}
</script>

<style scoped>
.single-row:hover {
    background: #f5f5f5;
    cursor: pointer;
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