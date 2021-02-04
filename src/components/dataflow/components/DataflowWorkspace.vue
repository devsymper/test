<template>
<div >
    <dataflow-paper 
        :height="height" 
        ref="dataflowPaper"
        @node-selected="selectNode"
        @node-added="addNewNode"
        @node-removed="removeNode"
        @link-removed="removeLink"
        @link-connected="connectLink"
        @paper-selected="selectPaper"
    />
</div>
</template>

<script>
import DataflowPaper from "@/components/dataflow/components/DataflowPaper.vue";

export default {
    computed: {
		selectingNode(){
			return this.$store.state.dataflow.allDataflow[this.instanceKey].selectedWidget;
		}
    },
    components: {
        DataflowPaper
    },
    methods: {
        getLinks(){
            return this.$refs.dataflowPaper.getLinks();
        },
        getNodeAttr(id){
            return this.$refs.dataflowPaper.getNodeAttr(id);
        },
        actionOnCanvas(action){
            this.$refs.dataflowPaper.actionOnToolbar(action);
        },
        changeCurrentNodeName(newName){
            this.$refs.dataflowPaper.setNodeName(this.selectingNode.id, newName);
        },
        selectPaper(){
            this.$store.commit('dataflow/setSelectingWidget', {
                id: 'home',
                instanceKey: this.instanceKey
            });
        },
        connectLink(data){
            this.$store.commit('dataflow/connectLink', {
                ...data,
                instanceKey: this.instanceKey
            });
            setTimeout((self) => {
                let allNodes = self.$store.state.dataflow.allDataflow[self.instanceKey].allWidget;
                let targetNode = allNodes[data.targetId];
                self.setLinkOrderForNodes([targetNode]);
            }, 0, this);
        },
        setLinkOrderForNodes(nodes = null){
            let allNodes = this.$store.state.dataflow.allDataflow[this.instanceKey].allWidget;
            if(nodes == null){
                nodes = [];
                let node = null;
                for(let id in allNodes){
                    node = allNodes[id];
                    if(node.stackInput){
                        nodes.push(node);
                    }
                }
            }
            for(let node of nodes){
                if(node.stackInput){
                    let c = 1;
                    for(let sourceId in node.prevNodes){
                        this.$refs.dataflowPaper.updateLinkNumber(sourceId, node.id, c);
                        c += 1;
                    }
                }
            }
        },
        removeLink(data){
            this.$store.commit('dataflow/disconnectLink', {
                ...data,
                instanceKey: this.instanceKey
            });
            setTimeout((self) => {
                let allNodes = self.$store.state.dataflow.allDataflow[self.instanceKey].allWidget;
                let targetNode = allNodes[data.targetId];
                if(targetNode){
                    self.setLinkOrderForNodes([targetNode]);
                }
            }, 0, this);
        },
        removeNode(data){
            this.$store.commit('dataflow/removeNodeData', {
                ...data,
                instanceKey: this.instanceKey
            });
        },
        addNewNode(data){
            if(this.status == 'editing'){
                this.$store.commit('dataflow/addNewNodeData', {
                    ...data,
                    instanceKey: this.instanceKey
                });
            }
        },
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
        status: {
            default: 'init'
        },
    },
    mounted(){

    },
    created(){
    },
}
</script>

<style>

</style>