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
							<v-row  v-if="!changeDetail">
								<v-col cols="6">
									<span  class="fw-430 fs-13 st-icon-pandora">
												Họ tên
									</span>
								</v-col>
								<v-col  cols="6">
									<span  class="fs-13 st-icon-pandora">
												{{detailInfo.lastName}} {{' '+ detailInfo.firstName}} 
									</span>
								</v-col>
							</v-row>
							<v-row  v-if="changeDetail">
								<v-col cols="6">
									<span class="fw-430 fs-13 st-icon-pandora">
												Họ
									</span>
								</v-col>
								<v-col  cols="6">
									<span v-if="!checkChangeLastName" class="fs-13 st-icon-pandora">
											{{detailUser.lastName}} <span v-if="changeDetail">
												<v-icon @click="checkChangeLastName=true" style="font-size: 14px">mdi mdi-pencil</v-icon></span>
									</span>
									<span v-else class="fs-13 st-icon-pandora">
									<v-text-field
											class="fs-13 font-normal"
											v-model="lastName"
											dense
									></v-text-field>
									<v-icon @click="changeLastName()" style="color:green; font-size: 14px">mdi mdi-check</v-icon>
									</span>
							
								</v-col>
							</v-row>
							<!-- Endusser đổi thông tin cá nhân  -->
							<v-row  v-if="changeDetail">
								<v-col cols="6">
									<span  class="fs-13 st-icon-pandora">
											Tên
									</span>
								</v-col>
								<v-col  cols="6">
									<span v-if="!checkChangeFirstName" class="fs-13 st-icon-pandora">
										{{detailUser.firstName}} <span v-if="changeDetail">
											<v-icon style="font-size: 14px" @click="checkChangeFirstName=true">mdi mdi-pencil</v-icon></span>
									</span>
									<span v-else class="fs-13 st-icon-pandora">
									<v-text-field
											class="fs-13 font-normal"
											v-model="firstName"
											dense
									></v-text-field>
									<v-icon @click="changeFirstName()" style="color:green; font-size: 14px">mdi mdi-check</v-icon>
									</span>
								</v-col>
						</v-row>
							<v-row>
								<v-col cols="6">
									<span  class="fw-430 fs-13 st-icon-pandora">
												{{ $t('user.general.personalInfo.displayName')}}
									</span>
								</v-col>
								<v-col  cols="6">
									<span  v-if="!checkChangeDisplayName" class="fs-13 st-icon-pandora">
											{{detailUser.displayName}} <span v-if="changeDetail">
												<v-icon style="font-size: 14px" @click="checkChangeDisplayName=true">mdi mdi-pencil</v-icon>
									</span>
									</span>
									<span v-else class="fs-13 st-icon-pandora">
									<v-text-field
											class="fs-13 font-normal"
											v-model="displayName"
											dense
									></v-text-field>
									<v-icon @click="changeDisplayName()" style="color:green; font-size: 14px">mdi mdi-check</v-icon>
									</span>
								</v-col>
							</v-row>
							<v-row>
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
							<v-row>
								<v-col cols="6">
									<span   class="fw-430 fs-13 st-icon-pandora">
										{{ $t('user.general.personalInfo.phoneNumber')}}
									</span>
								</v-col>
							
								<v-col cols="6">
                                    <span  v-if="!checkPhone" class="fs-13">
									    {{detailUser.phone}} <span v-if="changeDetail"><v-icon style="font-size: 14px" @click="checkPhone=true">mdi mdi-pencil</v-icon></span>
                                    </span>
										<span v-else class="fs-13 st-icon-pandora">
									<v-text-field
											class="fs-13 font-normal"
											v-model="phone"
											dense
									></v-text-field>
									<v-icon @click="changePhone()" style="color:green; font-size: 14px">mdi mdi-check</v-icon>
									</span>
								</v-col>
						    </v-row>
                            <v-row>
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
							<v-row  v-if="changeDetail">
								<v-col cols="6">
									<span  class="fw-430 fs-13 st-icon-pandora">
											Mật khẩu
									</span>
								</v-col>
								<v-col  cols="6">
									<span  class="fs-13 st-icon-pandora">
										<span v-if="changeDetail">
											<v-icon @click="checkPass=true" style="font-size: 14px">mdi mdi-pencil</v-icon></span>
									</span>
								</v-col>
							</v-row>
							<v-row  v-if="changeDetail&&checkPass">
								<v-col  cols="12">
									<span  class="fs-12 st-icon-pandora" style="color:grey">
										Mật khẩu ít nhất 8 kí tự, 1 chữ viết hoa, 1 số và 1 ký tự thường
									</span>
								</v-col>
							</v-row>
							 <v-row v-if="checkPass" class="mt-1">
								 	<v-col cols="10">
							<v-text-field class="fs-13 ml-3"
								 v-model="newPassword" 
								ref="newPass" dense
								placeholder="Mật khẩu cũ"
								outlined
								prepend-inner-icon="mdi-lock-outline"
								:rules="[rules.required, rules.min, rules.max]" 
								:type="showPass ? 'text' : 'password'" 
								@click:prepend-inner="showPass = !showPass">
							</v-text-field>
							</v-col>
						</v-row>
						<v-row v-if="checkPass" style="margin-top:-10px" >
							<v-col cols="10">
							  <v-text-field
									class="fs-13 ml-3" 
									prepend-inner-icon="mdi-lock-open-outline"
									v-model="reNewPassword" 
									ref="reNewPass" 
									dense 
									placeholder="Mật khẩu mới"
									outlined
									:rules="[rules.required, rules.min, rules.max, rules.match]" 
									:type="showPass ? 'text' : 'password'"
									@click:prepend-inner="showPass = !showPass">
							</v-text-field>
							</v-col>
								<v-col cols="2">
								<v-icon @click="changePass()" style="color:green; font-size: 14px">mdi mdi-check</v-icon>
								</v-col>
						</v-row>
						
						</v-col>
						<!-- kt thong tin -->
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
							<span style="border:1px solid lightgrey" class="fs-13 ml-15">ID: {{detailUser.id}}</span>
						</v-col>	
						<!-- ket thuc anh -->
					</v-row>
				<h4 class="mt-2">Phân quyền</h4>
				<v-row  v-if="rolesOgchart" class="ml-1 fs-13 fw-430" >Vị trí</v-row>
				<v-row class="ml-3 fs-13" v-for="(rolesOg,index) in rolesOgchart" :key='index'>
					 <v-btn  text class=" fs-13" style="font-family:Roboto" @click="viewUserRole(rolesOg.id)">{{rolesOg.name}}</v-btn>
				</v-row>
				<v-row v-if="roles" class="fs-13 ml-1 fw-430">
					<!-- @click="viewUserRole()" -->
						Vai trò người dùng
				</v-row>
					<v-row class="ml-3 fs-13" v-for="(roles,indexRole) in roles" :key='indexRole'>
					<v-btn style="font-weight:400; margin-bottom:-8px; font-family:Roboto" text @click="viewUserRole(roles.id)" >{{roles.name}} </v-btn>
				</v-row>
					</v-stepper-content>
				<!-- user roles -->
					<div class="w-100 ml-3" v-if="isViewUserRole">
					
					<h4>Danh sách phân quyền cho user</h4>
						<!-- menu -->
					<v-row class="w-100 h-100" style="border:1px solid rgba(0,0,0,0.1)" >
						<v-col cols="md-3" >
							<v-list-item-group >
								<v-list dense>
									<v-row class="fs-13 fm fw-430" style=" border-bottom:1px solid rgba(0,0,0,0.1); margin-top:-1px" >
										<span class="ml-3 mb-3">	Đối tượng</span> </v-row>
									<v-list-item v-for="(item,menuIdx) in menu" :key="'D'+menuIdx">
										<v-list-item-content style="margin-left:-20px" @click="detailView(item)">
											<v-list-item-title class="ml-2 fw-400">{{$t('objects.'+item)}}</v-list-item-title>
										</v-list-item-content>
									</v-list-item>
								</v-list>
							</v-list-item-group >
						</v-col>
						<v-col cols="md-9" style="overflow:scroll; border-left:1px solid rgba(0,0,0,0.1); height:100%!important">
							<v-row style="border-bottom:1px solid rgba(0,0,0,0.1); margin-top:-5px">
								<v-col class="fw-430 fs-13">
									{{menuTitle.length==0?"Chưa chọn đối tượng":$t('objects.'+menuTitle)}}
								</v-col>
								<v-col v-for="(action,actionIdx) in action" class="fs-13">
									{{action}}
								</v-col>
							</v-row>
								<v-row v-for="(nameObj,nameObjIdx) in Object.keys(objAndAction)"  style="margin-top:-10px">
									<v-col style="font-weight:400;" class="fs-13">
										{{nameObj}}
									</v-col>
									<v-col v-for="(action2,actionIdx2) in action" >
										<span v-if="checkRole(nameObj,action2)"><v-icon style="color:green">mdi mdi-check</v-icon></span>
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
import ChangePassword from "./../../views/users/ChangePass.vue";
import { userApi } from "./../../api/user.js";
import { permissionPackageApi } from "./../../api/PermissionPackage.js";
import { permissionPositionOrgchartApi } from "./../../api/PermissionPositionOrgchart.js";
import { orgchartApi } from "./../../api/orgchart.js";
import { systemRoleApi } from "./../../api/systemRole.js";
import { str } from "./../../plugins/utilModules/str.js";
import avatarDefault from "@/assets/image/avatar_default.jpg";
import VueResizable from 'vue-resizable'
import UploadFile from "./../../components/common/UploadFile";
import { appConfigs } from '../../configs';
import _ from 'lodash';

let heighOrgchart = 0;
export default {
	components:{
		"vue-resizable":VueResizable,
        "v-change-password":ChangePassword,
        UploadFile,SymperAvatar
	},
	props:
        ['detailInfo','changeDetail'],
	computed: {
        sapp() {
            return this.$store.state.app;
        },
    },
    methods:{
		findNameObj(obj){
		
			let test = this.titleNameObject;
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
			let b = this.action;
			
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
			let res = await userApi.getOperationsObject({ids:role});
			if(res.status ==200){
				let titleNameObject = res.data;
				// if(titleNameObject.length==0){
				// 	alert("Không có quyền")
				// }else{
					for(let i = 0; i<titleNameObject.length;i++){
					self.titleNameObject.push(titleNameObject[i].title?titleNameObject[i].title:titleNameObject[i].name);
					// }
				}
			}
		},
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
		changeLastName(){
			const self = this;
			this.checkChangeLastName = false;
			let data = {
				lastName:this.lastName,
			}
			userApi.changeUserProfile(data).then(res => {
				if (res.status == 200) {
					self.detailUser.lastName =res.user.lastName;
					this.$snotify({
					type: "success",
					title: this.$t("notification.successTitle")});
				}
			})
			.catch(err => {
				console.log("error from add user api!!!", err);
				this.$snotify({
					type: "error",
					title: this.$t("notification.error")});})
		},
		changeFirstName(){
			this.checkChangeFirstName = false;
			let data = {
				firstName:this.firstName,
			}
			userApi.changeUserProfile(data).then(res => {
				if (res.status == 200) {
					this.detailUser.firstName =res.user.firstName;
					this.$snotify({
					type: "success",
					title: this.$t("notification.successTitle")});
				}
			})
			.catch(err => {
				console.log("error from add user api!!!", err);
				this.$snotify({
					type: "error",
					title: this.$t("notification.error")});})
		},
		changeDisplayName(){
			this.checkChangeDisplayName = false;
			let data = {
				displayName:this.displayName,
			}
			userApi.changeUserProfile( data).then(res => {
				if (res.status == 200) {
					this.detailUser.displayName =res.user.displayName;
					this.$snotify({
					type: "success",
					title: this.$t("notification.successTitle")});
				}
			})
			.catch(err => {
				console.log("error from add user api!!!", err);
				this.$snotify({
					type: "error",
					title: this.$t("notification.error")});})
		},
		changePhone(){
			this.checkPhone = false;
			let data = {
				phone:this.phone,
			}
			userApi.changeUserProfile(data).then(res => {
				if (res.status == 200) {
					this.detailUser.phone =res.user.phone;
					this.$snotify({
					type: "success",
					title: this.$t("notification.successTitle")});
				}
			})
			.catch(err => {
				console.log("error from add user api!!!", err);
				this.$snotify({
					type: "error",
					title: this.$t("notification.error")});})
		},
		 changePass(){
			this.checkPass = false;
			let pass=this.newPassword;
            userApi.changePassUser(pass).then(res => {
                if (res.status == 200) {
                    this.$snotify({
                        type: "success",
                        title: this.$t("notification.successTitle")
                    });
                    this.$emit('cancel');
                } else {
                    this.$snotify({
                        type: "error",
                        title: res.message
                    });
                }
            })
            .catch(err => {
                console.log("error from change pass user api!!!", err);
            })
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
			titleNameObject:[],
			listRoleObj:[],
			objAndAction:{},
			listObj:[],
			listActionAndName:[],
			detailUser:'',
			newPassword:'',
			reNewPassword: "",
			 showPass: false,
			 rules: {
                required: value => !!value || 'Không được bỏ trống.',
                min: v => (typeof v != 'undefined' && v != undefined && v.length >= 8) || 'Yêu cầu mật khẩu lớn hơn 8 kí tự',
                max: v => (typeof v != 'undefined' && v != undefined && v.length < 25) || 'Yêu cầu mật khẩu ít hơn 24 kí tự',
            },
			checkChangeLastName:false,
			lastName:'',
			checkPass:false,
			checkPhone:false,
			checkChangeDisplayName:false,
			checkChangeFirstName:false,
			showPassPanel:false,
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
	.v-input--checkbox{
		margin-top: 0;
	}
	.setting-password{
		margin: 16px 0;
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
	.permission-item{
		background: #f2f2f2;
		margin: 4px 0;
		border-radius: 4px;
	}
	.permission-item .mdi{
		cursor: pointer;
	}
	.stepper-create-user{
		box-shadow: none;
		height: calc(100% - 50px);
	}
	.header-title{
		padding: 0 0 12px 0;
		border-bottom: 1px solid #eaeaea;
	}
	.tree-permissionPosition{
		height: 500px;
		overflow-y: auto;
	}

	.input-file{
		width: 0;
		height: 0;
	}
	#preview {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 80px;
		height: 75px;
	}

  #preview img {
	max-width: 100%;
	max-height: 500px;
  }
  	.treeCheckBox{
		margin-top: 0px;
		max-height: 30px;
	}

	
</style>
