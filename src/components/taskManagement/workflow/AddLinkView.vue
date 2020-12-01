<template>
    <v-dialog
            v-if="isShow"
            v-model="isShow"
            persistent
            max-width="500px"
        >
        <v-card>
            <v-card-title>
                <span class="fs-16">Add people</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <form-tpl
                        :allInputs="roleSelect"/>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    :loading="isLoadingAdd"
                    class="btn-add"
                    @click="addPeopleToProject"
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

export default {
    components:{
        'form-tpl' : FormTpl,
    },
    props:{
        roles: {
            type: Array,
            default() {
                return [];
            }
        },
    },
    data(){
        return{
            isLoadingAdd:false,
            isShow:false,
            roleSelect:{
                roles : { 
                    title: "Role",
                    type: "text",
                    value:"",
                    validateStatus:{
                        isValid:true,
                        message:"Error"
                    },
                    validate(){
                    
                    }
                },
                allowAll : { 
                    title: "Cho phép tất cả thay đổi",
                    type: "checkbox",
                    value:false,
                },
            },
            userSelect:[]
        }
    },
    methods:{
        show(){
            this.isShow=true;
        },
        
    },
    created(){
       
    }

}
</script>

<style scoped>
.selectUser{
    border-radius: 3px!important;
}
.selectUser >>> label{
    font-size: 17px!important;
}
.selectUser >>> .v-input__slot{
    min-height: 30px!important;
}
</style>