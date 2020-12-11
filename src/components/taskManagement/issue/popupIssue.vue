<template>
     <v-dialog
        v-model="isShow"
        max-width="500px"
        scrollable
    >
        <v-card>
        <v-card-title>
            <span class="fs-16">Create Issues</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <div>
                    <!-- <form-tpl
                    :allInputs="dataCategoryProps"/> -->
                </div>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                :loading="isLoading"
                class="btn-add"
            >
                {{$t("common.add")}}
            </v-btn>
            <v-btn
            color="red darken-1"
            text
            @click="isShow = false"
            >
                {{$t("common.close")}}
            </v-btn>
        
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import FormTpl from "@/components/common/FormTpl.vue";
import { taskManagementApi } from "@/api/taskManagement.js";

export default {
    name: "issue",
    components:{
        FormTpl,
    },
    data(){
        return{
            isLoading:false,
            isShow:false,
        }
    },
    methods:{
        show(){
            this.isShow=true;
        },
    }

}
</script>

<style>

</style>