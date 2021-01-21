<template>
    <div class="w-100 h-100" v-if="Object.keys(infoComponent).length >0 " >
        <div class="d-flex" style="height:40px">
            <h2 class="ml-4">Component: {{infoComponent.name}}</h2>
        </div>
        <div class="fs-13 ml-4" style="height:70px">
            <div class="grey--text">
                <v-icon class="fs-13">mdi-calendar</v-icon>
                <span class="mx-2">{{$t("taskManagement.table.createAt")}}:</span>
                <span>{{infoComponent.createAt}}</span>
            </div>
            <p>{{infoComponent.description}}</p>
        </div>
        <div style="height:calc(100% - 110px)">
            <common-table-list-issue
                :listIssueProps="listIssueInComponent"
            />
        </div>
    
    </div>
</template>

<script>
import { util } from "@/plugins/util";
import { taskManagementApi } from "@/api/taskManagement.js";
import CommonTableListIssue from '../version/CommonTableListIssue.vue';
import ComponentWorker from 'worker-loader!@/worker/taskManagement/component/Component.Worker.js';

export default {
    name:"detailcomponent",
    components:{
        CommonTableListIssue,
    },
    props:{
        infoComponent: {
            type: Object,
            default() {
                return {}
            }
        },
    },
    computed:{
        sTaskManagement() {
            return this.$store.state.taskManagement;
        },
        listDocumentIdsInProject(){
            return this.$store.state.taskManagement.listDocumentIdsInProject[this.projectId];
        }
    },
    watch:{
        listDocumentIdsInProject:{
            deep:true,
            immediate:true,
            handler(newVl){
                if (newVl){
                    this.getData();
                }
            }
        },
        listIssue:{
            deep:true,
            immediate:true,
            handler(newVl){
                if (newVl.length > 0){
                    this.getMoreInfoListIssue();
                }
            }
        },
    },
    data(){
        let self = this;
        return{
            listIssueInComponent:[],
            componentWorker:null,
            projectId: null,
            search:"",
            listIssue:[],
            filter:{
                ids: null,
                filter:[
                    {
                        column : "tmg_component_id",
                        operation : "and",
                        conditions : [
                            {
                                name : "in",
                                value : [self.$route.params.idComponent],
                            }
                        ],
                    },
                ],
                page : 1,
                pageSize: 50,
                distinct: true
            }
        }
    },
    methods:{
        getMoreInfoListIssue(){
            let data = {};
            data.issues = this.listIssue;
            data.allPriority = this.$store.state.taskManagement.allPriority;
            data.listIssueType = this.$store.state.taskManagement.listIssueTypeInProjects[this.projectId];
            data.allStatus = this.$store.state.taskManagement.allStatus;

            this.componentWorker.postMessage({
                action:'getMoreInfoListIssue',
                data:data
            });
        },
        getData(){
            let documentIds = this.$store.state.taskManagement.listDocumentIdsInProject[this.projectId];
            if (documentIds && documentIds.length > 0) {
                this.filter.ids =JSON.stringify(documentIds);
                
                this.componentWorker.postMessage({
                    action:'getIssueComponent',
                    data:this.filter
                });
            }
            
        },
        getListDocumentIdsInProject(){
            this.componentWorker.postMessage({
                action:'getListDocumentIdsInProject',
                data:this.projectId
            });
        },
        getListIssueTypeInProject(){
            this.componentWorker.postMessage({
                action:'getListIssueTypeInProject',
                data:this.projectId
            });
        },
        getAllStatus(){
            this.componentWorker.postMessage({
                action:'getAllStatus',
                data: null
            });
        }
    },
    created(){
        let self = this;
        this.projectId=this.$route.params.id;
        this.componentWorker = new ComponentWorker();
        this.componentWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'getListDocumentIdsInProject':
                    self.$store.commit('taskManagement/setListDocumentIdsInProject',data.dataAfter);
                    break;
                case 'getListIssueTypeInProject':
                    self.$store.commit('taskManagement/setListIssueTypeInProjects',data.dataAfter);
                    break;
                case 'getAllStatus':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setAllStatus',res.data.listObject);
                    } 
                    break;
                case 'getIssueComponent':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.listIssue = res.data.listObject;
                    } 
                    break;
                case 'getMoreInfoListIssue':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.listIssueInComponent = res;
                    } 
                    break;
                    
                default:
                    break;
            }
        });

        if (!this.$store.state.taskManagement.listDocumentIdsInProject[this.projectId] || this.$store.state.taskManagement.listDocumentIdsInProject[this.projectId].length == 0) {
            self.getListDocumentIdsInProject();
        }
        if (!this.$store.state.taskManagement.listIssueTypeInProjects[this.projectId] || this.$store.state.taskManagement.listIssueTypeInProjects[this.projectId].length == 0) {
            self.getListIssueTypeInProject();
        }
        if (!this.$store.state.taskManagement.allStatus || this.$store.state.taskManagement.allStatus.length == 0) {
            self.getAllStatus();
        }
      
    }

}
</script>

<style scoped>

</style>