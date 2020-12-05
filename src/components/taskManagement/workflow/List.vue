<template>
 <div class="w-100 h-100">
        <div style="height:100%">
            <v-card style="box-shadow:none">
                <v-card-title>
                    {{$t("taskManagement.listWorkflow")}}
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
                    <v-btn small class="px-1 ml-1" solo depressed @click="handleCreate" color="#1976d2">
                        <v-icon color="white" size="18">mdi-plus</v-icon>
                        <span style="color:white">Create workflow</span>
                    </v-btn>
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="listWorkflow"
                    :search="search"
                    hide-default-footer
                    class="table-list-category"
                >
                    <template v-slot:[`item.name`]="{ item }">
                        <span class="name-project pt-1 pl-2" style="color:#0000aa">
                            {{item.name}}
                        </span>
                    </template>
                    <template v-slot:[`item.user`]="{ item }">
                        <infoUser class="userInfo fs-13" :userId="item.userCreate" :roleInfo="{}" />
                    </template>

                    <template  v-slot:[`item.action`]="{ item }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on" @click.prevent.stop="handleDeleteWorkflow(item)" style="font-size:24px">mdi-delete-outline</v-icon>
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
                <v-btn color="red darken-1" text @click="removeCategory">Xóa</v-btn>
                <v-btn color="green darken-1" text @click="dialogRemove = false">Hủy</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
    </div>

</template>

<script>
import infoUser from "@/components/common/user/InfoUser";
import { taskManagementApi } from "@/api/taskManagement.js";
export default {
    name:"listWorkflow",
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
                { text: this.$t("taskManagement.table.description"), value: "description" },
                { text: this.$t("common.created_by"), value: "user" },
                { text: this.$t("taskManagement.table.createAt"), value: "createAt" },
                { text: "", value: "action" },
            ],

        }
    },
    props:{
        listWorkflow: {
            type: Array,
            default() {
                return [];
            }
        },
    },
    methods:{
        removeCategory(){
            // taskManagementApi
            //     .removeCategory(this.workflowSelected.id)
            //     .then(res => {
            //         if (res.status == 200) {
            //             this.$snotifySuccess("Remove category success!");
            //             this.$store.commit("taskManagement/removeCategoryToStore",this.workflowSelected.id);
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
            this.workflowSelected=item;
            this.dialogRemoveCate=true;
        },
        handleCreate(){
            this.$router.push('/task-management/workflow/create');
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

</style>