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
          <form-tpl :allInputs="status"/>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="p-1">
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1" 
            text
            @click="beforeAddStatus"
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
import {getAllStatusCategory,getStatusDefault , getAllRoleForAutocomplete} from './../config'
export default {
    components:{
        'form-tpl' : FormTpl,
    },
    props:{
     
    },

    computed:{
        allInput(){
            return
        }
    },
    mounted(){
        this.status = getStatusDefault();
        this.status.statusCategory.options = getAllStatusCategory();
        this.status.roleAcess.options = getAllRoleForAutocomplete();
    },
    data(){
        return{
            isShow:false,
            status:null,
        }
    },
    methods:{
        show(){
            this.isShow = true;
        },
        beforeAddStatus(){
            this.isShow = false;
            this.$emit('after-add-status-click',this.status);
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