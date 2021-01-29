<template>
    <div class="symper-datafow-editor d-flex h-100 w-100" ref="dataflowEditor">
        <div class="d-flex flex-column" :style="{
            width: 'calc(100% - 400px)'
        }">
            <DataflowToolBar 
                class="border-bottom-1"
                :style="{
                    height: '40px'
                }"
                :action="action"
                :idDataflow="idObject"
                :instanceKey="instanceKey"/>
            
            <DataflowWorkspace
                ref="dataflowWorkspace"
                :instanceKey="instanceKey"
                :action="action"
                style="flex-grow: 1;"
            />

            <vue-resizable
                ref="dataflowRunningInfo"
                class="border-top-1"
                :min-height="100"
                :height="330"
                :max-height="500"
                :active="['t']"
            >
                <DataflowRunningInfo
                    :instanceKey="instanceKey"
                    :action="action"
                />
            </vue-resizable>
        </div>
        <vue-resizable
            ref="dataflowSidebarConfig"
            class="border-left-1 d-block"
            :min-width="200"
            :width="400"
            :max-width="700"
            :active="['b']"
        >
            <DataflowSidebarConfig/>
        </vue-resizable>
    </div>
</template>

<script>
import DataflowRunningInfo from "@/components/dataflow/components/DataflowRunningInfo.vue";
import DataflowSidebarConfig from "@/components/dataflow/components/DataflowSidebarConfig.vue";
import DataflowToolBar from "@/components/dataflow/components/DataflowToolBar.vue";
import DataflowWorkspace from "@/components/dataflow/components/DataflowWorkspace.vue";
import VueResizable from 'vue-resizable';
import DataflowEditorWorker from 'worker-loader!@/worker/dataflow/DataflowEditor.Worker.js';

export default {
    created(){
        this.dataflowEditorWorker = new DataflowEditorWorker();
        this.listenFromWorker();
        this.getDataflowInfo();
    },
    mounted(){
    },
    methods: {
        restoreDataflowData(data){
            let graphData = data.graph;
            this.$refs.dataflowWorkspace.restoreGraphDisplay(graphData);
        },
        getDataflowInfo(){
            if(this.idObject){
                this.dataflowEditorWorker.postMessage({
                    action: 'getDataflowInfo',
                    data: {
                        id: this.idObject 
                    }
                });
            }
        },
        listenFromWorker(){
            let self = this;
            this.dataflowEditorWorker.addEventListener("message", function (event) {
                let data = event.data;
                let action = data.action;
                if(self[action]){
                    self[action](data.data);
                } else {
                    console.error(` action ${action} not found `);
                }
            });
        },
    },
    data(){
        return {
            contentWidth: "calc(100% - 350px)",
            sidebarWidth: 350,
            instanceKey: Date.now(),
        };
    },
    computed: {
 
    },
    components: {
        DataflowToolBar,
        DataflowWorkspace,
        DataflowSidebarConfig,
        DataflowRunningInfo,
        'vue-resizable': VueResizable
    },
    props: {
        action: {
            type: String,
            default: 'create'
        },
        idObject: {
            default: 0
        },
    }
}
</script>

<style>

</style>