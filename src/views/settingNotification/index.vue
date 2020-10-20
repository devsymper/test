<template>
    <div class="w-100 mr-10">
        <v-row class="header ml-3">
            <v-col class="col-md-9 col-sm-9 ">
                <span class="fs-15 fw-430" v-if="showMain">Cài đặt thông báo</span>
                <span class="fs-15 fw-430" v-if="showFollow">Danh sách đối tượng đang theo dõi</span>
                <span class="fs-15 fw-430" v-if="showUnfollow">Danh sách đối tượng không theo dõi</span>
            </v-col >
            <v-col class="col-md-3 col-sm-3 d-flex justify-end">
                <v-btn @click="isShowUnFollow()" text class="fw-400 font-normal color-red">
                    Không theo dõi
                </v-btn>
                <v-btn @click="isShowFollow()" text class="fw-400 font-normal color-green">
                    Theo dõi
                </v-btn>
            </v-col >
        </v-row>
        <SettingNotification v-if="showMain" :type="type" :listItems="items" :listSubcribed="listSubcribed"/>
        <SettingNotification v-if="showFollow" :type="type" :listItems ="items1"/>
        <SettingNotification v-if="showUnfollow" :type="type" :listItems ="items"/>
    </div>
</template>
<script>
import _ from 'lodash';
import notification from "./../../api/settingNotification";
import SettingNotification from "./../../components/notification/setting/main.vue"
export default {
  watch: {
  },
    components:{
        SettingNotification,
    },
  created () {
      this.getSource();
      this.getAllListChanel()
  },
  data () {
    return {
        type:'main',
        listSubcribed:[],
        showMain:true,
        listModules:[],
        listSource:[],
        listNameModules:[],
        showUnfollow:false,
        showFollow:false,
        items: [],
        items1: [
            {
                icon: 'mdi-ticket',
                action: 'mdi-ticket',
                items: [
                    { title: 'List Item' }
                ],
                title: 'Bình luận test bỏ theo dõi',
            },
        ],
    }
  },
  methods: {
     async getAllListChanel(){
         
        const self= this;
        let res = await notification.showListsSubcribed();
           if(res.status==200){
            
            let format = [];
             let listModules = res.data;
             for(let i = 0; i<listModules.length;i++){
                 if(listModules[i].objectType){
                     format.push(listModules[i])

                 }
             }
             let formatListModules = _.groupBy(format, 'objectType');
             let name = Object.keys(formatListModules);
             
             for(let i=0;i<name.length;i++){
                 let a = name[i];
                  self.items.push({
                        title: name[i],
                        items: [],
                    })      
                 for(let j=0; j<formatListModules[name[i]].length;j++){
                      self.items[i].items.push({
                            title: formatListModules[name[i]][j].event,
                            id:formatListModules[name[i]][j].id,
                            // event: formatListModules[name[i]][j].event[j],
                            // source:name[i],
                            // receiver:formatListModules[name[i]][j].receiver[0].value,
                            // action:formatListModules[name[i]][j].action[0].value,
                            // name: 'default',
                            active:formatListModules[name[i]][j].subscribed

                        });
                 }
             }

           }
    },
    getSource(){
        const self = this;
        notification.showAllModuleConfig().then(res=>{
            if(res.status==200){
                debugger
                self.listSource = res.data;
            }
        })
    },
    rename(){

    },
    isShowUnFollow(){
        this.type="unfollow";
        this.showFollow=false;
        this.showUnfollow=true;
        this.showMain=false;
    },
    isShowFollow(){
        this.type="follow";
        this.showFollow=true;
        this.showUnfollow=false;
        this.showMain=false;
    }
  },
}
</script>