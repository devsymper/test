<template>
	<div class="h-100">
		<div class="h-100" >
			<div class="h-100">
				<v-stepper class="d-flex stepper-create-user">
				<v-stepper-items class="stepper-items" v-if="isViewUserRole==false">
					<v-stepper-content step="1">
					<h4>{{ $t('user.general.personalInfo.title')}}</h4>
					<v-row class="mt-1" >
						<!-- thong tin -->
						<v-col cols="8">
							<v-row  v-if="!changeDetail">
								<v-col cols="6">
									<span style="font-weight:430" class="fs-13 st-icon-pandora">
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
									<span style="font-weight:430" class="fs-13 st-icon-pandora">
												Họ
									</span>
								</v-col>
								<v-col  cols="6">
									<span v-if="!checkChangeLastName" class="fs-13 st-icon-pandora">
											{{detailInfo.lastName}} <span v-if="changeDetail"><v-icon @click="checkChangeLastName=true" style="font-size: 14px">mdi mdi-pencil</v-icon></span>
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
							<v-row  v-if="changeDetail">
								<v-col cols="6">
									<span style="font-weight:430" class="fs-13 st-icon-pandora">
											Tên
									</span>
								</v-col>
								<v-col  cols="6">
									<span  class="fs-13 st-icon-pandora">
												{{detailInfo.firstName}} <span v-if="changeDetail"><v-icon style="font-size: 14px" @click="changeFirstName()">mdi mdi-pencil</v-icon></span>
									</span>
							
								</v-col>
						</v-row>
							<v-row>
								<v-col cols="6">
									<span style="font-weight:430" class="fs-13 st-icon-pandora">
												{{ $t('user.general.personalInfo.displayName')}}
									</span>
								</v-col>
								<v-col  cols="6">
									<span  class="fs-13 st-icon-pandora">
											{{detailInfo.displayName}} <span v-if="changeDetail"><v-icon style="font-size: 14px" @click="changeDisplayName()">mdi mdi-pencil</v-icon></span>
									</span>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="6">
									<span style="font-weight:430" class="fs-13 st-icon-pandora">
												{{ $t('user.general.personalInfo.email')}}
									</span>
								</v-col>
								<v-col  cols="6">
									<span  class="fs-13 st-icon-pandora">
												{{detailInfo.email}} 
									</span>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="6">
									<span style="font-weight:430" class="fs-13 st-icon-pandora">
										{{ $t('user.general.personalInfo.phoneNumber')}}
									</span>
								</v-col>
							
								<v-col cols="6">
                                    <span class="fs-13">
									    {{detailInfo.phone}} <span v-if="changeDetail"><v-icon style="font-size: 14px" @click="changePhone()">mdi mdi-pencil</v-icon></span>
                                    </span>
								</v-col>
						    </v-row>
                            <v-row>
								<v-col cols="6">
									<span style="font-weight:430" class="fs-13 st-icon-pandora">
										{{ $t('user.general.personalInfo.status')}}
									</span>
								</v-col>
								<v-col cols="6">
                                    <span class="fs-13">
									    {{detailInfo.status==1?'Hoạt động':"Khóa"}}
                                    </span>
								</v-col>
								
						    </v-row>
							<v-row  v-if="changeDetail">
								<v-col cols="6">
									<span style="font-weight:430" class="fs-13 st-icon-pandora">
											Mật khẩu
									</span>
								</v-col>
								<v-col  cols="6">
									<span  class="fs-13 st-icon-pandora">
										<span v-if="changeDetail"><v-icon @click="changePass()" style="font-size: 14px">mdi mdi-pencil</v-icon></span>
									</span>
							
								</v-col>
							</v-row>
						</v-col>
						<!-- kt thong tin -->
						<!-- ảnh -->
						<v-col cols="4">
								<v-col cols="3" class="text-center ">
								<v-avatar :size="80" >
									<img v-if="detailInfo.avatarUrl != ''"
										:src="detailInfo.avatarUrl+detailInfo.id"
									>
									<img v-if="detailInfo.avatarUrl== ''"
										:src="require('./../../assets/image/avatar_default.jpg')"
									>
								</v-avatar>
								<UploadFile 
									style="margin-top:-30px; margin-left:50px"
									ref="uploadAvatar"
									:autoUpload="false"
									:fileName="detailInfo.avatarFileName"
								 />
									
							</v-col>
							<span class="fs-13 ml-7">ID: {{detailInfo.id}}</span>
						</v-col>	
						<!-- ket thuc anh -->
					</v-row>
				<h4 class="mt-2">Phân quyền</h4>
				<v-row  v-if="rolesOgchart" class="ml-1 fs-13" style="font-weight:430">Vị trí</v-row>
				<v-row class="ml-3 fs-13" v-for="(rolesOg,index) in rolesOgchart" :key='index'>
					{{rolesOg.name}} 
				</v-row>
				<v-row v-if="roles" class="fs-13 ml-1" style="font-weight:430">
					<!-- @click="viewUserRole()" -->
						Vai trò người dùng
				</v-row>
					<v-row class="ml-3 fs-13" v-for="(roles,indexRole) in roles" :key='indexRole'>
					<v-btn style="font-weight:400; margin-bottom:-8px" class=" fs-13" text @click="viewUserRole(roles.id)" >{{roles.name}} </v-btn>
				</v-row>
					</v-stepper-content>
				</v-stepper-items>
				<!-- user roles -->
					<div class="w-100 ml-3" v-if="isViewUserRole">
					
					<h4>Danh sách phân quyền cho user</h4>
						<!-- menu -->
					<v-row class="w-100 h-100" style="border:1px solid rgba(0,0,0,0.1)" >
						<v-col cols="md-3" >
							<v-list-item-group >
								<v-list dense>
									<v-row class="fs-13 fm" style="font-weight:430; border-bottom:1px solid rgba(0,0,0,0.1); margin-top:-1px" ><span class="ml-3 mb-3">	Đối tượng</span> </v-row>
									<v-list-item v-for="(item,menuIdx) in menu" :key="'D'+menuIdx">
										<v-list-item-content style="margin-left:-20px" @click="detailView(item)">
											<v-list-item-title style="font-weight:400" class="ml-2">{{item}}</v-list-item-title>
										</v-list-item-content>
									</v-list-item>
								</v-list>
							</v-list-item-group >
						</v-col>
						<v-col cols="md-9" style="border-left:1px solid rgba(0,0,0,0.1); height:100%!important">
							<v-row style="border-bottom:1px solid rgba(0,0,0,0.1); margin-top:-5px">
								<v-col style="font-weight:430;" class="fs-13">
									{{menuTitle.length==0?"Chưa chọn đối tượng":menuTitle}}
								</v-col>
								<v-col v-for="(action,actionIdx) in action" class="fs-13">
									{{action}} 
								</v-col>
							</v-row>
							<v-row v-for="(nameObj,nameObjIdx) in nameObject"  style="margin-top:-10px">
								<v-col style="font-weight:400;" class="fs-13">
									{{nameObj.name}}
								</v-col>
								<v-col v-for="(action2,actionIdx2) in action" >
									<span v-if="nameObj.action==action2"><v-icon style="color:green">mdi mdi-check</v-icon></span>
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
        UploadFile
	},
	props:
        ['detailInfo','changeDetail'],
	computed: {
        sapp() {
            return this.$store.state.app;
        },
    },
    methods:{
		viewUserRole(role){
			this.isViewUserRole =! this.isViewUserRole;
			this.getActionAndObject(role);
		},
		async getActionAndObject(role){
			let res = await userApi.getActionAndObject(role);
			if (res.status === 200) {
				this.listActionAndObj = res.data;	
				this.listActionAndObj =  _.groupBy(this.listActionAndObj, 'objectType');
				this.setMenu();
			}
		},
		setMenu(){
			let listObject = Object.keys(this.listActionAndObj)
            for (let i = 0; i < listObject.length; i++) {
                // console.log(this.newSearch[i].group);
                 this.menu.push(listObject[i]);
            };
           
		},
		changeLastName(){
			this.checkChangeLastName = false;
			let data = {
				id:this.detailInfo.id,
				lastName:this.lastName,
			}
			userApi.updateUser(this.detailInfo.id, data).then(res => {
				if (res.status == 200) {
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
				id:this.detailInfo.id,
				firstName:this.firstName,
			}
			userApi.updateUser(this.detailInfo.id, data).then(res => {
				if (res.status == 200) {
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
				id:this.detailInfo.id,
				displayName:this.displayName,
			}
			userApi.updateUser(this.detailInfo.id, data).then(res => {
				if (res.status == 200) {
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
				id:this.detailInfo.id,
				phone:this.phone,
			}
			userApi.updateUser(this.detailInfo.id, data).then(res => {
				if (res.status == 200) {
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
			let data = {
				id:this.detailInfo.id,
				password:this.password,
			}
			userApi.updateUser(this.detailInfo.id, data).then(res => {
				if (res.status == 200) {
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
		getNameByAction(action){


		},
		detailView(object){
			this.action=[];
			this.nameObject =[];
			this.menuTitle = object;
			let listObject = Object.keys(this.listActionAndObj)
            for (let i = 0; i < listObject.length; i++) {
                 if(listObject[i]==object){
					 for(let j=0; j<this.listActionAndObj[object].length;j++){
						 this.action.push(this.listActionAndObj[object][j].action);
						 this.nameObject.push({
							 name:this.listActionAndObj[object][j].name,
							 action: this.listActionAndObj[object][j].action,
							 });
					 }
				 }
            };
		},
		getMenuTitle(object){
			return object;

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
		}
          
    },
    created(){
		
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
	.sym-stepper-content .v-tab{
		font-size: 13px;
	}

	.sym-stepper-content{
		padding-top: 0;
	}
	.content-orgchart-selected{
		background: white;
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		/* padding-bottom: 8px; */
	}
	.content-orgchart-resize{
		overflow: hidden;
		border-top: 2px solid #888;
		margin: 8px 0;
	}
	.tree-orgchart-content{
	    height: 100%;
	}
	.tree-orgchart-content .sym-small-size{
	    height: calc(100% - 50px);
		overflow: auto;
	}
	.label-root-org{
		font-size: 14px;
		color: #797979;
		font-weight: 600;
	}
	.lb-last-name{
		display: inline-flex;
	}
	.input-password{
		height: 30px;
		margin-top: -8px;
	}

	.autocomplete-package-item{
		padding: 0;
		min-height: 40px;
	}
</style>
