<template>
    <div class="w-100 h-100 pl-1">
        <v-card style="box-shadow:none">
            <v-card-title>
                {{$t("taskManagement.listActionPack")}}
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
                <v-btn small class="px-1 ml-1" solo depressed @click="handleCreate">
                    <span>Create action pack</span>
                </v-btn>
            </v-card-title>
            <v-data-table
                :headers="headers"
                :items="listActionPack"
                :search="search"
                hide-default-footer
                class="table-list-category"
            >
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import { cloneObjectActionControls } from "./../role/RoleDefinition";

export default {

    data(){
        return{
            search:'',
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
            listActionPack:[],
       
          
        }
    },
    methods:{
        handleCreate(){

        },
    },
    created(){
        console.log(cloneObjectActionControls(),"agsdgs");
    }

}
</script>

<style>

</style>