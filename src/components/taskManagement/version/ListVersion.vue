<template>
    <div class="w-100 h-100">
        <div style="height:100%">
             <v-card style="box-shadow:none">
                <v-card-title>
                    {{$t("taskManagement.listVersion")}}
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Tìm kiếm"
                        dense
                        solo
                        style="max-width:255px;"
                        single-line
                        hide-details
                        class="sym-small-size sym-style-input"
                    ></v-text-field>
                    <v-btn v-if="checkRole('task_manager_version','add')"  small class="px-1 ml-1" solo depressed @click="handleCreate" >
                        <span>Create version</span>
                    </v-btn>
                </v-card-title>
                <v-data-table
                    v-if="allVersion.length>0"
                    :headers="headers"
                    :items="allVersion"
                    :search="search"
                    hide-default-footer
                    class="table-list-version"
                    @click:row="handleClickRow"
                >
                    <template v-slot:[`item.name`]="{ item }">
                        <span class="name-title fs-13">{{item.name}}</span>
                    </template>
                    <template v-slot:[`item.status`]="{ item }">
                        <v-chip class="px-2" style="border-radius:4px" v-if="item.status == 0" color="#0760D9" text-color="white" x-small>{{$t('taskManagement.table.unreleased')}}</v-chip>
                        <v-chip class="px-2" style="border-radius:4px" v-else-if="item.status == 1" color="#408137" text-color="white" x-small>{{$t('taskManagement.table.released')}}</v-chip>
                    </template>
                    <template v-slot:[`item.user`]="{ item }">
                        <infoUser class="userInfo fs-13" :userId="item.userCreate" :roleInfo="{}" />
                    </template>
                    <template v-slot:[`item.progess`]="{}">
                        <div class="w-100 d-flex progress"  >
                            <div class="progress-item" v-for="(item, key) in dataProgess.item " :key="key" 
                                        :style="{
                                            width: (item.value/dataProgess.total)*100 +'%',
                                            background:item.color
                                        }">
                            </div>
                        </div>
                    </template>
                
                    <template  v-slot:[`item.action`]="{ item }">
                        <v-icon v-if="checkRole('task_manager_version','edit')"  class="mr-2" @click.prevent.stop="handelDetailVersion(item)" style="font-size:20px">mdi-file-document-edit-outline</v-icon>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-if="checkRole('task_manager_version','delete')"  v-on="on" @click.prevent.stop="handleDelete(item)" style="font-size:20px">mdi-delete-outline</v-icon>
                            </template>
                            <span>Delete</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-card>
        </div>
        <modalAddOrDetailVersion
            ref="modalAddOrDetailVersion"
            :dataVersionProps="dataVersionProps"
            :infoVersion="infoVersion"
            :statusDetail="statusDetail"
            @add-version="addVersion"
        />

        <v-dialog v-model="dialogRemoveVersion" max-width="350">
            <v-card>
            <v-card-title class="headline">{{$t("common.remove_confirm_title")}}</v-card-title>
            <v-card-text>{{$t("taskManagement.dialog.removeVersion")}}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" :loading="loading" text @click="removeVersion">Xóa</v-btn>
                <v-btn color="green darken-1" text @click="dialogRemoveVersion = false">Hủy</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { taskManagementApi } from "@/api/taskManagement.js";
import modalAddOrDetailVersion from "./ModalAddOrDetailVersion";
import { util } from "@/plugins/util";
import infoUser from "@/components/common/user/InfoUser";
import { checkPermission } from "@/views/taskManagement/common/taskManagerCommon";
import VersionWorker from 'worker-loader!@/worker/taskManagement/version/Version.Worker.js';

export default {
    name:"listVersion",
    components:{
        modalAddOrDetailVersion,
        infoUser
    },
    computed:{
        allVersion(){
            let listVersion=util.cloneDeep(this.listVersion);
            console.log("versions",listVersion);
            return listVersion; 
        },
    },
    props:{
        listVersion: {
            type: Array,
            default() {
                return [];
            }
        },
       
    },
    data(){
        return{
            versionWorker:null,
            loading:false,
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
            versionSelected:{},
            statusDetail:false,
            dialogRemoveVersion:false,
            search:'',
            title:"Version",
            infoVersion:{
                id:"",
                name: "",
                description: "",
                status: 0,
                startTime:"",
                endTime:"",
            },
            headers: [
                {
                text: this.$t("taskManagement.table.name"),
                align: "start",
                value: "name"
                },
                { text: this.$t("taskManagement.table.description"), value: "description" },
                { text: this.$t("common.status"), value: "status" },
                { text: "Progess", value: "progess" },
                { text: this.$t("taskManagement.table.startDate"), value: "startTime" },
                { text: this.$t("taskManagement.table.releaseDate"), value: "endTime" },
                { text: this.$t("common.created_by"), value: "user" },
                // { text: this.$t("taskManagement.table.createAt"), value: "createAt" },
                { text: "", value: "action" },
            ],
            dataVersionProps:{
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
        }
    },
    methods:{
        checkRole(objectType,action){
            return checkPermission(objectType,action);
        },
        handleClickRow(item){ 
            if (this.checkRole('task_manager_version','detail')) {
                if (item.id) {
                    let projectId=this.$route.params.id;
                    this.$store.commit("taskManagement/setInfoVersionCurrent", item);
                    this.$router.push('/task-management/projects/'+projectId+'/versions/'+item.id);
                }
            }
        },
        addVersion(){
            this.$emit("add-version");
        },
        handleDelete(item){
            this.versionSelected=item;
            this.dialogRemoveVersion=true;
        },
        removeVersion(){
            this.loading = true;
            this.versionWorker.postMessage({
                action:'removeVersion',
                data:this.versionSelected.id
            });
        },
     
        handleCreate(){
            this.dataVersionProps.name.value="";
            this.dataVersionProps.description.value="";
            // this.infoVersion.id='';
            // this.infoVersion.description="";
            // this.infoVersion.name="";
            this.infoVersion.startTime="";
            this.infoVersion.endTime="";
            this.statusDetail=false;

            this.$refs.modalAddOrDetailVersion.show();
        },
        handelDetailVersion(item){
            this.dataVersionProps.name.value=item.name;
            this.dataVersionProps.description.value=item.description;
            this.infoVersion.id=item.id;
            this.infoVersion.description=item.description;
            this.infoVersion.name=item.name;
            this.infoVersion.status=item.status;
            this.infoVersion.startTime=item.startTime;
            this.infoVersion.endTime=item.endTime;
            this.statusDetail=true;
            this.$refs.modalAddOrDetailVersion.show();

        },
     
    },
    created(){
        let self = this;
        this.versionWorker = new VersionWorker();
        this.versionWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'actionError':
                    self.dialogRemoveVersion=false;
                    self.loading=false;
                case 'removeVersion':
                    self.$snotifySuccess("Remove Version success!");
                    self.$emit("add-version");
                    self.dialogRemoveVersion = false;  
                    self.loading = false;
                    break;
                default:
                    break;
            }
        });
    }

}
</script>

<style scoped>
.name-title{
    color:#0000aa;
}
.name-title:hover{
    cursor: pointer;
    text-decoration: underline;
}
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
.table-list-version >>> td{
    font-size: 13px!important;
}
.sym-style-input >>> .v-input__slot{
    box-shadow: none !important;
}
</style>