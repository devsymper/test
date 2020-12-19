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
            <form-tpl :allInputs="status"
                @input-value="handleInputValue"
            />
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
import { taskManagementApi } from "@/api/taskManagement.js";
import {getAllStatusCategory,getStatusDefault , getAllRoleForAutocomplete,getAllStatusForCombobox} from './../config'
export default {
    components:{
        'form-tpl' : FormTpl,
    },
    props:{
        allStatus:{
           type: Array,
            default() {
                return [];
            }
        },
    },
    watch:{
        allStatus:function(vl) {
            if (vl.length > 0) {
                this.status.name.options = getAllStatusForCombobox(vl);
            }
        }
    },

    computed:{
        allInput(){
            return
        }
    },
    mounted(){
        if (this.status == null) {
            this.status = getStatusDefault();
        }
        this.status.statusCategory.options = getAllStatusCategory();
        this.status.roleAcess.options = getAllRoleForAutocomplete();
       
    },
    data(){
        return{
            isShow:false,
            status:null,
            delayTimer:null,
        }
    },
    methods:{
        show(){
            this.isShow = true;
        },
        validateData(){
            let data=this.status;
            for (var key in data) {
                data[key].validate();
                if (data[key].validateStatus.isValid==false) {
                    return false
                }
            }
            return true;
        },
        beforeAddStatus(){
            let isValid = this.validateData();
            if (isValid) {
                this.isShow = false;
                this.$emit('after-add-status-click',this.status);
            }
   
        },
        handleInputValue(name, inputInfo, data) {
            if(this.delayTimer){
                clearTimeout(this.delayTimer);
            }
            this.delayTimer = setTimeout((self) => {
                if (name == "name") {
                    if (inputInfo.value && !inputInfo.value.id) {
                        taskManagementApi
                            .checkNameStatusExists(data.name)
                            .then(res => {
                                if (res.status == 403) {
                                   self.status.name.validateStatus.isValid = false;
                                   self.status.name.validateStatus.message = "Name status already exists";
                                }else{
                                    self.status.name.validateStatus.isValid = true;
                                    self.status.name.validateStatus.message = "";
                                    self.status.common.value = 0;
                                }
                            });
                    }else{
                        self.status.name.validateStatus.isValid = true;
                        self.status.name.validateStatus.message = "";
                        let allStatus = self.$store.state.taskManagement.allStatus;
                        let item = allStatus.find(ele => ele.id == inputInfo.value.id );
                        if (item) {
                            self.status.colorStatus.value = item.color;
                            self.status.statusCategory.value = item.statusCategoryId;
                            self.status.description.value = item.description;
                            self.status.common.value = 1;
                        }
                    }
                }
            }, 500,this);
        },
        
    },
    created(){
        this.status = getStatusDefault();
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