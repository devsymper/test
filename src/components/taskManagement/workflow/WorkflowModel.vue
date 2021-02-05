<template>
    <div class="wrap-workflow-config fs-13">
        <h2>Workflow <span v-if="statusDetail">: {{infoWorkflow.name}}</span></h2>
        <span class="grey--text " v-if="statusDetail">{{infoWorkflow.description}}</span>
        <div class="py-2">
            Cấu hình quy trình hoàn thành task
            <v-btn v-if="!statusDetail" small class="ml-1 px-1" solo depressed @click="dialogSaveOrUpdate = true" color="#1976d2">
                <span style="color:white">{{$t('common.save')}}</span>
            </v-btn>
            <v-btn small v-else class="ml-1 px-1" solo depressed @click="dialogSaveOrUpdate = true" color="#00aa00">
                <span style="color:white">{{$t('common.update')}}</span>
            </v-btn>
        </div>
        
        <div class="wrap-workflow-config__content">
            <div style="width: calc(100% - 200px);" >
                <div class="wrap-workflow-config__header">
                    <v-btn class="add-status-btn" text @click="showPopupAddStatusView">
                        <v-icon left>
                            mdi-plus
                        </v-icon>
                        Thêm status
                    </v-btn>
                    <v-btn text @click="showPopupAddLinkView">
                        <v-icon left>
                            mdi-plus
                        </v-icon>
                        Thêm link
                    </v-btn>
                    <v-icon @click="deleteElementOrLink" style="font-size:20px; height:22px;margin-left:4px;margin-top:8px">
                        mdi-delete-forever
                    </v-icon>
                    <add-status-view v-if="allStatus.length > 0" ref="popupAddStatusView" :allStatus="allStatus"  @after-add-status-click="afterAddStatusClick"/>
                    <add-link-view :listNode="listNode" ref="popupAddLinkView" @after-add-link-click="afterAddLinkClick"/>
                </div>
                <div id='paperView' style="width: 100%; height: calc(100% - 50px)">
                    <div id="task-workflow" >

                    </div>
                </div>
               
            </div>
            <div class="config__content--sidebar p-2 h-100">
                <VuePerfectScrollbar  :style="{height:'100%'}">
                    <form-tpl 
                        style="overflow:hidden" 
                        :allInputs="nodeConfig"
                        @input-value="handleInputValue"
                    />
                </VuePerfectScrollbar>

            </div>

        </div>
        <v-dialog
            v-model="dialogSaveOrUpdate"
            persistent
            max-width="500px"
        >
            <v-card>
                <v-card-title>
                    <span class="headline">Workflow</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <div>
                            <form-tpl
                            :allInputs="dataWorkflowProps"/>
                        </div>
                        <small style="color:red">*{{$t("taskManagement.requiredField")}}</small>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                        <v-btn
                            color="blue darken-1"
                            text
                            v-if="!statusDetail"
                            :loading="isLoading"
                            @click="addWorkflow"
                        >
                            {{$t("common.add")}}
                        </v-btn>
                        <v-btn
                            color="blue darken-1"
                            text
                            v-else
                            :loading="isLoading"
                            @click="updateWorkflow"
                        >
                            {{$t("common.update")}}
                        </v-btn>
                        <v-btn
                            color="red darken-1"
                            text
                            @click="dialogSaveOrUpdate = false"
                        >
                            {{$t("common.close")}}
                        </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import FormTpl from '@/components/common/FormTpl.vue';
import AddStatusView from '@/components/taskManagement/workflow/AddStatusView.vue';
import AddLinkView from './AddLinkView.vue';
import {getStatusDefault} from '../config.js';
import { taskManagementApi } from "@/api/taskManagement.js";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

import {
    util
} from "@/plugins/util.js";
require('@/components/common/rappid/jointjs');

export default {
    components:{
        FormTpl,
        AddStatusView,
        AddLinkView,
        VuePerfectScrollbar
    },
    props:{
        statusDetail:{
            type: Boolean,
            default: false
        },
        listNode:{
           type: Array,
            default() {
                return [];
            }
        },
        allStatus:{
           type: Array,
            default() {
                return [];
            }
        },
        listLink:{
           type: Array,
            default() {
                return [];
            }
        },
        infoWorkflow:{
           type: Object,
            default() {
                return {};
            }
        },
    },
    watch:{
        infoWorkflow:function(vl){
            if (vl.data) {
                this.getDataDetailWorkflow(vl);
            }
        },
    },
    data(){
        return {
            selected:null,
            delayTimer:null,
            paper:null,
            isLoading:false,
            dialogSaveOrUpdate:false,
            showPopUpAddStatus:false,
            graph:null,
            nodeConfig:{},
            linkDefaultInfo:{
                id : { 
                    title: "Bắt đầu từ trạng thái",
                    type: "select",
                    value:"",
                    hidden:true
                },
                from : { 
                    title: "Bắt đầu từ trạng thái",
                    type: "select",
                    value:"",
                    validateStatus:{
                        isValid:true,
                        message:"Error"
                    },
                    validate(){
                    
                    }
                },
                to : { 
                    title: "Kết thúc đến trạng thái",
                    type: "select",
                    value:"",
                    validateStatus:{
                        isValid:true,
                        message:"Error"
                    },
                    validate(){
                    
                    }
                },
                name : { 
                    title: "Tên",
                    type: "text",
                    value:"",
                    validateStatus:{
                        isValid:true,
                        message:"Error"
                    },
                    validate(){
                    
                    }
                },
                desscription : { 
                    title: "Mô tả",
                    type: "text",
                    value:"all",
                    validateStatus:{
                        isValid:true,
                        message:"Error"
                    },
                    validate(){
                    
                    }
                },
            },
            dataWorkflowProps:{
                name : { 
                    title: "Name",
                    type: "text",
                    value: '',
                    validateStatus:{
                        isValid:true,
                        message:"Error"
                    },
                    validate(){
                        if (this.value=="") {
                            this.validateStatus.isValid=false;
                            this.validateStatus.message="Không bỏ trống";
                        }else{
                            this.validateStatus.isValid=true;
                            this.validateStatus.message="";
                        }
                    }
                },
                description : {
                    title: "Mô tả",
                    type: "text",
                    value: '',
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    validate(){
                    }
                },
            },
            dataWorkflow:{
                links:[],
                nodes:[]
            }

        }
    },
 
    created(){
        if (Object.keys(this.infoWorkflow).length > 0) {
            this.getDataDetailWorkflow(this.infoWorkflow);
        }
    },
    methods:{
        deleteElementOrLink(){
            if (this.selected) {
                // remove in dataWorkflow , in list node
                if (this.selected.attributes.type == "standard.Link") {
                    let obj = this.dataWorkflow.links.find(data => data.id == this.selected.id)
                    var index = this.dataWorkflow.links.indexOf(obj);
                    if (index > -1) {
                        this.dataWorkflow.links.splice(index, 1);
                    }

                    let obj2 = this.listLink.find(data => data.id.value == this.selected.id)
                    var index2 = this.listLink.indexOf(obj2);
                    if (index2 > -1) {
                        this.listLink.splice(index2, 1);
                    }

                }else{
                    let obj = this.dataWorkflow.nodes.find(data => data.id == this.selected.id)
                    var index = this.dataWorkflow.nodes.indexOf(obj);
                    if (index > -1) {
                        this.dataWorkflow.nodes.splice(index, 1);
                    }

                    let obj2 = this.listNode.find(data => data.id.value == this.selected.id)
                    var index2 = this.listNode.indexOf(obj2);
                    if (index2 > -1) {
                        this.listNode.splice(index2, 1);
                    }

                }
                
                this.selected.remove(); 
            }
        },
        handleInputValue(name, inputInfo, data) {
            if(this.delayTimer){
                clearTimeout(this.delayTimer);
            }
            this.delayTimer = setTimeout((self) => {
                if (self.nodeConfig.from || self.nodeConfig.to) {
                    var links = self.paper.model.getLinks();
                    let linkId = self.nodeConfig.id.value;
                    let link = links.find(ele => ele.id == linkId);
                    if (link) {
                        var currentLink = link;
                        if (name == 'name') {
                            currentLink.label(0, {
                                attrs: {
                                    text: {
                                        text: data
                                    }
                                }
                            })
                        }else if(name == 'from'){
                            currentLink.source({ id: data });
                        }else if(name == 'to'){
                            currentLink.target({ id: data });
                        }
                    }
                    
                }else{
                    var elements = self.paper.model.getElements();
                    let nodeId = self.nodeConfig.id.value;
                    let node = elements.find(ele => ele.id == nodeId);
                    if (node) {
                        var currentElement = node;
                        if (name == 'name') {
                            currentElement.attr('label/text', data.name);
                        }else if (name == 'colorStatus') {
                            currentElement.attr('body/fill', data);
                        }
                    }
                }
            }, 500,this);
        },
        updateWorkflow(){
            let projectId=this.$route.params.id;
            this.isLoading = true;
            let isValid = this.validateData();
            if (isValid) {
                let data={};
                let id = this.$route.params.workflowId;
                data.name=this.dataWorkflowProps.name.value;
                data.description=this.dataWorkflowProps.description.value;
                data.nodes = JSON.stringify(this.listNode);
                data.links = JSON.stringify(this.listLink);
                data.data  = JSON.stringify(this.dataWorkflow);
                taskManagementApi
                    .updateWorkflow(id,data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$snotifySuccess("Update workflow success!");
                            data.id=id;
                            this.$store.commit("taskManagement/updateWorkflowToStore",data);
                            this.dialogSaveOrUpdate=false;
                            this.$store.dispatch("taskManagement/getListOperatorInProject",projectId);
                        }else{
                            this.$snotifyError("", "Can not update workflow!");
                        }
                        this.isLoading=false;
                    })
                    .catch(err => {
                        this.$snotifyError("", "Can not update workflow!", err);
                        this.isLoading=false;
                    });
            }else{
                this.$snotifyError("", "Have error!");
                this.isLoading=false;
            }
        },
        renderNode(nodeInfo){
            var node = new joint.shapes.standard.Rectangle(nodeInfo);   
            this.dataWorkflow.nodes.push(node);
            node.addTo(this.graph);          
        },
        renderLink(linkInfo){
            var link = new joint.shapes.standard.Link(linkInfo);   
            this.dataWorkflow.links.push(link);
            link.addTo(this.graph);          
        },
        getDataDetailWorkflow(infoWorkflow){
            this.dataWorkflowProps.name.value = infoWorkflow.name;
            this.dataWorkflowProps.description.value = infoWorkflow.description;
         
            if (this.statusDetail && infoWorkflow.data) {
                let data = JSON.parse(infoWorkflow.data);
                if (data.nodes && data.nodes.length > 0) {
                    for (let i = 0; i < data.nodes.length; i++) {
                        this.renderNode(data.nodes[i]);
                    }
                }
                if (data.links && data.links.length > 0) {
                    for (let i = 0; i < data.links.length; i++) {
                        this.renderLink(data.links[i]);
                    }
                }
            }
        },
        validateData(){
            let data=this.dataWorkflowProps;
            for (var key in data) {
                data[key].validate();
                if (data[key].validateStatus.isValid==false) {
                    return false
                }
            }
            return true;
        },
        addWorkflow(){
            this.isLoading= true;
            let self=this;
            let isValid = this.validateData();
            if (isValid) {
                if (!self.dataWorkflowProps.name.value  ) {
                    self.$snotifyError("", "Can not add workflow!");
                    this.isLoading = false;

                }else{
                    let data = {};
                    let projectId=this.$route.params.id;
                    data.name = self.dataWorkflowProps.name.value;
                    data.description =  self.dataWorkflowProps.description.value;
                    data.projectId = projectId;
                    data.nodes = JSON.stringify(self.listNode);
                    data.links = JSON.stringify(self.listLink);
                    data.data  = JSON.stringify(self.dataWorkflow);
                    taskManagementApi
                        .addWorkflow(data)
                        .then(res => {
                            if (res.status == 200) {
                                self.$snotifySuccess("Add workflow completed!");
                                self.$store.commit("taskManagement/addWorkflowToStore",res.data);
                                self.dialogSaveOrUpdate=false;
                                self.$store.dispatch("taskManagement/getListOperatorInProject",projectId);
                                self.$router.push('/task-management/projects/'+projectId+'/workflow/'+res.data.id);
                            }else if(res.status==400){
                                self.$snotifyError("", "Validate key error",res.message);
                            }
                            this.isLoading = false;
                        })
                        .catch(err => {
                            self.$snotifyError("", "Can not add workflow!", err);
                            this.isLoading = false;
                        });
                }
            }else{
                this.isLoading = false;
            }

        },
        showPopupAddStatusView(){
            this.$refs.popupAddStatusView.show()
        },
        showPopupAddLinkView(){
            this.$refs.popupAddLinkView.show()
        },
        getTextWidth(text){
            let ele = $('<span style="position:absolute;opacity:0">'+text+'</span>').appendTo($('.wrap-workflow-config'));
            let eleWidth = ele.width();
            ele.remove();
            return eleWidth;
        },
        afterAddStatusClick(status){
            let newStatus = util.cloneDeep(status);
            let nodeWidth = this.getTextWidth(newStatus.name.value.name) + 20;
            var rectReview = new joint.shapes.standard.Rectangle();
            rectReview.position(500, 230);
            rectReview.resize(nodeWidth, 40);
            rectReview.attr({
                body: {
                    fill: newStatus.colorStatus.value,
                    strokeWidth: 0,
                    rx: 5,
                    ry: 5,
                },
                label:{
                    text:newStatus.name.value.name,
                    fill:'white',
                    fontWeight:500
                }
            
            });
            this.dataWorkflow.nodes.push(rectReview);

            rectReview.addTo(this.graph);
            this.$set(newStatus.id,"value",rectReview.id);
            this.nodeConfig = newStatus;
            this.listNode.push(newStatus);

        },
        afterAddLinkClick(linkInfo){
            let source = {};
            if (!linkInfo.from.value) {
                let idNodeTarget = linkInfo.to.value;
                let node = this.dataWorkflow.nodes.find(ele => ele.id == idNodeTarget);
                if (node) {
                    source.x = node.attributes.position.x + node.attributes.size.width/2;
                    source.y = node.attributes.position.y - 40;
                }else{
                    source.x = 200;
                    source.y = 50;
                }

            }else{
                source.id = linkInfo.from.value;
            }
            let link1 = new joint.shapes.standard.Link({
                source: source,
                target: { id: linkInfo.to.value },
                attrs: {
                    line: {
                        connection: true,
                        stroke: '#333333',
                        strokeWidth: 1,
                        strokeLinejoin: 'round',
                        targetMarker: {
                            'type': 'path',
                            'd': 'M 10 -5 0 0 10 5 z'
                        }
                    }
                },
            });
            link1.appendLabel({
                attrs: {
                    text: {
                        text: linkInfo.name.value
                    }
                }
            });
            this.$set(linkInfo.id,"value",link1.id);
            this.listLink.push(linkInfo);
            this.dataWorkflow.links.push(link1);
            link1.addTo(this.graph);
        },
    },
 
    mounted() {
        let self=this;
        this.graph = new joint.dia.Graph;
        this.paper = new joint.dia.Paper({
            el: $('#task-workflow'),
            width: '100%',
            height: '100%',
            model: this.graph,
            gridSize: 1,
            drawGrid: true,
            background: {
                color: '#fff'
            }
        });
     
        
       // self.paper.on('blank:pointerdown', paperScroller.startPanning);

        self.paper.on('blank:pointerclick', function() {
           // resetAll(this);

            // info.attr('body/visibility', 'hidden');
            // info.attr('label/visibility', 'hidden');

            // this.drawBackground({
            //     color: 'orange'
            // })
        });
        function resetAll(paper) {
            paper.drawBackground({
                color: 'white'
            })

            var elements = paper.model.getElements();
            for (var i = 0, ii = elements.length; i < ii; i++) {
                var currentElement = elements[i];
                currentElement.attr('body/stroke', 'black');
                currentElement.attr('body/strokeWidth',0);     
            }

            var links = paper.model.getLinks();
            for (var j = 0, jj = links.length; j < jj; j++) {
                var currentLink = links[j];
                currentLink.attr('line/stroke', 'black');
                currentLink.label(0, {
                    attrs: {
                        body: {
                            stroke: 'black'
                        }
                    }
                })
            }
        }

        self.paper.on('element:pointerclick', function(elementView) {
            self.selected = elementView.model;
            let idNode=elementView.model.id;
            if (elementView.model.attributes.attrs.isDefault) {
                self.$set(self,'nodeConfig',{});
                return;
            }
            let node=self.listNode.find(ele => ele.id.value == idNode);
            if (node) {
                if (node.colorStatus.value == "") {
                    self.$set(node.colorStatus,"value","#dfe1e6");
                }
                self.nodeConfig=node;
            }
            resetAll(this);
            var currentElement = elementView.model;
            currentElement.attr('body/stroke', '#f58634');     
            currentElement.attr('body/strokeWidth',1);     
        });

        self.paper.on('link:pointerclick', function(linkView) {
            self.selected = linkView.model;
            let idLink=linkView.model.id;
            if (linkView.model.attributes.isDefault) {
                self.$set(self,'nodeConfig',{});
                return;
            }
            let link=self.listLink.find(ele => ele.id.value == idLink);
            if (link) {
                let allOption = [];
                self.nodeConfig=link;
                for (let index = 0; index < self.listNode.length; index++) {
                    let node = self.listNode[index];
                    allOption.push({text:node.name.value.name,value:node.id.value})
                }
                self.$set(self.nodeConfig.from,'options',allOption);
                self.$set(self.nodeConfig.to,'options',allOption);
            }

            resetAll(this);
            var currentLink = linkView.model;
            currentLink.attr('line/stroke', '#f58634')
            currentLink.label(0, {
                attrs: {
                    body: {
                        stroke: '#f58634'
                    }
                }
            })
        });

        if (!this.statusDetail) {
            var rectStart = new joint.shapes.standard.Rectangle();
            rectStart.position(100, 130);
            rectStart.resize(40, 40);
            rectStart.attr({
                body: {
                    fill: '#dfe1e6',
                    rx: 20,
                    ry: 20,
                    strokeWidth: 0
                },
                isDefault:true
            
            });
            this.dataWorkflow.nodes.push(rectStart);

            rectStart.addTo(this.graph);
            var rectBacklog = new joint.shapes.standard.Rectangle();
            rectBacklog.position(250, 130);
            rectBacklog.resize(100, 40);
            rectBacklog.attr({
                body: {
                    fill: '#dfe1e6',
                    strokeWidth: 0,
                    rx: 5,
                    ry: 5,
                },
                label:{
                    text:'To Do',
                    fontWeight:500,
                    fill:'black'
                }
            
            });
            this.dataWorkflow.nodes.push(rectBacklog);
            rectBacklog.addTo(this.graph);

            let nodeDefaultInfo = getStatusDefault(); // cấu hình mặc định node
            let listStatus = self.allStatus;
            if (listStatus.length == 0) {
                listStatus = self.$store.state.taskManagement.allStatus;
            }
            let todoNode = self.allStatus.find(ele => ele.name === 'To Do');
            if (todoNode) {
                nodeDefaultInfo.name.value.name = "To Do";
                nodeDefaultInfo.name.value.id = todoNode.id;
                nodeDefaultInfo.common.value = 1;
                nodeDefaultInfo.colorStatus.value = todoNode.color;
                self.$set(nodeDefaultInfo.id,"value",rectBacklog.id);
                self.$set(nodeDefaultInfo.statusCategory,"value",todoNode.statusCategoryId);
                self.listNode.push(nodeDefaultInfo);
            }

            let link1 = new joint.shapes.standard.Link({
                source: { id: rectStart.id },
                target: { id: rectBacklog.id },
                attrs: {
                    line: {
                        connection: true,
                        stroke: '#333333',
                        strokeWidth: 1,
                        strokeLinejoin: 'round',
                        targetMarker: {
                            'type': 'path',
                            'd': 'M 10 -5 0 0 10 5 z'
                        }
                    }
                },
                isDefault:true
            });
            link1.appendLabel({
                attrs: {
                    text: {
                        text: 'create'
                    }
                }
            });
            this.$set(this.linkDefaultInfo.from,"value",rectStart.id);
            this.$set(this.linkDefaultInfo.to,"value",rectBacklog.id);
            this.$set(this.linkDefaultInfo.id,"value",link1.id);
            this.listLink.push(this.linkDefaultInfo);
            this.dataWorkflow.links.push(link1);

            this.graph.addCells([rectBacklog, link1]);

        }
    
    }
}
</script>
<style scoped>
    .wrap-workflow-config{
        height: calc(100% - 50px);
    }
    .config__content--sidebar{
        width: 300px;
        border-left: var(--symper-border);
    }
    .wrap-workflow-config__content{
        display: flex;   
        border: var(--symper-border);
        height: calc(100% - 80px);
    }
    .wrap-workflow-config__header{
        display: flex;
        background: #fafafa;
        height: 50px;
        padding: 4px;
        position: relative;
    }
    .wrap-workflow-config__header button,.wrap-workflow-config__header >>> .v-label{
        font-weight: 400;
        font-size: 13px;
    }
    .checkbox-show-all-label{
        margin: 0;
        margin-top: 2px;
    }
    .card-add-status{
        position: absolute;
        display: flex;
        background: #fafafa;
        height: 160px;
        width: 300px;
        padding: 12px;
        left: 10px;
        top: 40px;
        background: white;
    }
</style>