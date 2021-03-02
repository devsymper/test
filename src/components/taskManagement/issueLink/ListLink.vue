<template>
 <div class="w-100 h-100">
        <div style="height:100%">
            <v-card style="box-shadow:none">
                <v-card-title>
                    Danh sách Issue Link
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Tìm kiếm"
                        dense
                        solo
                        style="max-width:200px;"
                        single-line
                        hide-details
                        class="sym-small-size sym-style-input d-inline-block"
                    ></v-text-field>
                    <v-btn v-if="checkRole('task_manager_issue_link','add')" small class="px-1 ml-1" solo depressed @click="handleCreate" >
                        <span >Tạo mới Issue Link</span>
                    </v-btn>
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="listIssueLink"
                    :search="search"
                    hide-default-footer
                    class="table-list-category"
                    @click:row="handleClickRow"
                >
                    <template v-slot:[`item.name`]="{ item }">
                        <span class="name-project pt-1 pl-2" style="color:#0000aa">
                            {{item.tmg_link_name}}
                        </span>
                    </template>
                    <template v-slot:[`item.user`]="{ item }">
                        <infoUser class="userInfo fs-13" :userId="item.document_object_user_created_id" :roleInfo="{}" />
                    </template>

                    <template  v-slot:[`item.action`]="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-if="checkRole('task_manager_issue_link','delete')" v-on="on" @click.prevent.stop="handleDeleteWorkflow(item)" style="font-size:20px">mdi-delete-outline</v-icon>
                            </template>
                            <span>Delete</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-card>
        </div>

        <v-dialog v-model="dialogRemove" max-width="350">
            <v-card>
            <v-card-title class="headline">{{$t("common.remove_confirm_title")}}</v-card-title>
            <v-card-text>{{$t("taskManagement.dialog.removeWorkflow")}}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="removeWorkflow">Xóa</v-btn>
                <v-btn color="green darken-1" text @click="dialogRemove = false">Hủy</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
    </div>

</template>

<script>
import infoUser from "@/components/common/user/InfoUser";
import { checkPermission } from "@/views/taskManagement/common/taskManagerCommon";

export default {
    name:"listIssueLink",
    components:{
        infoUser
    },
    data(){
        return{
            search:'',
            dialogRemove:false,
            workflowSelected:{},
            headers: [
                {
                text: this.$t("taskManagement.table.name"),
                align: "start",
                value: "name"
                },
                { text: this.$t("common.created_by"), value: "user" },
                { text: this.$t("taskManagement.table.createAt"), value: "document_object_create_time" },
                { text: "Tùy chọn", value: "action" },
            ],

        }
    },
    computed:{
        listIssueLink(){
            return this.$store.state.taskManagement.listIssueLink;
        }
    },
    props:{
  
    },
    methods:{
        checkRole(objectType,action){
            return checkPermission(objectType,action);
        },
        handleClickRow(item){ 
            // if (item.id) {
            //     let projectId=this.$route.params.id;
            //     this.$router.push('/task-management/projects/'+projectId+'/workflow/'+item.id);
            // }
        },
        removeWorkflow(){
            // taskManagementApi
            //     .removeWorkflow(this.workflowSelected.id)
            //     .then(res => {
            //         if (res.status == 200) {
            //             this.$snotifySuccess("Remove category success!");
            //             this.$store.commit("taskManagement/removeWorkflowToStore",this.workflowSelected.id);
            //         }else{
            //             this.$snotifyError("", "Error! Have error !!!");
            //         }
            //     })
            //     .catch(err => {
            //         this.$snotifyError("", "Error! Have error !!!", err);
            //     });
            // this.dialogRemove=false;  
        },
        handleDeleteWorkflow(item){
            // this.workflowSelected=item;
            // this.dialogRemove=true;
        },
        handleCreate(){
            
        }
    }

}
</script>

<style scoped>
.name-project:hover{
    cursor: pointer;
    text-decoration: underline;
}
.table-list-category >>> td{
    font-size: 13px!important;
}
.sym-style-input >>> .v-input__slot{
    box-shadow: none !important;
}

</style>