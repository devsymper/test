<template>
    <ganttchart-base 
        :cellConfigs="cellConfigs"
    />
</template>

<script>
import GanttchartBase from './GanttchartBase.vue';
export default {
    components: {
        GanttchartBase
    },
    props: {
        cellConfigs: {
            default(){
                return {}
            }
        },
    },
}
</script>

<style>

</style>