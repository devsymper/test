<template>
    <div class="pl-3 pr-1" >
        <v-row style="margin-top:-5px">
            <v-col class="col-md-10">
                <i class="mdi mdi-eye-check-outline">
                    </i> Theo dõi<i class="ml-1 mdi mdi-information-outline" 
                    style="font-size:13px;margin-top:-15px"></i>
            </v-col>
            <v-col class="col-md-1" > 
                 <i @click="close()" 
                    class="ml-1 mdi mdi-close">
                    </i>
            </v-col>
        </v-row>
            <div style="margin-top:-10px" class="fs-13">
            Theo dõi thay đổi: {{name}}
        </div>
        <div class="color-grey fs-11 mt-1 mb-1">
            Sẽ nhận thông báo khi một trong các hành động sau được thực 
            <br/>
            hiện đối với bản ghi của đối tượng bạn theo dõi
        </div>
        <div class="mb-4">
            <v-row style="margin-top:-10px; margin-bottom:-49px" v-for="(item, key) in items" :key="key">
                <v-col class="col-md-10 fs-13">
                    {{rename(objType,item.actionName)}}
                </v-col>
                <v-col style="margin-top:-20px" class="col-md-2">
                    <v-checkbox color="success"
                        v-model="item.subscribed"
                    ></v-checkbox>
                </v-col>
            </v-row>
        </div>
         <v-divider style="width:97%" class="mt-3"></v-divider>
        <div>
            <div class="fs-13 color-grey mt-2">Nhóm đối tượng sẽ theo dõi</div>
            <v-row style="margin-top:-10px;margin-bottom:-25px" >
                <v-col class="col-md-10 fs-13">
                   Theo dõi bản ghi cá nhân
                </v-col>
                <v-col style="margin-top:-20px" class="col-md-2">
                    <v-checkbox color="success"
                        v-model="isPersonal"
                    ></v-checkbox>
                </v-col>
            </v-row>
            <v-row style="margin-top:-10px; margin-top: -50px;" >
                <v-col class="col-md-10 fs-13">
                   Theo dõi toàn bộ bản ghi
                </v-col>
                <v-col style="margin-top:-20px" class="col-md-2">
                    <v-checkbox color="success"
                        v-model="isAll"
                    ></v-checkbox>
                </v-col>
            </v-row>
        </div>
    </div>
</template>
<script>

import notification from "./../../api/settingNotification";
export default {
    props:['name','objType','objId'],
      data () {
        return {
            items:[],
            isPersonal:true,
            isAll:false,
            listSource:{},
            allChanel:[]
        }
    },
    created () {
    this.getSource();
      this.getAllListChanel(); 
     
     },
     watch:{
          isAll(){
              if(this.isAll){
                const self = this;
                let data={filter:'all'};
                notification.subscribeChanel(id,data).then(res=>{
                    if(res.status==200){}
                })

              }
          },
          isPersonal(){
              if(this.isPersonal){
                   const self = this;
                    let data={filter:'my_own'};
                    notification.subscribeChanel(id,data).then(res=>{
                        if(res.status==200){}
                    })
              }
          }
     },
  methods: {
      close(){
         for(let i = 0; i<this.items.length;i++){
             //nếu tích
             if(this.items[i].subscribed){
                 //nếu chưa tồn tại 
                 if(this.checkExistChanel(this.objType,this.items[i].actionName)){
                    this.updateChanel(this.objType,this.items[i].actionName)
                 }else{
                // nếu đã tồn tại 
                    this.addChanel(this.objType,this.items[i].actionName)
                 }
            // nếu bỏ tích
             }else{
                //this.unfollowChanel(newValue[i].id,newValue[i].actionName)
             }
         }
          this.$emit('close');
      },
      addChanel(nameModule,action){
          let generalChanel={};
          for(let i = 0; i<this.allChanel.length;i++){
              if(this.allChanel[i].event==action&&this.allChanel[i].objectType==nameModule){
                  generalChanel.event=action;
                  generalChanel.source= this.objType+':'+this.objId;
                  generalChanel.objectType=nameModule;
                  generalChanel.state=this.allChanel[i].state;
                  generalChanel.receiver=this.allChanel[i].defaultUser;
                  generalChanel.icon=this.allChanel[i].icon;
                  generalChanel.action=this.allChanel[i].action;
                  generalChanel.content=this.allChanel[i].content;
              }
            
          }
           const self = this;
            notification.addChanel(generalChanel).then(res=>{
                if(res.status==200){
                    self.$snotify({
                        type: "success",
                        title: "Thêm thông báo thành công",
                    });
                    self.refreshAll();
                    self.$emit("refreshList")
                }else{
                    self.$snotify({
                        type: "error",
                        title: "Thêm thông báo thất bại",
                    });
                }
            })
              //let test = generalChanel;
      },
      updateChanel(nameModule,action){
          let generalChanel={};
          for(let i = 0; i<this.allChanel.length;i++){
              if(this.allChanel[i].event==action&&this.allChanel[i].objectType==nameModule){
                  generalChanel.event=action;
                  generalChanel.source= this.objType+':'+this.objId;
                  generalChanel.objectType=nameModule;
                  generalChanel.state=this.allChanel[i].state;
                  generalChanel.receiver=this.allChanel[i].defaultUser;
                  generalChanel.icon=this.allChanel[i].icon;
                  generalChanel.action=this.allChanel[i].action;
                  generalChanel.content=this.allChanel[i].content;
              }
            
          }
           const self = this;
            notification.addChanel(this.objId, generalChanel).then(res=>{
                if(res.status==200){
                    self.$snotify({
                        type: "success",
                        title: "Thêm thông báo thành công",
                    });
                    
                }else{
                    self.$snotify({
                        type: "error",
                        title: "Thêm thông báo thất bại"});
                }
            })
              //let test = generalChanel;
      },
       getSource(){
        const self = this;
        notification.showAllModuleConfig().then(res=>{
            if(res.status==200){
                self.listSource = res.data;
            }})
        },
        rename(nameModule,event){
            let name = event;
            for(let i = 0; i<this.listSource[nameModule].event.length;i++){
                if(this.listSource[nameModule].event[i].value==event){
                name = this.listSource[nameModule].event[i].text;
                }
            }
            return name
        },
        checkExistChanel(nameModule, action){
            let check = false;
            let userId = 973;
            for(let i = 0; i<this.allChanel.length;i++){
                if(this.allChanel[i].event==action&&this.allChanel[i].objectType==nameModule&&this.allChanel[i].userCreate.split(':')[1]==userId){
                    check = true;
                    debugger
                }
            }
        },
      },
        getAllListChanel(){
            this.items=[];
            const self= this;
            let res = notification.showAllLists().then(res=>{
            if(res.status==200){
                let format = [];
                let listModules = res.data;
                this.allChanel=res.data;
                for(let i = 0; i<listModules.length;i++){
                    if(listModules[i].objectType==self.objType){
                        format.push(listModules[i])
                    }
                }
                let formatListModules = _.groupBy(format, 'objectType');
                let name = Object.keys(formatListModules);
                for(let i=0;i<formatListModules[self.objType].length;i++){
                    self.items.push({
                        actionName: formatListModules[self.objType][i].event,
                        id:formatListModules[self.objType][i].id,
                        subscribed:false})
                }
            }   
        });
        },

  
}
</script>