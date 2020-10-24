<template>
    <div class="w-100 h-100 mt-4 ml-6">
        <div class="body" style='margin-top:-25px'>
             <v-list :expand="true" dense class=" notification" >
                <v-list-group
                    active-class="black--text"
                    link
                    dense
                    v-for="item in listItems"
                    :key="item.title"
                    v-model="item.active"
                    no-action
                    class="mr-3"
                    style="border-bottom:1px solid rgba(0,0,0,0.07)"
                >
                 <template v-slot:prependIcon>
                    <v-icon  v-if="type=='main'" class="ml-1 icon-group">
                        {{ $i('input.'+item.icon) }}
                    </v-icon>
                    <v-icon  v-else class="ml-1 icon-group">
                        {{ $i('input.'+item.icon) }}
                    </v-icon>
                </template>
                <template v-slot:activator>
                    <v-list-item-content class="mb-2"  style="margin-left:-17px">
                    <v-list-item-title v-if="type=='main'">{{$t('objects.'+item.title)}}</v-list-item-title>
                    <v-list-item-title v-else>{{item.title}}</v-list-item-title>
                    <v-list-item-subtitle v-if="type=='main'" class="fw-400 fs-11">{{$t('objects.'+item.title)}}</v-list-item-subtitle>
                    <v-list-item-subtitle v-else class="fw-400 fs-11">{{item.title}}</v-list-item-subtitle>
                    </v-list-item-content>
                </template>
                <div class="mb-3 ml-10">
                    <span class="fs-13 fw-430" style="color:black">Nhận thông báo khi có những hành động sau</span>
                </div>
                <v-list-item
                    style="margin-top:-20px; margin-bottom:-10px; "
                    v-for="child in item.items"
                    :key="child.title"
                >
                    <v-list-item-content class="ml-10" >
                    <v-list-item-title class="fs-13 font-normal" style="color:rgba(0,0,0,0.8)">{{child.title}} </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-switch style="font-size:13px"
                            v-model="child.active"
                            dense
                            color="success"
                        ></v-switch>
                     </v-list-item-action>
                </v-list-item>
                </v-list-group>
            </v-list>
        </div>   
    </div>
</template>
<script>
import notification from "./../../../api/settingNotification";

export default {
  created () {
     
  },
  watch: {
      listItems:{
        deep: true,
        immediate: true,
        handler(newValue){
            for(let i = 0; i<newValue.length;i++){
                for(let j = 0; j<newValue[i].items.length;j++){
                // check 1 lượt nếu chọn subcribed
                    if(newValue[i].items[j].active){
                        // nếu chưa tồn tại gọi api
                        this.subcribedChanel(newValue[i].title, newValue[i].items[j].title) 
                    // nếu không chọn subcribed
                    }else{
                        this.unsubcribedChanel(newValue[i].title, newValue[i].items[j].title) 
                        /// chuyển state false
                        //nếu đã có trong list
                    }
                }
            }
        }
    },
  },
  props: ['type','listItems','listSubcribed','allListChanel'],
    methods: {
        //subcribed all
        subcribedChanel(objectType,event){
            for(let i=0;i<this.allListChanel.length;i++){
                if(this.allListChanel[i].objectType==objectType&&this.allListChanel[i].event==event&&!this.allListChanel[i].subscribed){
                       notification.subscribeChanel(this.allListChanel[i].id).then(res=>{
                        if(res.status==200){}
                    })
                }
            }
        },
        unsubcribedChanel(objectType,event){
            let data={state:false};
            for(let i=0;i<this.allListChanel.length;i++){
                if(this.allListChanel[i].objectType==objectType&&this.allListChanel[i].event==event&&this.allListChanel[i].subscribed){
                       notification.subscribeChanel(this.allListChanel[i].id,data).then(res=>{
                        if(res.status==200){}
                    })
                }
            }
        }
     },
    data(){
        return{
            items:this.listItems,
            listModuleStates:[]
        }
    }
}
</script>
<style scoped>
    /* .v-list-group__header{
        margin-bottom:8px!important
    } */
    .notification ::v-deep .v-list-item{
        padding:0px!important
    }
</style>