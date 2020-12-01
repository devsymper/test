<template>
    <v-card>
        <div class="w-100">
            <div class="w-100">
            <form-tpl
                    :allInputs="roleSelect"/>
            </div>
            <div class="d-flex actions">
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    class="btn-add"
                    @click="actionClick('access')"
                >
                    {{$t("common.add")}}
                </v-btn>
                <v-btn
                color="red darken-1"
                text
                @click="actionClick('cancel')"
                >
                    {{$t("common.close")}}
                </v-btn>
            </div>
        </div>
    </v-card>

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
        actionClick(type){
            this.$emit('after-action-click',type);
        }
        
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
.actions button{
    font-size: 13px;
}
</style>