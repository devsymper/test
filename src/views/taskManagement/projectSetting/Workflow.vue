<template>
    <div class="wrap-workflow-config">
        <h1>Workflow</h1>
        <div class="py-2">
            Cấu hình quy trình hoàn thành task
        </div>
        
        <div class="wrap-workflow-config__content">
            
            <div style="width: calc(100% - 200px);">
                <div class="wrap-workflow-config__header">
                    <v-btn class="add-status-btn" text @click="showPopUpAddStatus = !showPopUpAddStatus">
                        <v-icon left>
                            mdi-plus
                        </v-icon>
                        Thêm status
                    </v-btn>
                    <v-btn text>
                        <v-icon left>
                            mdi-plus
                        </v-icon>
                        Thêm link
                    </v-btn>
                     <v-checkbox class="checkbox-show-all-label"
                        :label="`Hiển thị nhãn link`"
                        dense   
                    ></v-checkbox>
                    <add-status-view @after-action-click="afterActionClick" class="card-add-status" v-show="showPopUpAddStatus"/>
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
    export default {
        components:{
            FormTpl,
            AddStatusView
        },
        created(){
            this.$evtBus.$on("symper-app-wrapper-clicked", evt => {
                if (this.showPopUpAddStatus &&
                    ($(evt.target).closest(".add-status-btn").length == 0 &&
                    $(evt.target).closest(".card-add-status").length == 0)
                ) {
                    this.showPopUpAddStatus = false; 
                }
               
            });
        },
        methods:{
            afterActionClick(type){
                this.showPopUpAddStatus = false;
                if(type == 'success'){

                }
                
            }
        },
        data(){
                FormTpl
            return {
                showPopUpAddStatus:false,
                nodeConfig:{
                    name : { 
                        title: "Name",
                        type: "text",
                        value: '',
                        validateStatus:{
                            isValid:true,
                            message:"Error"
                        },
                        validate(){
                            
                        }
                    },
                    description : {
                        title: "Mô tả",
                        type: "textarea",
                        value: '',
                        validateStatus:{
                            isValid:true,
                            message:""
                        },
                        validate(){
                        }
                    },
                    roleAcess : {
                        title: "Vai trò được truy cập",
                        type: "select",
                        value: '',
                        validateStatus:{
                            isValid:true,
                            message:""
                        },
                        validate(){
                        }
                    },
                    userAcess : {
                        title: "User được truy cập",
                        type: "select",
                        value: '',
                        validateStatus:{
                            isValid:true,
                            message:""
                        },
                        validate(){
                        }
                    },
                }
            }
        },
        mounted() {
            let graph = new joint.dia.Graph;

            let paper = new joint.dia.Paper({
                el: $('#task-workflow'),
                width: '100%',
                height: 'calc(100% - 50px)',
                model: graph,
                gridSize: 1,
                drawGrid: true,
                background: {
                    color: '#fff'
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
                rectStart.addTo(graph);


                
                // let linkStart = new joint.shapes.standard.Link({
                //     source: { id: rect.id },
                //     target: { id: rect2.id }
                // });

                // linkStart.addTo(graph);
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
                rectBacklog.addTo(graph);



                let rect = new joint.shapes.standard.Rectangle({
                    position: { x: 600, y: 130 },
                    size: { width: 100, height: 40 },
                    attrs: {
                        label: { text: 'In progress', fill: 'white',fontWeight:500 },
                        body:{
                            fill:'#0052cc',
                            strokeWidth: 0

                        }
                        
                    }
                });


                var rectReview = new joint.shapes.standard.Rectangle();
                rectReview.position(800, 130);
                rectReview.resize(100, 40);
                rectReview.attr({
                    body: {
                        fill: '#00875a',
                        strokeWidth: 0
                    },
                    label:{
                        text:'Done',
                        fill:'white',
                        fontWeight:500
                    }
                
                });
                rectReview.addTo(graph);


            let link = new joint.shapes.standard.Link({
                source: { id: rectBacklog.id },
                target: { id: rect.id },
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
                    },
                },
            });
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
            let link2 = new joint.shapes.standard.Link({
                source: { id: rect.id },
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
                    },
                },
                target: { id: rectReview.id }
            });
            


            graph.addCells([rect, link,link1, link2]);
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