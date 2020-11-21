<template>
    <div class="w-100 h-100">
        <v-row style="margin-top:-13px; margin-left:-20px">
            <v-col >
                <v-btn  @click="showUserInfo()"  small text  fab>
                    <i style="font-size:15px!important" class="mdi mdi-arrow-left"></i>
                </v-btn>
                    <span class="fw-430">Danh sách phân quyền cho user</span>
            </v-col>
        </v-row>
        <v-row class="w-100 h-100" style="border:1px solid rgba(0,0,0,0.1); margin-top:-10px" >
            <v-col cols="md-2" >
                <v-list-item-group >
                    <v-list dense>
                        <v-row 
                            class="fs-13 fm fw-430" 
                            style=" border-bottom:1px solid rgba(0,0,0,0.1); margin-top:-12px" >
                            <span class="ml-3 mb-3">Đối tượng</span> </v-row>
                        <v-list-item 
                            class="mt-1" 
                            v-for="(item,menuIdx) in menu" 
                            :key="menuIdx" 
                            style="margin-left:-8px; margin-right:-8px">
                            <v-list-item-content style="margin-left:-20px" @click="detailView(item)">
                                <v-list-item-title class="ml-2 fw-400">{{$t('objects.'+item)}}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-list-item-group >
            </v-col>
            <v-col cols="md-10" class=" left-table">
                <v-row style="border-bottom:1px solid rgba(0,0,0,0.1); margin-top:-7px; padding-top:3px">
                    <v-col cols="md-3" class="fw-430 fs-13">
                        {{menuTitle.length==0?"Chọn":$t('objects.'+menuTitle)}}
                    </v-col>
                    <v-col 
                        style="width: 40px!important;" 
                        v-for="(action,actionIdx) in action" 
                        :key="actionIdx" 
                        class="fs-13 ">
                        {{$t('actions.listActions.'+menuTitle+"."+action)}}
                    </v-col>
                </v-row>
				<div style="height:650px;overflow:scroll;margin-right:-12px">
                    <v-row 
                        v-for="(nameObj,nameObjIdx) in titleAllNameObject" 
                        :key="nameObjIdx"
                     >
                        <v-col cols="md-3" class="fw-400 fs-13">
                           {{nameObj.objectIdentifier.split(':')[1]}}- {{nameObj.title}}
                        </v-col>
                        <v-col style="width:40px!important; " 
                            v-for="(action2,actionIdx2) in action" 
                            :key="actionIdx2" 
                            class="fs-13 " >
                            <span v-if="checkRole(nameObj.objectIdentifier,action2)">
                                <v-icon style="color:green; font-size:16px">mdi mdi-check</v-icon>
                            </span>
                        </v-col>
                </v-row>
				</div>
            </v-col>
        </v-row>
    </div>
</template>
<script>
import { userApi } from "./../../api/user.js";
export default {

    props:['rolesList'],
    methods:{
        showUserInfo(){
            this.$emit("show-userInfo")
        },
		// kiểm tra trùng action thì tích
		checkRole(nameObj,action){
			let check = false;
			for(let i = 0; i<this.objAndAction[nameObj].length;i++){
				if(this.objAndAction[nameObj][i].action==action){
					check =  true
				}
			}
			return check
		},
		// lấy ra tất cả action và object 
		async getActionAndObject(){
            let res = await userApi.getActionAndObject(this.rolesList);
			const self = this;
			if (res.status === 200) {
				self.listActionAndObj = res.data;	
				self.listActionAndObj =  _.groupBy(self.listActionAndObj, 'objectType');
				self.setMenu();
			}
		},
		// lấy ra object làm menu 
		setMenu(){
			let listObject = Object.keys(this.listActionAndObj)
            for (let i = 0; i < listObject.length; i++) {
				if(listObject[i]!='syql'){
					 this.menu.push(listObject[i]);
				}
                
            };
		},
		getListObjectIdentifier(object){
			let objIdentifier =[];
			objIdentifier = _.groupBy(this.listActionAndObj[object],'objectIdentifier' );
			let formatObjIdentifier = Object.keys(objIdentifier);
			this.listRoleObj = formatObjIdentifier.filter(x=>x.indexOf(':')>0);
			this.getNameObjByRoles(this.listRoleObj);
		},
		// lọc object identify đúng chuẩn : và có số ở cuối 
		formatAction(obj){
			let checkDot = obj.indexOf(':')>0?true:false;
			let checkInt = obj.split(':').length==2?true:false; 
			if(checkDot&&checkInt){
				return true
			}else{
				return false
			}
		},
		// view theo từng đối tượng 
		detailView(object){
			this.action=[];
			this.nameObject =[];
			let action = [];
			this.menuTitle = object;
			let listObject = Object.keys(this.listActionAndObj)
            for (let i = 0; i < listObject.length; i++){
                 if(listObject[i]==object){
					 for(let j=0; j<this.listActionAndObj[object].length;j++){
						 if(this.formatAction(this.listActionAndObj[object][j].objectIdentifier)){
							 action.push(this.listActionAndObj[object][j].action);
						 	this.nameObject.push({
							 	name:this.listActionAndObj[object][j].objectIdentifier,
							 	action: this.listActionAndObj[object][j].action,
							 });
						 }	 
					 }
				 }
			};
			this.groupNameObj();
			this.filterAction();
			this.getListObjectIdentifier(object);
		},
		// lấy danh sách action chuẩn 
		async getListActionAllObj(){
			const self = this;
			let res = await userApi.getAllListObj();
			if(res.status==200){
				self.allListAction = res.data
			}

		},
		//loc những action k dùng đến và k đúng chuẩn 
		filterAction(){
			let action =_.groupBy(this.nameObject,'action');
			let arrAction = Object.keys(action);
			for(let i= 0; i<arrAction.length;i++){
				for(let j = 0; j<this.allListAction[this.menuTitle].action.length;j++){
					if(arrAction[i]==this.allListAction[this.menuTitle].action[j]){
						this.action.push(arrAction[i]);
					}
				}
			}
		 },
		//group những loại đối tượng dạng document_de: trùng tên với nhau 
		groupNameObj(){
			this.nameObject;
			let group = _.groupBy(this.nameObject,'name');
			this.objAndAction = group;
		},
		// lấy ra nhưng danh sách tên title 
		async getNameObjByRoles(role){
			const self = this;
			let listObj = [];
			let newListObj = [];
			let arrObj = Object.keys(self.objAndAction);
			for(let i= 0;i<arrObj.length;i++){
				listObj.push(arrObj[i]);
			};
			let res = await userApi.getOperationsObject({ids:role});
			if(res.status ==200){
				let titleNameObject = res.data;
				for(let i = 0; i<titleNameObject.length;i++){
					for(let j= 0;j<listObj.length;j++){
						if(listObj[j]==titleNameObject[i].objectIdentifier){
							newListObj.push({
								title:titleNameObject[i].title?titleNameObject[i].title:titleNameObject[i].name,
								objectIdentifier: listObj[j]
							});
						}
					}
				}
			}
			self.titleAllNameObject = newListObj;
		},
		// xử lý chuyển tên object    
    },
    created(){
		this.getActionAndObject();
		this.getListActionAllObj();
    },
	data(){
		return {
			allListAction:{},
			titleAllNameObject:[],
			listRoleObj:[],
			objAndAction:{},
			listActionAndObj:[],
			menu:[],
			action:[],
			menuTitle:[],
			nameObject:[]
		}
 	},
}
</script>
<style scoped>
    .left-table{
        border-left: 1px solid rgba(0,0,0,0.1);
        padding-top:0px
    }
    .fw-430{
        font-weight:430
    }
</style>