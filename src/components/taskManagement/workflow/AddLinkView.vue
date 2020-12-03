<template>
     <v-dialog
      v-model="isShow"
      width="500"
      scrollable
      :content-class="'overflow-hidden'"
    >
      <v-card>
        <v-card-title class="p-2">
          <span>Thêm trạng thái của task</span>
        </v-card-title>
        <v-card-text class="p-2">
          <form-tpl :allInputs="linkInfo"/>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="p-1">
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1" 
            text
            @click="isShow = false"
          >
            {{$t('common.save')}}
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="isShow = false"
          >
            {{$t('common.close')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

</template>

<script>
import FormTpl from "@/components/common/FormTpl.vue";
import {getAllStatusCategory} from './config.js'
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
            isShow:false,
            linkInfo:{
                from : { 
                    title: "Bắt đầu từ trạng thái",
                    type: "select",
                    value:"",
                    validateStatus:{
                        isValid:true,
                        message:"Error"
                    },
                    validate(){
                    
                    }
                },
                to : { 
                    title: "Kết thúc đến trạng thái",
                    type: "select",
                    value:"",
                    validateStatus:{
                        isValid:true,
                        message:"Error"
                    },
                    validate(){
                    
                    }
                },
                name : { 
                    title: "Tên",
                    type: "text",
                    value:"",
                    validateStatus:{
                        isValid:true,
                        message:"Error"
                    },
                    validate(){
                    
                    }
                },
                desscription : { 
                    title: "Mô tả",
                    type: "text",
                    value:"",
                    validateStatus:{
                        isValid:true,
                        message:"Error"
                    },
                    validate(){
                    
                    }
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
            this.$emit('after-add-link-click',linkInfo);
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