<template>
    <div class="single-row px-4 item-column-dataset justify-space-between">
        <span class="text-ellipsis">
            <v-icon color="#000" class="fs-14 pr-2">{{icon[infoColumn.type]}}</v-icon>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <span v-on="on" class="mr-2" :class="{ 'highlight' : infoColumn.isSelected}">{{infoColumn.title}}</span>
                </template>
                <span>{{ infoColumn.title }}</span>
            </v-tooltip>
        </span>
         <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <span v-on="on" class="float-right pr-1" style="color: #909399">{{infoColumn.name}}</span>
            </template>
            <span>{{ infoColumn.name }}</span>
        </v-tooltip>
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
}
.highlight{
    color: #f58634;
}
</style>