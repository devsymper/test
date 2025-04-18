<template>
    <div class="symper-datafow-editor h-100 w-100 position-relative" ref="dataflowEditor">
        <div class="d-inline-block workspace-left-pane" ref="workspaceLeftPane">
            <DataflowToolBar 
                class="border-bottom-1"
                :style="{
                    height: toolbarHeight + 'px',
                    lineHeight: toolbarHeight + 'px'
                }"
                :action="action"
                :idDataflow="idObject"
                :instanceKey="instanceKey"
                @action-on-workspace="handleActionOnWorkspace"
                @run-dataflow="runDataflow"
                @save-dataflow="saveDataflow"/>
            
            <DataflowWorkspace
                :height="workspaceHeight"
                ref="dataflowWorkspace"
                :instanceKey="instanceKey"
                :action="action"
                :status="status"
            />

            <vue-resizable
                ref="dataflowRunningInfo"
                class="border-top-1 dataflow-running-info bg-white"
                :height="runningInfoHeight"
                :active="['t']"
                @resize:end="handleResizeBottomPane"
            >
                <DataflowRunningInfo
                    ref="runningOutput"
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
                @node-name-changed="handleChangeNodeName"
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
import { getDefaultDataflowConfig, castAllMapObjsToNodes } from "@/components/dataflow/configPool/dataflowConfig.js";
import { dataflowApi } from "@/api/dataflow.js";

export default {
    created(){
        this.dataflowEditorWorker = new DataflowEditorWorker();
        this.listenFromWorker();
        this.getDataflowInfo();
        this.initData();
    },
    mounted(){
        this.calcWorkspaceHeight();
        if(this.action == 'create'){
            this.status = 'editing';
        }
    },
    methods: {
        async saveDataflow(){
            let dataToSave = this.getDataflowConfigs();
            dataToSave.id = this.idObject;
            dataToSave.action = this.action;
            dataToSave.runToNode = false;
            let res = {};

            if(!dataToSave.dataflow.name.toLowerCase().includes('test')){
                this.$snotifyWarning({}, "Không thể lưu dataflow", "Do đang trong giai đoạn test nên tên dataflow cần chứa từ test để có thể lưu");
                return;
            }

            if(this.action == 'clone' || this.action == 'create'){
                res = await dataflowApi.createDataflow(dataToSave);
            }else if(this.action == 'edit'){
                res = await dataflowApi.updateDataflow(this.idObject, dataToSave);
            }

            if(res.status == '200'){
                this.$snotifySuccess("Lưu dataflow thành công");
                if(this.action == 'clone' || this.action == 'create'){
                    this.$router.push(`/dataflows/${res.data.id}/edit`);
                }
            }else{
                this.$snotifyError(res, "Lưu dataflow thất bại");
            }
        },
        getDataflowConfigs(){
            let allNodes = this.$store.state.dataflow.allDataflow[this.instanceKey].allWidget;
            let links = [];
            let dataflow = {
                name: allNodes.home.name,
                variables: allNodes.home.getVariables()
            };

            let nodes = {};
            let count = 1;
            let currentNode = null;
            for(let id in allNodes){
                currentNode = allNodes[id];
                if(id == 'home'){
                    continue;
                }
                let nodeAttrs = this.$refs.dataflowWorkspace.getNodeAttr(id);
                nodes[id] = {
                    jointInfo:{
                        id:id,
                        name: nodeAttrs.attrs['.symper-widget-label'].text,
                        position: nodeAttrs.position,
                        type: nodeAttrs.type,
                        nodeNum: count
                    },
                    symperConfigs: currentNode.getConfigsToSave()
                };
                count += 1;
            }

            let jointLinks = this.$refs.dataflowWorkspace.getLinks();
            for(let link of jointLinks){
                links.push({
                    source: link.attributes.source.id,
                    target: link.attributes.target.id
                });
            }
            return {
                dataflow: dataflow,
                nodes: nodes,
                links: links,
            }
        },
        checkCanRun(){
            return true;
        },
        runDataflow(){
			this.$refs.runningOutput.showPreloader()
            if(!this.checkCanRun()){
                return;
            }
            let dataflowInfo = this.getDataflowConfigs();
            dataflowInfo.dataflow_id = this.idObject;
            this.$refs.runningOutput.getRunningData(this.selectingNode.id, dataflowInfo);
        },
        handleActionOnWorkspace(action){
            this.$refs.dataflowWorkspace.actionOnCanvas(action);
        },
        handleChangeNodeName(data){
            if(data.name == 'wgName'){
                this.$refs.dataflowWorkspace.changeCurrentNodeName(data.value);
            }
        },
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
            this.workspaceHeight = $(this.$el).height() - (this.toolbarHeight + this.runningInfoHeight)            
        },
        handleResizePane(eventName,left,top,width,height){
            $(this.$refs.workspaceLeftPane).css('width', $(this.$refs.dataflowEditor).width() - $(this.$refs.dataflowSidebarConfig.$el).width());
        },
        handleResizeBottomPane(eventName,left,top,width,height){
			this.workspaceHeight =  $(this.$el).height() - (this.toolbarHeight + $(this.$refs.dataflowRunningInfo.$el).height());
			this.$refs.runningOutput.reCalcHeight()
        },
        restoreDataflowDisplay(data){ // khôi phục data từ server cho hiển thị dataflow 
            let graphData = data.graph;
            this.$refs.dataflowWorkspace.restoreGraphDisplay(graphData);
            setTimeout((self) => {
                self.$refs.dataflowWorkspace.center();
            }, 0, this);
        },
        restoreRunningNodeData(data){ // Khôi phục lại data từ server phục vụ cho việc chạy dataflow
            let allNode = castAllMapObjsToNodes(data);
            for(let id in allNode){
                console.log(id, allNode[id].type, allNode[id].output, 'xxxxxxxxx');
            }
            this.$store.commit('dataflow/setAllNodeRunning', {
                allNode,
                instanceKey: this.instanceKey
            });

            setTimeout((self) => {
                self.status = 'editing';
                this.$refs.dataflowWorkspace.setLinkOrderForNodes();
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
            toolbarHeight: 35,
            runningInfoHeight: 200,
            workspaceHeight: 250,
            contentWidth: "calc(100% - 350px)",
            sidebarWidth: 350,
            instanceKey: Date.now(),
            status: 'init', // trạng thái cả editor, nhận một trong các giá trị: init, editing, saving
        };
    },
    computed: {
		selectingNode(){
			return this.$store.state.dataflow.allDataflow[this.instanceKey].selectedWidget;
		}
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