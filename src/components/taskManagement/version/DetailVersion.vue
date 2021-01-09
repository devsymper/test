<template>
    <div class="w-100 h-100" v-if="Object.keys(infoVersion).length >0 " >
        <div class="d-flex" style="height:40px">
            <h2 class="ml-4">Version {{infoVersion.name}}</h2>
            <span class="ml-2 pt-1">
                <v-chip class="px-2" style="border-radius:4px" v-if="infoVersion.status == 0" color="#0760D9" text-color="white" x-small>{{$t('taskManagement.table.unreleased')}}</v-chip>
                <v-chip class="px-2" style="border-radius:4px" v-else-if="infoVersion.status == 1" color="#408137" text-color="white" x-small>{{$t('taskManagement.table.released')}}</v-chip>
            </span>
        </div>
        <div class="fs-13 ml-4" style="height:70px">
            <div class="grey--text">
                <v-icon class="fs-13 mr-2">mdi-calendar</v-icon>
                <span>{{$t("taskManagement.table.startDate")}}:</span>
                <span class="mx-1">{{infoVersion.startTime}}</span>
                <span class="mr-1 ml-2">{{$t("taskManagement.table.releaseDate")}}:</span>
                <span>{{infoVersion.endTime}}</span>
                <span class="mr-1 ml-2">{{$t("taskManagement.table.createAt")}}:</span>
                <span>{{infoVersion.createAt}}</span>
            </div>
            <p>{{infoVersion.description}}</p>
        </div>
        <div class="mx-4 d-flex progress" >
            <div class="progress-item" v-for="(item, key) in dataProgess.item " :key="key" 
                :style="{
                    width: (item.value/dataProgess.total)*100 +'%',
                    background:item.color
                }"
            >
            </div>
        </div>
        <div class="w-100" style="height:calc(100% - 125px)">
            <v-tabs class="pl-4 mt-2 fs-13">
                <v-tab>
                    <span class="mr-1" style="font-size:40px">{{dataProgess.total}}</span>
                    <span>Issue in <br> version</span>
                </v-tab>
                <v-tab  :style="{
                            color:dataProgess.item.done.color
                        }">
                    <span class="mr-1" style="font-size:40px">{{dataProgess.item.done.value}}</span>
                    <span>Issue <br> done</span>
                </v-tab>
                <v-tab  :style="{
                            color:dataProgess.item.inprogress.color
                        }">
                    <span class="mr-1" style="font-size:40px">{{dataProgess.item.inprogress.value}}</span>
                    <span>Issue in <br> progress</span>
                </v-tab>
                <v-tab  :style="{
                            color:dataProgess.item.todo.color
                        }">
                    <span class="mr-1" style="font-size:40px">{{dataProgess.item.todo.value}}</span>
                    <span>Issue<br> to do</span>
                </v-tab>
                <!-- content -->
                <v-tab-item>
                    <common-table-list-issue 
                        :listIssueProps="listIssueInVersion"
                        :listType="listType"
                    />
                </v-tab-item>
                <v-tab-item>
                   <page-issue-done 
                   />
                </v-tab-item>
                <v-tab-item>
                    <page-issue-in-progress />
                </v-tab-item>
                <v-tab-item>
                    <page-issue-to-do />
                </v-tab-item>
            </v-tabs>
        </div>
    </div>
</template>

<script>
import { taskManagementApi } from "@/api/taskManagement.js";
import CommonTableListIssue from './CommonTableListIssue.vue';
import PageIssueDone from './PageIssueDone.vue';
import PageIssueInProgress from './PageIssueInProgress';
import PageIssueToDo from './PageIssueToDo.vue';
import VersionWorker from 'worker-loader!@/worker/taskManagement/version/Version.Worker.js';

export default {
  components: { CommonTableListIssue, PageIssueDone, PageIssueInProgress, PageIssueToDo },
    name:"detailversion",
    props:{
        infoVersion: {
            type: Object,
            default() {
                return {}
            }
        },
    },
    computed:{
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
            listIssueInVersion:[],
            versionWorker:null,
            listType: self.$t('taskManagement.listIssueVersion'),
            projectId: null,
            listIssue:[],
            dataProgess:{
                total:6,
                item:{
                    todo:{
                        value:2,
                        color:'grey'
                    },
                    inprogress:{
                        value:3,
                        color:'blue'
                    },
                    done:{
                        value:1,
                        color:'green'
                    }
                }
            },
            filter:{
                ids: null,
                filter:[
                    {
                        column : "tmg_version_id",
                        operation : "and",
                        conditions : [
                            {
                                name : "in",
                                value : [self.$route.params.idVersion],
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
      
            this.versionWorker.postMessage({
                action:'getMoreInfoListIssue',
                data:data
            });
        },
        getData(){
            let documentIds = this.$store.state.taskManagement.listDocumentIdsInProject[this.projectId];
            if (documentIds && documentIds.length > 0) {
                this.filter.ids =JSON.stringify(documentIds);

                this.versionWorker.postMessage({
                    action:'getIssueVersion',
                    data:this.filter
                });
            }
        
        },
        getListDocumentIdsInProject(){
            this.versionWorker.postMessage({
                action:'getListDocumentIdsInProject',
                data:this.projectId
            });
        },
        getListIssueTypeInProject(){
            this.versionWorker.postMessage({
                action:'getListIssueTypeInProject',
                data:this.projectId
            });
        },
        getAllStatus(){
            this.versionWorker.postMessage({
                action:'getAllStatus',
                data: null
            });
        }
    },
    created(){
        let self = this;
        this.projectId=this.$route.params.id;
        this.versionWorker = new VersionWorker();
        this.versionWorker.addEventListener("message", function (event) {
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
                case 'getIssueVersion':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.listIssue = res.data.listObject;
                    } 
                    break;
                case 'getMoreInfoListIssue':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.listIssueInVersion = res;
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
.progress{
    height: 12px;
}

.progress-item:first-child {
    border-top-left-radius:10px ;
    border-bottom-left-radius:10px ;
}

.progress-item:last-child {
    border-top-right-radius:10px ;
    border-bottom-right-radius:10px ;
}
.progress-item{
    margin: 0 1px;
}
</style>