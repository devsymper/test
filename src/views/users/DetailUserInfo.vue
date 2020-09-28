<template>
	<div class="h-100">
		<div class="h-100" >
			<div class="h-100">
				<v-stepper v-model="stepper" class="d-flex stepper-create-user">
				<v-stepper-items class="stepper-items">
					<v-stepper-content step="1">
					<h4>{{ $t('user.general.personalInfo.title')}}</h4>
					<v-row class="mt-1" >
						<!-- thong tin -->
						<v-col cols="8">
							<v-row>
								<v-col cols="6">
									<span style="font-weight:430" class="fs-13 st-icon-pandora">
												Họ tên
									</span>
								</v-col>
								<v-col  cols="6">
									<span  class="fs-13 st-icon-pandora">
												{{detailInfo.lastName}}	{{' '+ detailInfo.firstName}}
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
											{{detailInfo.displayName}}
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
									    {{detailInfo.phone}}
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
									    {{detailInfo.status}}
                                    </span>
								</v-col>
						    </v-row>
						</v-col>
						<!-- kt thong tin -->
						<!-- ảnh -->
						<v-col cols="4">
								<v-col cols="3" class="text-center ">
								<v-avatar :size="80" >
									<img v-if="avatarUrl != ''"
										:src="avatarUrl"
									>
									<img v-if="avatarUrl== ''"
										:src="require('./../../assets/image/avatar_default.jpg')"
									>
								</v-avatar>
				
								<UploadFile 
									style="margin-top:-30px; margin-left:50px"
									ref="uploadAvatar"
								
									:autoUpload="false"
									:fileName="avatarFileName"
								 />
							</v-col>
						</v-col>	
						<!-- ket thuc anh -->
					</v-row>
			
					</v-stepper-content>
				</v-stepper-items>
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
import { str } from "./../../plugins/utilModules/str.js";
import avatarDefault from "@/assets/image/avatar_default.jpg";
import VueResizable from 'vue-resizable'
import UploadFile from "./../../components/common/UploadFile";
import { appConfigs } from '../../configs';
let heighOrgchart = 0;
export default {
	components:{
		"vue-resizable":VueResizable,
        "v-change-password":ChangePassword,
        UploadFile
	},
	props:
        ['detailInfo'],
	computed: {
        sapp() {
            return this.$store.state.app;
        },
    },
	data(){
		return {
			showPassPanel:false,
			test:true,
            avatarFileName: '',
            avatarUrl: '',
			user:{	
				id:'', 
				firstName:'', 
				lastName:'', 
				displayName:'', 
				userName:' ', 
				email:' ', 
				password:null, 
				phone:'', 
				active:true
			},
			url: avatarDefault,
			stepper: 1,
			editStep: false,
			loader: null,
			loading: false,
			actionPanel : this.$t('user.other.createUser'),
			enabledPassword:false,
			autoRenPassword:true,
			needChangePassword : true,
			sendMailAfterChange : true,
			tabIndex:0,
			permissionPackage: {
				title:'package',
				listPermission:[],
				permissionSelected:[]
			},
			permissionSelected : [],
			permissionPosittionOrgChart : {
				title:'vị trí orgchart',
				listNode:[],
				noteSelected:[]
			},
			listNodesOrgChart : [],
			positionOrgchartSelected : [],
			userRole : {
				title:'Loại User',
				listUserRole:['User','Business'],
				userRoleSelected:''
			},
			showPass: false,
			rules: {
				required: value => !!value || this.$t('validate.required'),
				min: v => (typeof v != 'undefined' && v != undefined && v.length >= 8) || this.$t('validate.min_8'),
				max: v => (typeof v != 'undefined' && v != undefined && v.length < 25) || this.$t('validate.max_24'),
				email: value => {
					const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					return pattern.test(value) || this.$t('validate.email');
				},
				password:value => {
					const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?).{8,}$/
					return pattern.test(value) || this.$t('validate.notValid');
				},
			},
			formHasErr : true,
			search: {
				name:''
			},
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
