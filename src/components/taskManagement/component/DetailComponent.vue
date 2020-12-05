<template>
    <div class="w-100 h-100" v-if="Object.keys(infoComponent).length >0 " >
        <div class="d-flex" style="height:40px">
            <h2 class="ml-4">Version {{infoComponent.name}}</h2>
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
            <v-card style="box-shadow:none">
                <v-card-title>
                    {{$t("taskManagement.listComponent")}}
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
                </v-card-title>
                <v-data-table
                    v-if="listIssueInComponent.length>0"
                    :headers="headers"
                    :items="listIssueInComponent"
                    :search="search"
                    hide-default-footer
                    class="table-list-component"
                >
                    <template v-slot:[`item.name`]="{ item }">
                        <span class="name-title">{{item.name}}</span>
                    </template>
                    <template v-slot:[`item.user`]="{ item }">
                        <infoUser class="userInfo fs-13" :userId="item.userCreate" :roleInfo="{}" />
                    </template>
                
                </v-data-table>
            </v-card>            

        </div>
    
    </div>
</template>

<script>
import { util } from "@/plugins/util";
import infoUser from "@/components/common/user/InfoUser";
import { taskManagementApi } from "@/api/taskManagement.js";

export default {
    name:"detailcomponent",
    components:{
        infoUser
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
        listIssueInComponent(){
            return []
        }
    },
    data(){
        return{
            search:"",
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
    }

}
</script>

<style scoped>

</style>