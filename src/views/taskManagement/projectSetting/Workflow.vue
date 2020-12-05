<template>
    <div class="wrap-workflow-config">
        <h1>Workflow</h1>
        <div class="py-2">
            Cấu hình quy trình hoàn thành task
        </div>
        
        <div class="wrap-workflow-config__content">
            
            <div style="width: calc(100% - 200px);">
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
                     <v-checkbox class="checkbox-show-all-label"
                        :label="`Hiển thị nhãn link`"
                        dense   
                    ></v-checkbox>
                    <add-status-view ref="popupAddStatusView" :listRole="listRole" @after-add-status-click="afterAddStatusClick"/>
                    <add-link-view :listNode="listNode" ref="popupAddLinkView" @after-add-link-click="afterAddLinkClick"/>
                </div>
                <div id="task-workflow"></div>
            </div>
            <div class="config__content--sidebar p-2">
                <form-tpl :allInputs="nodeConfig"/>
            </div>

        </div>
    </div>
</template>

<script>
import FormTpl from '@/components/common/FormTpl.vue';
import AddStatusView from '@/components/taskManagement/workflow/AddStatusView.vue';
import AddLinkView from '../../../components/taskManagement/workflow/AddLinkView.vue';
import {getStatusDefault} from '../../../components/taskManagement/config.js';
import { taskManagementApi } from "@/api/taskManagement.js";

import {
    util
} from "@/plugins/util.js";
require('@/components/common/rappid/jointjs');
export default {
    components:{
        FormTpl,
        AddStatusView,
        AddLinkView
    },
    async created(){
       await this.getListRole();
    },
    methods:{
        async getListRole(){
            let self = this;
            let allRole = await taskManagementApi.getListRole();
            if (allRole.status == 200 && allRole.data) {
                let listRole=allRole.data.listObject;
                listRole = listRole.reduce((arr, obj)=>{
                    let newObj = {text:obj.name,value:obj.id};
                    arr.push(newObj);
                    return arr
                },[]);

                this.listRole=listRole;
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
            let nodeWidth = this.getTextWidth(newStatus.name.value) + 20;
            var rectReview = new joint.shapes.standard.Rectangle();
            rectReview.position(500, 230);
            rectReview.resize(nodeWidth, 40);
            rectReview.attr({
                body: {
                    fill: newStatus.colorStatus.value,
                    strokeWidth: 0
                },
                label:{
                    text:newStatus.name.value,
                    fill:'white',
                    fontWeight:500
                }
            
            });
            rectReview.addTo(this.graph);
            this.$set(newStatus.id,"value",rectReview.id);
            this.nodeConfig = newStatus;
            this.listNode.push(newStatus);

        },
        afterAddLinkClick(linkInfo){
            this.listLink.push(linkInfo);
            let link1 = new joint.shapes.standard.Link({
                source: { id: linkInfo.from.value },
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
            link1.addTo(this.graph);
        }
    },
    data(){
        return {
            showPopUpAddStatus:false,
            graph:null,
            listNode:[],
            listLink:[],
            listRole:[],
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
        }
    },
    mounted() {
        let self=this;
        let nodeDefaultInfo = getStatusDefault();
        nodeDefaultInfo.name.value = "Back log";
        this.graph = new joint.dia.Graph;

        let paper = new joint.dia.Paper({
            el: $('#task-workflow'),
            width: '100%',
            height: 'calc(100% - 50px)',
            model: this.graph,
            gridSize: 1,
            drawGrid: true,
            background: {
                color: '#fff'
            }
        });
        paper.on('blank:pointerclick', function() {
           // resetAll(this);

            // info.attr('body/visibility', 'hidden');
            // info.attr('label/visibility', 'hidden');

            // this.drawBackground({
            //     color: 'orange'
            // })
        });

        paper.on('element:pointerclick', function(elementView) {
            let idNode=elementView.model.id;
            let node=self.listNode.find(ele => ele.id.value == idNode);
            if (node) {
                self.nodeConfig=node;
            }
            //resetAll(this);

            // var currentElement = elementView.model;
            // currentElement.attr('body/stroke', 'orange')
        });

        paper.on('link:pointerclick', function(linkView) {
            let idLink=linkView.model.id;
            let link=self.listLink.find(ele => ele.id.value == idLink);
            if (link) {
                self.nodeConfig=link;
            }
        });


        var rectStart = new joint.shapes.standard.Rectangle();
        rectStart.position(100, 130);
        rectStart.resize(40, 40);
        rectStart.attr({
            body: {
                fill: 'gray',
                rx: 20,
                ry: 20,
                strokeWidth: 0
            },
        
        });
        rectStart.addTo(this.graph);
        var rectBacklog = new joint.shapes.standard.Rectangle();
        rectBacklog.position(250, 130);
        rectBacklog.resize(100, 40);
        rectBacklog.attr({
            body: {
                fill: '#dfe1e6',
                strokeWidth: 0
            },
            label:{
                text:'Back log',
                fontWeight:500,
                fill:'black'
            }
        
        });
        rectBacklog.addTo(this.graph);
        this.$set(nodeDefaultInfo.id,"value",rectBacklog.id);
        this.listNode.push(nodeDefaultInfo);


    
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
        });
        link1.appendLabel({
            attrs: {
                text: {
                    text: 'all'
                }
            }
        });

        this.$set(this.linkDefaultInfo.from,"value",rectStart.id);
        this.$set(this.linkDefaultInfo.to,"value",rectBacklog.id);
        this.$set(this.linkDefaultInfo.id,"value",link1.id);
        this.listLink.push(this.linkDefaultInfo);

        this.graph.addCells([rectBacklog, link1]);

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