<template>
<div >
    <dataflow-paper 
        :height="height" 
        ref="dataflowPaper"
        @node-selected="selectNode"
    />
</div>
</template>

<script>
import DataflowPaper from "@/components/dataflow/components/DataflowPaper.vue";
export default {
    components: {
        DataflowPaper
    },
    methods: {
        selectNode(data){
            this.$store.commit('dataflow/setSelectingWidget', {
                id: data.id,
                instanceKey: this.instanceKey
            });
        },
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