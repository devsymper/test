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
            @click="actionClick"
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
import {getAllStatusCategory, getLinkDefault} from './../config.js'
export default {
    components:{
        'form-tpl' : FormTpl,
    },
    props:{
        listNode: {
            type: Array,
            default() {
                return [];
            }
        },
    },
    watch:{
        listNode(vl){
            let allOption = [];
            for (let index = 0; index < vl.length; index++) {
                let node = vl[index];
                allOption.push({text:node.name.value.name,value:node.id.value})
            }
            this.$set(this.linkInfo.from,'options',allOption);
            this.$set(this.linkInfo.to,'options',allOption);
        }
    },
    data(){
        return{
            isShow:false,
            linkInfo:getLinkDefault(),
            userSelect:[]
        }
    },
    methods:{
        show(){
            this.linkInfo = getLinkDefault();
            let allOption = [];
            for (let index = 0; index < this.listNode.length; index++) {
                let node = this.listNode[index];
                allOption.push({text:node.name.value.name,value:node.id.value})
            }
            this.$set(this.linkInfo.from,'options',allOption);
            this.$set(this.linkInfo.to,'options',allOption);
            this.isShow=true;

        },
        actionClick(type){
            this.$emit('after-add-link-click',this.linkInfo);
            this.isShow=false;
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