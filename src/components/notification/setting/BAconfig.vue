<template>
  <div class="ml-4 config-notification choose-picture">
     <div v-if="type!='view'">
        <div class="mb-3">
            <h4>Cài đặt thông báo</h4>
        </div>
        <v-row class="pt-0" style="margin-top:-10px">
            <v-col class="fs-13 col-md-5" style="margin-top:5px">Hình đại diện</v-col>
            <v-col class="col-md-7">  
                 <v-select
                    outlined
                     class="sym-small-size"
                    :items="typeSelected"
                    v-model="typePictureSelected"
                    dense
                >
                </v-select>
            </v-col>
          </v-row>
          <v-row class="pt-0 " 
                v-if="typeSelected[0]==typePictureSelected " 
                style="margin-bottom:-20px; margin-top:-10px">
            <v-col class="fs-13 col-md-5" style="margin-top:-5px">Ảnh</v-col>
            <v-col class="col-md-7" style="margin-top:-10px">
                <v-avatar :size="60">
                    <img v-if="avatarUrl== ''"
                      :src="require('./../../../assets/image/avatar_default.jpg')">
                    <img v-else :src="avatarUrl">
                </v-avatar>
                <!-- <v-icon v-else class="display-3 pt-0">{{iconName.iconName}}</v-icon> -->
               <UploadFile 
                    ref="uploadAvatar"
                    :fileName="avatarFileName"
                    :autoUpload="false"
                    @click="handleAvatarSelected"
                    :iconName="'mdi mdi-plus-circle'"
                    @selected-file="handleAvatarSelected"
                        />
            </v-col>
        </v-row>
         <v-row class="pt-0" style="margin-bottom:-15px" v-if="typeSelected[1]==typePictureSelected">
            <v-col class="fs-13 col-md-5 " style="margin-top:-10px">Icon</v-col>
            <v-col class="col-md-6 ml-2" style="margin-top:-10px">  
                 <v-icon class="display-3 pt-0">{{iconName.iconName}}</v-icon>
             <iconPicker style="margin-left:-10px" ref="iconPicker" :icon="'mdi mdi-plus-box'" @selected="pickIcon"></iconPicker>
            </v-col >
              
        </v-row>
        <v-row class="pt-0" style="margin-bottom:-10px">
            <v-col class="fs-13 col-md-5" style="margin-top:5px">Module phát sinh</v-col>
            <v-col class="col-md-7">  
                <v-autocomplete
                    outlined
                    hide-details 
                    return-object
                    item-value="value"
                    item-text="name"
                     class="sym-small-size"
                    :items="listModuleObj"
                    v-model="objectType"
                    dense
                    label="Chọn"
                >
                
                </v-autocomplete>
            </v-col>
        </v-row>
         <v-row class="pt-0" style="margin-bottom:-10px">
            <v-col class="fs-13 col-md-5" style="margin-top:5px">Hành động sinh ra notification</v-col>
            <v-col class="col-md-7">  
                 <v-autocomplete
                    outlined
                    class="sym-small-size"
                    return-object
                    item-value="value"
                    item-text="text"
                    :items="listAction"
                    v-model="action"
                    dense
                    label="Chọn"
                >
                </v-autocomplete>
            </v-col>
        </v-row>
          <v-row class="pt-0" style="margin-bottom:-10px" >
            <v-col class="fs-13 col-md-5" style="margin-top:5px">Đối tượng nhận notification</v-col>
            <v-col class="col-md-7">  
                <v-autocomplete
                    class="sym-small-size"
                    dense
                    outlined
                    return-object
                    v-model="receiver"
                    :items="listReceiver"
                    item-value="value"
                    item-text="text"
                    label="Chọn"
                >
                </v-autocomplete>
            </v-col>
        </v-row>
          <v-row class="pt-0" style="margin-bottom:-10px">
            <v-col class="fs-13 col-md-5" style="margin-top:5px">Hành động khi click notification</v-col>
            <v-col class="col-md-7">  
                <v-autocomplete
                     class="sym-small-size" 
                    outlined
                    dense
                    item-value="value"
                    item-text="text"
                    v-model="actionClickNotifi"
                    :items="listActionClickNotifi"
                    label="Chọn"
                >
                </v-autocomplete>
            </v-col>
        </v-row>   
          <v-row class="pt-0" >
            <v-col class="fs-13 col-md-5">
                Nội dung notification
            </v-col>
            <v-col class="fs-13 col-md-2 ml-15">  
                Tham số
            </v-col>
        </v-row>
          <v-row class="col-12"  >
              <div class="col-md-8" style="margin-left:-15px"> 
                <FormulaEditor 
                  :listKeyworks="listVariable"
                  v-model="description"
                  :height="'150px'"
                  :simpleMode="false"
                  @change="''"
                  @input="''"
              ></FormulaEditor>
            </div>
           <!-- <draggable
              :list="list2"
              group="des"
              @change="log"
              style="height: 180px!important"
              handle=".handle"
            >
            <v-textarea
                :rows="5" type="text"
                style="width:250px;font-size:13px" v-model="description"
              />
            </draggable>
             -->
          <div class="col-md-4" > 
              <div 
                class="mt-1 ml-2" 
                style="height: 143px; margin-left:-30px; margin-right:-49px; ">
                <draggable
                style="height: 180px!important; border:1px solid white"
                  :list="parameter"
                  :group="{ name: 'des', pull: 'clone', put: false }"
                  :clone="cloneValue"
                  @change="log"
                >
                  <v-chip class="list-group-item mr-1"   
                    style="background-color:#e0e0e0; font-size: 11px; border-radius: 4px; height: 20px;"
                    v-for="element in parameter" :key="element.value">
                      {{ element.text }}
                  </v-chip>
              </draggable>
            </div>
          </div>
        </v-row>
        <div class="col-12">
          <v-row class="pt-0" style="margin-bottom:-25px">
              <v-col class="fs-13 col-md-5 " style="margin-top:5px">Trạng thái</v-col>
              <v-col class="col-md-6">  
                <v-checkbox
                  v-model="state" 
                  style="margin-top:0px">
                </v-checkbox>
              </v-col>
          </v-row>
          <v-row class="mt-5 d-flex justify-end" style="margin-top:-20px!important">
              <v-btn text color="green" @click="save()">{{type=="add"?'Lưu':"Cập nhật"}}</v-btn>
          </v-row>
        </div>
    </div>
    <div v-else>
        <ViewBaConfig :detail="detailNotification"></ViewBaConfig>
      </div>
  </div>
</template>
<script>

import FormulaEditor from "../../formula/editor/FormulaEditor";
import ViewBaConfig from "./../../../components/notification/setting/viewBaConfig"
import draggable from 'vuedraggable';
import iconPicker from "../../../components/common/pickIcon";
import { util } from '../../../plugins/util';
import UploadFile from "./../../../components/common/UploadFile";
import {userApi} from "./../../../api/user";
import { appConfigs } from '../../../configs';
import notification from "./../../../api/settingNotification";
export default {
  props: ['type'],
   watch: {
      objectType(){
         this.refreshSelected();
         if(this.objectType.value){
           this.getSource(this.objectType.value)
         }else{
           this.getSource(this.objectType)
         }
      }
  },
  created () {
      this.getNameModule();
    
  },
  components:{
      UploadFile,
      iconPicker,
      ViewBaConfig,
      draggable,
      FormulaEditor
    },
  data() {
    return {
      test:'',
      id:0,
      listVariable:[],
      detailNotification:{},
      updateData:{},
      list2: [
        { name: "", id: 0 },
      ],
       typeSelected:[
            "Avatar đối tượng gây ra",
            "Tùy chọn icon"
        ],
        typePictureSelected:'Avatar đối tượng gây ra',
        iconName:{
            icon: "",
            iconName: "",
            name: "",
            note: "",
            status: false
        },
        avatarUrl:'',
        parameter:[],
        avatarFileName:'',
        allListObj:{},
        listModule:[],
        listModuleObj:[],
        objectType:'',
        listAction:[],
        action:'',
        listReceiver:[],
        listActionClickNotifi:[],
        receiver:'',
        actionClickNotifi:'',
        listSource:[],
        state:true,
        avatar:'',
        icon:'',
        dragging: false,
        description:''
    };
  },
  computed: {
  },
  methods: {
    // nếu là ảnh trả về false
     checkIcon(icon){
       debugger
        let check = true;
        if(icon.indexOf('user_avatar_')>-1){
            check = false;
        }
        return check
    },
    setAvaOrIcon(icon){
        if(icon){
            if(icon.indexOf('user_avatar_')>-1){
                return appConfigs.apiDomain.fileManagement+'readFile/'+icon ;}
        }       
    },
    viewNotificationInfo(des){
      this.detailNotification.icon=des.icon;
      this.detailNotification.objectType=des.objectType;
      this.detailNotification.content=des.content;
      this.detailNotification.action=des.event;
      this.detailNotification.receiver=des.defaultUser;
      this.detailNotification.actionClickNotifi=des.originAction;
      this.detailNotification.state=des.state=="Theo dõi"?true:false;
    },
    setNotificationInfo(des){
      this.state=des.state=="Theo dõi"?true:false;
    },
    handleAvatarSelected(tempUrl){
        this.avatarUrl = tempUrl;
        this.avatarFileName = 'user_avatar_'+util.str.randomString(6)+Date.now();
        this.$refs.uploadAvatar.uploadFile();
    },
    replaceDescription(){
      let description = this.description;
      for(let i = 0; i<this.parameter.length;i++){
        if(this.parameter[i].value=='{data.dueDate}'){
          let oldValue= new RegExp('<'+this.parameter[i].text+':dueDate>');
          let newValue = this.parameter[i].value;
          description= description.replace(oldValue,newValue);
          break;
        }else{
          let oldValue= new RegExp('<'+this.parameter[i].text+'>');
          let newValue = this.parameter[i].value;
          description= description.replace(oldValue,newValue);
        }

       
      }
    debugger
      return description;
    },
    getDataUpdate(des){
        this.id = des.id;
        this.state=des.originState;
        this.objectType=des.originObjectType;
        this.receiver=des.originDefaultUser;
        this.action=des.originEvent;
        this.actionClickNotifi=des.action;
        debugger
        this.iconName.iconName=des.icon;
        this.description= des.content;
        this.avatarUrl = appConfigs.apiDomain.fileManagement+'readFile/'+des.icon;
        if(this.checkIcon(des.icon)){
          debugger
              this.typePictureSelected=this.typeSelected[1]
        }else{
          debugger
          this.typePictureSelected=this.typeSelected[0];
          this.avatarFileName = des.icon
        }
    },
    update(){
      if(this.avatarFileName){
        this.$refs.uploadAvatar.uploadFile();
      }
       this.updateData={
          id: this.id,
          event: this.action.value,
          source:this.objectType.value,
          state:this.state?1:0,
          objectType:this.objectType.value,
          receiver:this.receiver.value,
          action:this.actionClickNotifi,
          icon:this.typeSelected[1]==this.typePictureSelected?"mdi "+this.iconName.iconName:this.avatarFileName,
          content:this.replaceDescription()
        }
      const self = this;
      notification.updateChanel(this.updateData.id, this.updateData).then(res=>{
        if(res.status==200){
            self.$snotify({
                  type: "success",
                  title: "Cập nhật thành công",
              });
            self.refreshAll();
            self.$emit("refreshList")
        }else{
            self.$snotify({
                type: "error",
                title: "Cập nhật thất bại",
            });
          }
        })
    },
    add(){
       if(this.avatarFileName){
        this.$refs.uploadAvatar.uploadFile();
      }
        let data={
            event: this.action.value,
            source:this.objectType.value,
            state:this.state?1:0,
            objectType:this.objectType,
            receiver:this.receiver.value,
            action:this.actionClickNotifi,
            icon:this.typeSelected[1]==this.typePictureSelected?"mdi "+this.iconName.iconName:this.avatarFileName,
            content:this.replaceDescription()
        };
       const self = this;
        notification.addChanel(data).then(res=>{
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

    },
    save(){
      if(this.type=="add"){ 
        this.add()
      }else{
        this.update()
      }
    },
      pickIcon(data) {
        debugger
        this.$set(this.iconName, 'iconName', data.icon.trim() )
        this.$set(this.iconName, 'iconType' , data.type)
		},
    refreshSelected(){
      this.listActionClickNotifi = [];
      this.listAction = [];
      this.listReceiver=[];
    },
    refreshAll(){
      this.objectType='';
      this.state=true;
      this.receiver='';
      this.actionClickNotifi='';
      this.iconName.iconName='';
      this.avatarUrl='';
      this.parameter='';
      this.avatarFileName='';
      this.description=''
    },
    getNameModule(){
        const self = this;
        notification.showAllModuleConfig()
        .then(res=>{
            if(res.status==200){
                self.allListObj = res.data
                self.listModule = Object.keys(res.data);
                for(let i = 0;i<self.listModule.length;i++){
                  self.listModuleObj.push({
                    name:self.$t('objects.'+self.listModule[i]),
                    value:self.listModule[i]
                  })
                }
            }
        })
    },
     getSource(nameModule){
        this.listReceiver=[];
        this.listActionClickNotifi =[];
        this.parameter = [];
                //self.listModule = Object.keys(res.data);
        for(let i = 0; i<this.allListObj[nameModule].receiver.length;i++){
            this.listReceiver.push(this.allListObj[nameModule].receiver[i])
        };
          for(let i = 0; i<this.allListObj[nameModule].action.length;i++){
            this.listActionClickNotifi.push(this.allListObj[nameModule].action[i])
        };
        for(let i = 0; i<this.allListObj[nameModule].event.length;i++){
          this.listAction.push({
            text:this.allListObj[nameModule].event[i].text,
            value:this.allListObj[nameModule].event[i].value

          })
        };
        for(let i = 0; i<this.allListObj[nameModule].parameter.length;i++){
            this.parameter.push({
              text:this.allListObj[nameModule].parameter[i].text,
              value: this.allListObj[nameModule].parameter[i].value
              });
              this.listVariable.push({
                caption: this.allListObj[nameModule].parameter[i].text,
                value: this.allListObj[nameModule].parameter[i].value,
                meta: "variable",
                docHTML:"123",
              })
        }
    },
     log: function(evt) {
       this.description+=evt.added.element.name;
    },
    cloneValue(value) {
      return {
        value: value.value,
        name: `<${value.text}>`
      };
    }
  }
};
</script>
<style scoped>
.list-group{
  height:60px;
  text-decoration: none

}
.button {
  margin-top: 35px;
}
.handle {
  float: left;
  padding-top: 8px;
  padding-bottom: 8px;
}
.close {
  float: right;
  padding-top: 8px;
  padding-bottom: 8px;
}
input {
  display: inline-block;
  width: 50%;
}
.text {
  margin: 20px;
}
  .config-notification ::v-deep fieldset{
      height:35px!important;
  }
  .config-notification ::v-deep .v-label{
      display:none;
  }
  .config-notification ::v-deep .v-text-field__slot{
      border:1px solid grey
    }
  .config-notification >>>.symper-upload-file{
      margin-top:-28px;
      margin-left:12px;
}
.choose-picture ::v-deep .v-select__slot{
  margin-top:-5px!important
}
</style>
