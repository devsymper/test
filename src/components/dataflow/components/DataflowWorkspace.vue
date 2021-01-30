<template>
<div >
    <dataflow-paper :height="height" ref="dataflowPaper"/>
</div>
</template>

<script>
import DataflowPaper from "@/components/dataflow/components/DataflowPaper.vue";
export default {
    components: {
        DataflowPaper
    },
    methods: {
        center(){
            this.$refs.dataflowPaper.center();
        },
        restoreGraphDisplay(grapData){
            for(let nodeId in grapData.nodes){
                this.$refs.dataflowPaper.addNodeToWorkspace(grapData.nodes[nodeId]);
            }
            this.$refs.dataflowPaper.addLinks(grapData.links);
        }
    },
    props: {
        action: {
            default: 'create'
        },
        instanceKey: {
            default: ''
        },
        height: {
            default: 250
        },
    },
    mounted(){

    },
    created(){
        
    }
}
</script>

<style>

</style>