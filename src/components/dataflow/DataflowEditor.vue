<template>
    <div class="symper-datafow-editor h-100 w-100 position-relative" ref="dataflowEditor">
        <div class="d-inline-block workspace-left-pane" ref="workspaceLeftPane">
            <DataflowToolBar 
                class="border-bottom-1"
                :style="{
                    height: '40px'
                }"
                :action="action"
                :idDataflow="idObject"
                :instanceKey="instanceKey"/>
            
            <DataflowWorkspace
                :height="workspaceHeight"
                ref="dataflowWorkspace"
                :instanceKey="instanceKey"
                :action="action"
            />

            <vue-resizable
                ref="dataflowRunningInfo"
                class="border-top-1 dataflow-running-info bg-white"
                :height="runningInfoHeight"
                :active="['t']"
                @resize:end="handleResizeBottomPane"
            >
                <DataflowRunningInfo
                    :instanceKey="instanceKey"
                    :action="action"
                />
            </vue-resizable>
        </div>
        <vue-resizable
            ref="dataflowSidebarConfig"
            class="border-left-1 h-100 bg-white dataflow-sidebar-config"
            :active="['l']"
            :width="sidebarWidth"
            @resize:end="handleResizePane"
        >
            <DataflowSidebarConfig
                :instanceKey="instanceKey"
                :action="action"/>
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
import { getDefaultDataflowConfig } from "@/components/dataflow/configPool/dataflowConfig.js";
export default {
    created(){
        this.dataflowEditorWorker = new DataflowEditorWorker();
        this.listenFromWorker();
        this.getDataflowInfo();
        this.initData();
    },
    mounted(){
        this.calcWorkspaceHeight();
    },
    methods: {
        initData(){
            let defaultData = getDefaultDataflowConfig();
            let data = {
                ...defaultData,
            }
            this.$store.commit('dataflow/setDataflowConfig', {
                instanceKey: this.instanceKey,
                data
            });

            this.$store.commit('dataflow/setSelectingWidget', {
                instanceKey: this.instanceKey,
                id: 'home'
            }); 
        },
        calcWorkspaceHeight(){
            this.workspaceHeight = $(this.$el).height() - (40 + this.runningInfoHeight)            
        },
        handleResizePane(eventName,left,top,width,height){
            $(this.$refs.workspaceLeftPane).css('width', $(this.$refs.dataflowEditor).width() - $(this.$refs.dataflowSidebarConfig.$el).width());
        },
        handleResizeBottomPane(eventName,left,top,width,height){
            this.workspaceHeight =  $(this.$el).height() - (40 + $(this.$refs.dataflowRunningInfo.$el).height());
        },
        restoreDataflowData(data){
            let graphData = data.graph;
            this.$refs.dataflowWorkspace.restoreGraphDisplay(graphData);
            setTimeout((self) => {
                self.$refs.dataflowWorkspace.center();
            }, 0, this);
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
            runningInfoHeight: 200,
            workspaceHeight: 250,
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
.workspace-left-pane {
    width: calc(100% - 350px);
    height: 100%;
}

.dataflow-sidebar-config {
    left: unset!important;
    position: absolute!important;
    right: 0px;  
    top: 0px!important;
    max-width: 600px!important;
}

.dataflow-running-info {
    min-height: 10%;
    max-height: 80%;
    position: absolute!important;
    bottom: 0!important;
    top: unset!important;
}
</style>