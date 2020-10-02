<template>
	<div class="h-100 w-100">
		<div class="h-100 w-100" >
			<div class="h-100 w-100">
				<v-stepper class="w-100 d-flex stepper-create-user">
					<v-stepper-content class="w-100" step="1"  v-if="isViewUserRole==false">
					<h4>{{ $t('user.general.personalInfo.title')}}</h4>
					<v-row class="mt-1" >
						<!-- thong tin -->
						<v-col cols="8">
							<v-row class="ml-1">
								<v-col cols="6">
									<span  class="fw-430 fs-13 st-icon-pandora">
										Họ & tên
									</span>
								</v-col>
								<v-col  cols="6">
									<span  class="fs-13 st-icon-pandora">
										{{detailInfo.lastName}} {{' '+ detailInfo.firstName}} 
									</span>
								</v-col>
							</v-row>
							<v-row class="ml-1">
								<v-col cols="6">
									<span  class="fw-430 fs-13 st-icon-pandora">
										{{ $t('user.general.personalInfo.displayName')}}
									</span>
								</v-col>
								<v-col  cols="6">
									<span class="fs-13 st-icon-pandora">
										{{detailUser.displayName}} 
									</span>
								</v-col>
							</v-row>
							<v-row class="ml-1">
								<v-col cols="6">
									<span  class="fw-430 fs-13 st-icon-pandora">
										{{ $t('user.general.personalInfo.email')}}
									</span>
								</v-col>
								<v-col  cols="6">
									<span  class="fs-13 st-icon-pandora">
										{{detailUser.email}} 
									</span>
						
								</v-col>
							</v-row>
							<v-row class="ml-1">
								<v-col cols="6">
									<span   class="fw-430 fs-13 st-icon-pandora">
										{{ $t('user.general.personalInfo.phoneNumber')}}
									</span>
								</v-col>
								<v-col cols="6">
                                    <span  class="fs-13">
									    {{detailUser.phone}} 
                                    </span>
								</v-col>
						    </v-row>
                            <v-row class="ml-1">
								<v-col cols="6">
									<span  class="fw-430 fs-13 st-icon-pandora">
										{{ $t('user.general.personalInfo.status')}}
									</span>
								</v-col>
								<v-col cols="6">
                                    <span style="color:green" v-if="detailUser.status==1" class="fs-13">
									    Hoạt động
                                    </span>
									<span style="color:orange" class="fs-13" v-else>
										Khóa
									</span>
								</v-col>
						    </v-row>
						</v-col>
						<!-- ảnh -->
						<v-col cols="4">
							<v-col cols="3" class="text-center ">
							<SymperAvatar :userId="sapp.endUserInfo.id" style="height: 135px; min-width: 135px; width: 135px;"/>
							<UploadFile 
								style="margin-top:-30px; margin-left:50px"
								:autoUpload="false"
								:fileName="detailUser.avatarFileName"
								/>	
							</v-col>
							<span class="fs-13 ml-15 border">ID: {{detailUser.id}}</span>
						</v-col>	
						<!-- ket thuc anh -->
					</v-row>
				<h4 class="mb-2">Phân quyền</h4>
				<v-row  v-if="rolesOgchart.length>0" class="ml-5 fs-13 fw-430" >Vị trí</v-row>
				<v-row class="ml-6" v-for="(rolesOg,index) in rolesOgchart" :key='index'>
					<v-icon  class="icon-check mr-0">mdi mdi-check</v-icon>
					 <v-btn  
					 	small
					 	text 
						class="fs-13 fm fw-400" 
						@click="viewUserRole(rolesOg.id)">
						 <span class='fm fw-400'>
							 {{rolesOg.name}}
						</span>
					</v-btn>
				</v-row>
				<v-row v-if="roles.length>0" class="ml-5 fs-13 fw-430">
						Vai trò người dùng
				</v-row>
				<v-row class="ml-6 fs-13" v-for="(roles,indexRole) in roles" :key='indexRole'>
					<v-icon  class="icon-check mr-0">mdi mdi-check</v-icon>
					<v-btn class="fm fw-400" 
						style="margin-bottom:-8px"
						text 
						@click="viewUserRole(roles.id)" >
						<span class='fm'>
							{{roles.name}}
						</span>
					</v-btn>
				</v-row>
					</v-stepper-content>
				<!-- user roles -->
				<div class="w-100 ml-3" v-if="isViewUserRole">
					<h4>Danh sách phân quyền cho user</h4>
					<v-row class="w-100 h-100" style="border:1px solid rgba(0,0,0,0.1)" >
						<v-col cols="md-3" >
							<v-list-item-group >
								<v-list dense>
									<v-row class="fs-13 fm fw-430" style=" border-bottom:1px solid rgba(0,0,0,0.1); margin-top:-1px" >
										<span class="ml-3 mb-3">Đối tượng</span> </v-row>
									<v-list-item v-for="(item,menuIdx) in menu" :key="menuIdx">
										<v-list-item-content style="margin-left:-20px" @click="detailView(item)">
											<v-list-item-title class="ml-2 fw-400">{{$t('objects.'+item)}}</v-list-item-title>
										</v-list-item-content>
									</v-list-item>
								</v-list>
							</v-list-item-group >
						</v-col>
						<v-col cols="md-9" class="h-100" style="overflow:scroll; border-left:1px solid rgba(0,0,0,0.1)">
							<v-row style="border-bottom:1px solid rgba(0,0,0,0.1); margin-top:-5px">
								<v-col cols="md-3" class="fw-430 fs-13">
									{{menuTitle.length==0?"Chọn":$t('objects.'+menuTitle)}}
								</v-col>
								<v-col 
									style="width: 40px!important" 
									v-for="(action,actionIdx) in action" 
									:key="actionIdx" 
									class="fs-13 ml-2 mr-2">
									{{action}}
								</v-col>
							</v-row>
								<v-row v-for="(nameObj,nameObjIdx) in titleAllNameObject" 
									:key="nameObjIdx"
									style="margin-top:-10px">
									<v-col cols="md-3" class="fw-400 fs-13">
										{{nameObj.title}}
									</v-col>
									<v-col style="width: 40px!important"
										v-for="(action2,actionIdx2) in action" 
										:key="actionIdx2" 
										class="fs-13 ml-2 mr-2" >
										<span v-if="checkRole(nameObj.objectIdentifier,action2)">
											<v-icon style="color:green">mdi mdi-check</v-icon>
										</span>
									</v-col>
							</v-row>
						</v-col>
					</v-row>
				</div>
				<!-- user roles -->
				</v-stepper>
			</div>
		</div>
	</div>
</template>
<script>
import SymperAvatar from "../../components/common/SymperAvatar";
import { userApi } from "./../../api/user.js";
import { orgchartApi } from "./../../api/orgchart.js";
import { systemRoleApi } from "./../../api/systemRole.js";
import avatarDefault from "@/assets/image/avatar_default.jpg";
import UploadFile from "./../../components/common/UploadFile";
import _ from 'lodash';

let heighOrgchart = 0;
export default {
	components:{
		UploadFile,
		SymperAvatar
	},
	props:
        ['detailInfo','changeDetail'],
	computed: {
        sapp() {
            return this.$store.state.app;
        },
    },
    methods:{
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
		async getActionAndObject(role){
			let res = await userApi.getActionAndObject(role);
			if (res.status === 200) {
				this.listActionAndObj = res.data;	
				this.listActionAndObj =  _.groupBy(this.listActionAndObj, 'objectType');
				this.setMenu();
			}
		},
		// lấy ra object làm menu 
		setMenu(){
			let listObject = Object.keys(this.listActionAndObj)
            for (let i = 0; i < listObject.length; i++) {
                 this.menu.push(listObject[i]);
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
			this.titleNameObject =[];
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
			//this.action = action.filter((item, index) => action.indexOf(item) === index);
			this.getListObjectIdentifier(object);
		},
		//loc những action k dùng đến 
		filterAction(){
			let action =_.groupBy(this.nameObject,'action');
			let arrAction = Object.keys(action);
			for(let i= 0; i<arrAction.length;i++){
				this.action.push(arrAction[i]);
			}
		 },
		//group những loại đối tượng dạng document_de:123123 trùng tên với nhau 
		groupNameObj(){
			this.nameObject;
			let group = _.groupBy(this.nameObject,'name');
			this.objAndAction = group;
		},
		getMenuTitle(object){
			return object;
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
		async getRoleOrgchartByUser(id){
			const self = this;
			let res = await orgchartApi.getRolesByUser([{idUser: id}])
			if (res.status === 200) {
				self.rolesOgchart = res.data[0].roles
			}	
		},
		async getRolesByUser(id){
			const self = this;
			let res = await  systemRoleApi.getRolesByUser([id])
				if (res.status === 200) {
					self.roles = res.data[0].roles
				}
		},
		viewUserRole(role){
			this.isViewUserRole =! this.isViewUserRole;
			this.getActionAndObject(role);
		},    
    },
    created(){
		this.detailUser = this.detailInfo;
		 this.getRoleOrgchartByUser(this.detailInfo.id);
		 this.getRolesByUser(this.detailInfo.id);

    },
    watch:{
        detailInfo(){
			this.getRoleOrgchartByUser(this.detailInfo.id);
			this.getRolesByUser(this.detailInfo.id);
	 	}
    },
	data(){
		return {
			titleAllNameObject:[],
			titleNameObject:[],
			listRoleObj:[],
			objAndAction:{},
			listObj:[],
			listActionAndName:[],
			detailUser:'',
			lastName:'',
			actionPanel : this.$t('user.other.createUser'),
			roles:[],
			id:[],
			rolesOgchart:[],
			isViewUserRole:false,
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
	.fm{
		font-family:Roboto!important;
		font-size:13px!important
	}
	.fw-400{
		font-weight:400
	}
	.fw-430{
		font-weight:430
	}
	.font-normal{
		font-family:Roboto;
		font-size: 13px;
	}
	.stepper-header{
		width: 200px;
		height: auto;
		display: block;
		border-right: 1px solid #eaeaea;
		box-shadow: none;
	}
	.stepper-items{
		width: calc(100% - 200px);
	}
	.stepper-items .row .col{
		padding: 0 3px;
	}
	.stepper-header .v-stepper__step{
		height: 30px;
		margin: 10px;
		padding: 20px;
		font-size: 14px;
	}
	.stepper-header .v-stepper__step--active{
		background: #f2f2f2;
		border-radius: 4px;
	}
	.v-stepper__content{
		height: 100%;
		padding: 10px 15px!important
	}

	.v-subheader{
		padding: 0;
	}

	.v-stepper__wrapper .row .col{
		padding: 0 12px;
	}
	
	.btn-next-step{
		position: absolute;
		bottom: 20px;
		right: 20px;
		box-shadow: none ;
		background: white ;
		color: green ;
	}
	.stepper-create-user{
		box-shadow: none;
		height: calc(100% - 50px);
	}
	.header-title{
		padding: 0 0 12px 0;
		border-bottom: 1px solid #eaeaea;
	}

	.input-file{
		width: 0;
		height: 0;
	}
	.border{
		border:1px solid lightgrey
	}
	.icon-check{
		color:green; 
		font-size:14px
	}
</style>
