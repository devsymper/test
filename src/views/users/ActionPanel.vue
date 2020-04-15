<template>
	<div class="h-100">
		<div class="h-100" v-if="!isSettingPasswordView">
			<div class="h-100">
				<h2 class="header-title" v-if="actionType == 'add'">Tạo User</h2>
				<h2 class="header-title" v-if="actionType == 'edit'">Cập nhật User</h2>
				<v-stepper v-model="stepper" class="d-flex stepper-create-user">
				<v-stepper-header class="stepper-header">
					<v-stepper-step  editable step="1">Thông tin chung</v-stepper-step>
					<v-stepper-step :editable="editStep" @click="loadPermission()" step="2">Phân quyền</v-stepper-step>
				</v-stepper-header>

				<v-stepper-items class="stepper-items">
					<v-stepper-content step="1">
					<h2>Thông tin cá nhân</h2>

						<v-row class="mt-2">
						<v-col cols="3">
							<div>
								<v-subheader>Tên tài khoản</v-subheader>
							</div>
							<div>
								<v-subheader>Email</v-subheader>
							</div>

						</v-col>

						<v-col cols="6">
							<v-row>
									<v-col cols="9">
										<v-text-field
											ref="userName"
											required
											:rules="[rules.required]"
											v-model="user.userName"
											dense
										></v-text-field>
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="9">
										<v-text-field
										ref="email"
										v-model="user.email"
										:rules="[rules.required, rules.email]"
										dense
										></v-text-field>
									</v-col>
								</v-row>
						</v-col>
						<v-col cols="3">
							<div id="preview" @click="triggerClickAddAvatar()">
							<img :src="url" />
							</div>
							<input type="file" ref="btnAddAvatar" class="input-file" @change="onFileChange" />
						</v-col>
						</v-row>
						<v-row >
						<v-col cols="3">
							<v-subheader>Tên</v-subheader>
						</v-col>
						<v-col cols="4">
							<v-text-field
							v-model="user.firstName"
							dense
							></v-text-field>
						</v-col>
						<v-col cols="1">
							<v-subheader>Họ</v-subheader>
						</v-col>
						<v-col cols="4">
							<v-text-field
							v-model="user.lastName"
							dense
							></v-text-field>
						</v-col>
						</v-row>
						<v-row>
						<v-col cols="3">
								<v-subheader>Tên hiển thị</v-subheader>
							</v-col>
							<v-col cols="9">
								<v-text-field
									v-model="user.displayName"
									dense
								></v-text-field>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="3">
								<v-subheader>Số điện thoại</v-subheader>
							</v-col>
							<v-col cols="9">
								<v-text-field
								v-model="user.phone"
								dense
								></v-text-field>
							</v-col>
						</v-row>

						<div v-if="actionType == 'add'">
							<h2 class="setting-password">Tùy chọn mật khẩu</h2>
							<v-checkbox dense class="sym-small-size" v-model="autoRenPassword" @click="enabledPassword = !enabledPassword" :label="`Tạo mật khẩu tự động`"></v-checkbox>
							<v-row>
								<v-col cols="4">
									<v-checkbox dense class="sym-small-size" v-model="enabledPassword" @click="autoRenPassword = !autoRenPassword" :label="`Mật khẩu của bạn`"></v-checkbox>
								</v-col>
								<v-col cols="8">
									<v-text-field
									ref="password"
									v-model="user.password"
									:disabled="!enabledPassword"
									dense
									:append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
									:rules="[rules.required, rules.min, rules.max]"
									:type="showPass ? 'text' : 'password'"
									counter
									@click:append="showPass = !showPass"
									></v-text-field>
								</v-col>
							</v-row>
							<v-checkbox dense class="sym-small-size" v-model="needChangePassword" :label="`Yêu cầu người dùng này thay đổi mật khẩu khi họ đăng nhập lần đầu`"></v-checkbox>
							<v-checkbox dense class="sym-small-size" v-model="sendMailAfterChange" :label="`Gửi mật khẩu trong email sau khi hoàn thành`"></v-checkbox>
							<v-checkbox dense class="sym-small-size" v-model="user.active" :label="`Kích hoạt tài khoản`"></v-checkbox>
						</div>

						
					<v-btn class="btn-next-step"
						ref="addUserBtn"
						:loading="loading"
						:disabled="loading"
						@click="loader = 'loading'"
					>
						{{actionPanel}}
					</v-btn>

					</v-stepper-content>

					<v-stepper-content class="sym-stepper-content" step="2">
					<v-tabs
						v-model="tabIndex"
						background-color="transparent"
						color="basil"
						:grow="true"
						
					>
						<v-tab
						:key="userRole.title"
						>
						{{ userRole.title }}
						</v-tab>
						<v-tab
						:key="permissionPackage.title"
						>
						{{ permissionPackage.title }}
						</v-tab>
						<v-tab
						:key="permissionPosittionOrgChart.title"
						>
						{{ permissionPosittionOrgChart.title }}
						</v-tab>
						
					</v-tabs>

					<v-tabs-items  v-model="tabIndex">
						<v-tab-item
						:key="userRole.title"
						>
							<template>
								<v-combobox
									class="mt-4"
									:items="userRole.listUserRole"
									v-model="userRole.userRoleSelected"
									multiple
									label="Chọn loại user"
									outlined
									dense
									hide-selected
									chips
									small-chips
									>
								</v-combobox>
							</template>
						</v-tab-item>
						<v-tab-item
						:key="permissionPackage.title"
						>
						<v-autocomplete
							class="mt-2"
							:items="permissionPackage.listPermission"
							v-model="permissionSelected"
							dense
							outlined
							multiple
							hide-selected
							hide-details
							clearable
							chips
							small-chips
							item-text="packName"
						>

							<!-- <template v-slot:selection="dataPackage">
							{{dataPackage.item.packName}}
							</template> -->
							<template v-slot:item="dataPackage">
							<v-list-item-content @click="selectPermissionPackage(dataPackage.item)">
								<v-list-item-title >{{ dataPackage.item.packName }}</v-list-item-title>
							</v-list-item-content>
							</template>
						</v-autocomplete>
						<div>
								<v-list dense>
									<v-list-item
										class="permission-item"
										v-for="permission in permissionPackage.permissionSelected"
										:key="permission.id"
									>

									<v-list-item-content>
										<v-list-item-title>{{ permission.packName }}</v-list-item-title>
									</v-list-item-content>
									<v-list-item-icon @click="deletePackage(permission.id)">
										<v-tooltip top>
											<template v-slot:activator="{ on }">
												<v-icon v-on="on">mdi-delete</v-icon>
											</template>
											<span>Xóa</span>
										</v-tooltip>
									</v-list-item-icon>


								</v-list-item>
							</v-list>
						</div>
						</v-tab-item>

						<v-tab-item
						:key="permissionPosittionOrgChart.title"
						>
						
							<template>
								<!-- <v-row>
									<v-col cols="4">
										<v-text-field
											class="mt-2"
											v-model="search"
											dense
											outlined
											hide-details
											clearable
										></v-text-field>
									</v-col>
									<v-col cols="8">

									</v-col>
								</v-row> -->
								
								
								<vue-resizable class="content-orgchart-resize mt-2" 
									@mount="resizeOrgChartView" 
									@resize:end="afterResizeOrgChartView" 
									@resize:start="beforeResizeOrgChartView" 
									:height="`auto`" :min-height="50" :max-height="200" :width="500" :active="['b']" :fit-parent="true">
									<div class="content-orgchart-selected">
										<v-list dense>
											<v-list-item
												class="permission-item"
												v-for="org in positionOrgchartSelected"
												:key="org.id"
												>
												<v-list-item-content>
													<v-list-item-title>{{ org.name }}</v-list-item-title>
													<v-list-item-subtitle>{{ org.source }}</v-list-item-subtitle>
												</v-list-item-content>
												<v-list-item-icon @click="deletePosition(org)">
													<v-tooltip top>
														<template v-slot:activator="{ on }">
															<v-icon v-on="on">mdi-delete</v-icon>
														</template>
														<span>Xóa</span>
													</v-tooltip>
												</v-list-item-icon>
											</v-list-item>
										</v-list>
									</div>
								</vue-resizable>
								<div class="tree-orgchart-content">
									<v-autocomplete
										class="mt-2"
										v-model="search"
										dense
										:items="listNodesOrgChart"
										item-value="name"
										item-text="name"
										outlined
										hide-details
										clearable
									>
										<template v-slot:item="position">
											<v-list-item-content @click="addOrgchartPosition(position.item,'autocomplete')">
												<v-list-item-title >{{ position.item.name }}</v-list-item-title>
												<v-list-item-subtitle>{{ position.item.source }}</v-list-item-subtitle>
											</v-list-item-content>
										</template>
									</v-autocomplete>
									<v-treeview 
									:items="permissionPosittionOrgChart.listNode" 
									dense
									open-all
									:search="search"
									class="sym-small-size mt-2">
										<template v-slot:label="props">
											<div class="treeCheckBox" @click="addOrgchartPosition(props.item,'treeview')">
												<label v-if="props.item.id_node == 'general'" class="treeCheckBox label-root-org"
													>{{props.item.name}}
												</label> 
												<v-checkbox v-else class="treeCheckBox"
													v-model="props.item.selected"
													:label="props.item.name">
												</v-checkbox> 
											</div>
										</template>
									</v-treeview>
								</div>
							</template>
						</v-tab-item>
						
					</v-tabs-items>



					<v-btn class="btn-next-step"
						@click="resetData();closePanel()"
					>
						Hoàn thành
					</v-btn>

					</v-stepper-content>
				</v-stepper-items>
				</v-stepper>
			</div>
		</div>
		<div class="h-100" v-else>
			<v-change-password
				:user="user"
			>
			</v-change-password>
			
		</div>
	</div>
	
</template>
<script>
import ChangePassword from "./../../views/users/ChangePass.vue";
import { userApi } from "./../../api/user.js";
import { permissionPackageApi } from "./../../api/PermissionPackage.js";
import { permissionPositionOrgchartApi } from "./../../api/PermissionPositionOrgchart.js";
import { orgChartApi } from "./../../api/OrgChart.js";
import { str } from "./../../plugins/utilModules/str.js";
import avatarDefault from "./../../assets/image/avatar_default.jpg";
import VueResizable from 'vue-resizable'
let heighOrgchart = 0;
export default {
	components:{
		"vue-resizable":VueResizable,
		"v-change-password":ChangePassword
	},
	props:{
		actionType:{    // type là add hay update hay detail user
			type: String,
			default: "add"
		},
		isSettingPasswordView:{
			type: Boolean,
			default: false
		}

	},
	data(){
		return {
			user:{id:'', firstName:'', lastName:'', displayName:'', userName:' ', email:' ', password:null, phone:'', active:true},
			url: avatarDefault,
			stepper: 1,
			editStep: false,
			loader: null,
			loading: false,
			actionPanel : 'Tạo User',
			enabledPassword:false,
			autoRenPassword:true,
			needChangePassword : true,
			sendMailAfterChange : true,
			tabIndex:0,
			permissionPackage: {title:'package',listPermission:[],permissionSelected:[]},
			permissionSelected : [],
			permissionPosittionOrgChart : {title:'vị trí orgchart',listNode:[],noteSelected:[]},
			listNodesOrgChart : [],
			positionOrgchartSelected : [],
			userRole : {title:'Loại User',listUserRole:['User','Business'],userRoleSelected:''},
			showPass: false,
			rules: {
				required: value => !!value || 'Không được bỏ trống.',
				min: v => (typeof v != 'undefined' && v != undefined && v.length >= 8) || 'Yêu cầu mật khẩu lớn hơn 8 kí tự',
				max: v => (typeof v != 'undefined' && v != undefined && v.length < 25) || 'Yêu cầu mật khẩu ít hơn 24 kí tự',
				email: value => {
					const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					return pattern.test(value) || 'Email không hợp lệ';
				},
			},
			formHasErr : true,
			search: null,
		}
 	},
  	watch: {
		loader () {
			if(this.loader == 'loading'){
				this.loading = true;
				this.validateForm();
			}
		},
		formHasErr(){
			if(this.formHasErr){
				this.loading = false;
				this.loader = null;
				this.formHasErr = !this.formHasErr;
			}
		},
		actionType(){
			this.actionPanel = this.actionType
			if(this.actionType == 'add') {
				this.resetData();
				this.editStep = false;
				this.actionPanel = "Tạo User";
			}
			if(this.actionType == 'edit') {
				this.formHasErr = false;
				this.editStep = true;
				this.actionPanel = "Cập nhật User";
			}
		}
  	},
  
  	methods:{
		handleResize ({ width, height }) {
			console.log('resized', width, height)
		},
		resetPermissionPosittionOrgChart(){
			this.permissionPosittionOrgChart = {title:'vị trí orgchart',listNode:[],noteSelected:[]}
		},
		setStepper(step){
			this.stepper = step;
		},
		setUser(user){
			this.user = user;
			if(user.avatar != null && user.avatar != ""){
				this.url = user.avatar;	  
			}
		},
		actionUser(){
			if(this.actionType == 'add'){
				this.addNewUser()
			}
			else if(this.actionType == 'edit'){
				this.editUser()
			}
		},
		resetValidate(){
			this.$refs.userName.reset();
			this.$refs.email.reset();
			if(this.$refs.password){
				this.$refs.password.reset();
			}
		},
		/**
		 * Hoangnd: 14/4/2020
		 * Hàm check validate các trường input   (password, email, user name)
		 
		 */
		validateForm(){
			this.formHasErr = false;
			let validUserName = this.$refs.userName.validate(true);
			let validEmail = this.$refs.email.validate(true);
			if(validUserName && validEmail){
				if(this.enabledPassword){
					if(this.$refs.password.validate(true))
						this.actionUser();
					else{
						this.formHasErr = true;
					}
				}
				else{
					this.actionUser();
				}
			}
			else{
				this.formHasErr = true;
			}
			return this.formHasErr;
		},
		selectPermissionPackage(perPackage){
			let currentPackage = this.permissionPackage.permissionSelected.find(x => x.id === perPackage.id);
			if(currentPackage == undefined && typeof currentPackage == 'undefined'){
				this.addUserToPackage(this.user.id,perPackage.id,perPackage.packName);
			}
		},
		/**
		 * Hoangnd: 14/4/2020
		 * Hàm thêm user vào package 
		 * @param Int packId: id của package cần thêm cho user
		 * @param String packTitle: tên của package (hiển thị lên phần mô tả các package đã chọn)
		 */
		addUserToPackage(userId,packId,packTitle){
			permissionPackageApi.addUserToPackage({userId:userId,packId:packId}).then(res => {
				if (res.status == 200) {
					this.permissionPackage.permissionSelected.push({id:packId,packName:packTitle});
					
				}
			})
			.catch(err => {
				console.log("error from add user api!!!", err);
			})
			.always(() => {
			});
		},

		/**
		 * Hoangnd: 14/4/2020
		 * Hàm xóa package của 1 user 
		 * @param Int packId: id của package cần xóa 
		 */
		deletePackage(packId){
			userApi.deleteUserPackage({userId:this.user.id,packId:packId}).then(res => {
				if (res.status == 200) {
				let currentPackage = this.permissionPackage.permissionSelected.find(x => x.id === packId);
				var index = this.permissionPackage.permissionSelected.indexOf(currentPackage);
				this.permissionPackage.permissionSelected.splice(index,1);
				}
			})
			.catch(err => {
				console.log("error from add delete api!!!", err);
			})
			.always(() => {

			});
		},

		/**
		 * Hoangnd: 14/4/2020
		 * Hàm tạo mới user
		 */
		addNewUser(){
			const cpn = this;
			let passProps = {
				needChange:this.needChangePassword,
				dueDate:""
			}
			let password = (this.autoRenPassword) ? this.generatePassword() : this.user.password;
			let avatar = (this.url != avatarDefault) ? this.url : '';
			let data = {
				email:this.user.email,firstName:this.user.firstName,lastName:this.user.lastName,
				userName:this.user.userName,displayName:this.user.displayName,
				phone:this.user.phone,status:this.user.active, password: password,
				passwordProps: JSON.stringify(passProps),
				avatar : avatar,
				sendMail:this.sendMailAfterChange
			}
			userApi.addUser(data).then(res => {
				if (res.status == 200) {
					cpn.loadPermission();
					cpn.setStepper(2);
					cpn.loading = false;
					cpn.editStep = true;
					cpn.loader = null;
					let status = (data.status == 1 || data.status == true) ? 'Đang mở' : 'đã khóa'
					let date = new Date();
					cpn.user.id = res.data.id;
					//phat lai sự kiện thêm item vào list
					cpn.$emit("refresh-new-user", {
						id:res.data.id,firstName:data.firstName,displayName:data.displayName,email:data.email,phone:data.phone,status:status,createAt:str.formatDate(date),updateAt:str.formatDate(date)
					});
				}
				else{
					cpn.loading = false;
					cpn.loader = null;
				}
			})
			.catch(err => {
				console.log("error from add user api!!!", err);
			})
			.always(() => {

			});
		},

		/**
		 * Hoangnd: 14/4/2020
		 * Hàm update user
		 */
		editUser(){
			const cpn = this;
			let passProps = {
				needChange:this.needChangePassword,
				dueDate:""
			}
			// let password = (this.autoRenPassword) ? this.generatePassword() : this.user.password;
			let avatar = (this.url != avatarDefault) ? this.url : '';
			let data = {
				id:this.user.id,
				email:this.user.email,firstName:this.user.firstName,lastName:this.user.lastName,
				userName:this.user.userName,displayName:this.user.displayName,
				phone:this.user.phone,
				passwordProps: JSON.stringify(passProps),
				avatar : avatar
			}
			userApi.updateUser(data).then(res => {
				if (res.status == 200) {
					cpn.loading = false;
					cpn.loader = null;
					let status = (data.status == 1 || data.status == true) ? 'Đang mở' : 'đã khóa'
					cpn.$emit("refresh-data");
				}
			})
			.catch(err => {
				console.log("error from add user api!!!", err);
			})
			.always(() => {

			});
		},

		/**
		 * Hoangnd: 14/4/2020
		 * Hàm load phân quyền khi edit phân quyền user
		 */
		loadPermission(){
			this.getPackage();
			this.getUserPackage();
			this.getAllOrgChart();
		
		},
		/**
		 * Hoangnd: 14/4/2020
		 * Hàm lấy danh sách các package
		 */
		getPackage(){
			if(this.permissionPackage.listPermission.length == 0){
				permissionPackageApi.getAllPackage(20).then(res => {
					if (res.status == 200) {
						this.permissionPackage.listPermission = res.data.data
					}
				})
				.catch(err => {
					console.log("error from get pack api!!!", err);
				})
				.always(() => {

				});
			}
		},
		/**
		 * Hoangnd: 14/4/2020
		 * Hàm lấy các package hiện tại của user
		 */
		getUserPackage(){
			userApi.getListUserPackage(this.user.id).then(res => {
				if (res.status == 200) {
					this.permissionPackage.permissionSelected = res.data;
					this.permissionSelected = res.data;
				}
			})
			.catch(err => {
				console.log("error from get pack api!!!", err);
			})
			.always(() => {

			});
		},
		/**
		 * hoangnd:14/4/2020
		 * Hàm lấy danh sách của tất cả orgchart
		 */
		getAllOrgChart(){
			if(this.permissionPosittionOrgChart.listNode.length == 0){
				orgChartApi.getAllNodes().then(res => {
					if (res.status == 200) {
						let treeData = res.data;
						this.permissionPosittionOrgChart.listNode = treeData
						
						this.getUserPositionOrgchart();
					}
				})
				.catch(err => {
					console.log("error from get orgchart api!!!", err);
				})
				.always(() => {

				});
			}
		},

		/**
		 * hoangnd: 14/4/2020
		 * Hàm thêm user vào vị trí của org chart để phân quyền
		 */
		addOrgchartPosition(org,from){
			if(from == 'autocomplete'){
				org.selected = true;
			}
			if(org.selected == true){
				permissionPositionOrgchartApi.addUserToPosition({userId:this.user.id,positionId:org.id_node}).then(res => {
					if (res.status == 200) {
						this.positionOrgchartSelected.push(org);
					}
				})
				.catch(err => {
					console.log("error from add user api!!!", err);
				})
				.always(() => {
				});
			}
			else{
				this.deletePosition(org);
			}
		},

		/**
		 * Hoangnd: 14/4/2020
		 * hàm đưa danh sách các node của orgchart về dạng hiển thị cho treeview
		 * @param Array listNodes: danh sách các orgchart
		 */
		setDataOrgchartTotreeView(listNodes,listPosition){
			for (let index = 0; index < listNodes.length; index++) {
				let orgName = listNodes[index].name;
				let listChild = listNodes[index].children;
				this.listNodesOrgChart = this.listNodesOrgChart.concat(listChild);
				this.checkSelectedPosition(listPosition,listNodes[index]);
				var map = {}, node, roots = [], i;
				for (i = 0; i < listChild.length; i ++ ) {
					map[listChild[i].id_node] = i; // initialize the map
					listChild[i].children = []; // initialize the children
				}
				for (i = 0; i < listChild.length; i ++ ) {
					node = listChild[i];
					if (node.id_parent_node !== "general") {
						node.source = listChild[map[node.id_parent_node]].source + " / " +listChild[map[node.id_parent_node]].name;
						listChild[map[node.id_parent_node]].children.push(node);
					} else {
						node.source = orgName;
						roots.push(node);
					}
					this.checkSelectedPosition(listPosition,node);
				}
				this.permissionPosittionOrgChart.listNode[index].children = roots;
			}
			
		},
		checkSelectedPosition(listPosition,position){
			let newList = listPosition.filter(node=>{
				return  node.root_id == position.root_id && node.id_parent_node == position.id_parent_node && node.id_node == position.id_node;
			})
			if(newList.length > 0)
				this.positionOrgchartSelected = this.positionOrgchartSelected.concat(position);
		},
		/**
		 * hoangnd : 15/4/2020
		 * Hàm check các checkbox của sơ đồ orgchart treeview khi mới load position permission của 1 user 
		 */
		// setPositionOrgchartSelected(listPosition){
		// 	let listNode = this.permissionPosittionOrgChart.listNode 
		// 	let newListPositionSelected = [];
		// 	for( let i = 0; i< listNode.length; i++){
		// 		let newList = listPosition.filter(node=>{
		// 			return  node.root_id == listNode[i].root_id;
		// 		})
		// 		newListPositionSelected = newListPositionSelected.concat(newList);
				
		// 	}
		// 	this.positionOrgchartSelected = newListPositionSelected;
		// },
		/**
		 * hoangnd 15/4/2020
		 * hàm lấy các position được phân quyền cho user
		 * sau đó gán lại giá trị selected checkbox cho treeview
		 */
		
		getUserPositionOrgchart(){
			if(this.user.id != '' && this.user.id != null){
				userApi.getListUserPosition(this.user.id).then(res => {
					if (res.status == 200) {
						let listNode = this.permissionPosittionOrgChart.listNode;
						// lặp check các root
						// this.setPositionOrgchartSelected(res.data);
						for (let index = 0; index < listNode.length; index++) {
							let node = listNode[index];
							let newA = res.data.filter(n => {
								return n.id == node.id && n.root_id == node.root_id && n.id_orgchart == node.id_orgchart && n.id_node == node.id_node 
							})
							this.permissionPosittionOrgChart.listNode[index].selected = false
							if(newA.length > 0){
								this.permissionPosittionOrgChart.listNode[index].selected = true;
							}
							let children = node.children;
							// lặp check các children 
							for(let i = 0; i < children.length; i++){
								let childNode = children[i];
								let newArr = res.data.filter(n => {
									return n.id == childNode.id && n.root_id == childNode.root_id && n.id_node == childNode.id_node 
								})
								this.permissionPosittionOrgChart.listNode[index].children[i].source = "";
								this.permissionPosittionOrgChart.listNode[index].children[i].selected = false;
								if(newArr.length > 0){
									this.permissionPosittionOrgChart.listNode[index].children[i].selected = true;
								}
								
							}
						}
						this.setDataOrgchartTotreeView(this.permissionPosittionOrgChart.listNode,res.data)
					}
				})
				.catch(err => {
					console.log("error from get pack api!!!", err);
				})
				.always(() => {

				});
			}
			
		},
		/**
		 * Hàm xóa user ra khỏi vị trí của org chart
		 * @param Object org : org cần xóa
		 */
		deletePosition(org){
			userApi.deleteUserPosition({userId:this.user.id,positionId:org.id_node}).then(res => {
				if (res.status == 200) {
					let currentPosition = this.positionOrgchartSelected.find(x => x.id === org.id);
					var index = this.positionOrgchartSelected.indexOf(currentPosition);
					this.positionOrgchartSelected.splice(index,1);
				}
			})
			.catch(err => {
				console.log("error from add delete api!!!", err);
			})
			.always(() => {

			});
		},

		/**
		 * hoangnd : 10/4/2020
		 * Hàm tạo mật khẩu tự động
		 */
		generatePassword() {
			var result      = '';
			var upperCharacters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			var lowerCharacters  = 'abcdefghijklmnopqrstuvwxyz';
			let number      = "0123456789";
			var charactersLength = upperCharacters.length;
			for ( var i = 0; i < 6; i++ ) {
				result += upperCharacters.charAt(Math.floor(Math.random() * charactersLength));
				result += lowerCharacters.charAt(Math.floor(Math.random() * charactersLength));
			}
				result += number.charAt(Math.floor(Math.random() * number.length));
				result += number.charAt(Math.floor(Math.random() * number.length));
			return result;
		},
		resetData(){
			this.user = {id:'', firstName:'', lastName:'', displayName:'', userName:'', email:'', password:'', phone:'', active:true},
			this.stepper = 1,
			this.url = avatarDefault,
			this.loader = null,
			this.loading = false,
			this.actionPanel = 'Tạo User',
			this.enabledPassword =false,
			this.autoRenPassword =true,
			this.needChangePassword  = true,
			this.sendMailAfterChange  = true,
			this.tabIndex = 0,
			this.permissionPackage = {title:'Phân quyền theo package',listPermission:[],permissionSelected:[]},
			this.permissionPosittionOrgChart = {title:'Phân quyền theo vị trí',listNode:[],noteSelected:[]},
			this.userRole = {title:'Loại User',listUserRole:['User','Business'],userRoleSelected:''},
			this.showPass = false,
			this.formHasErr = true,
			this.search = null
		},

		closePanel(){
			this.resetValidate();
			this.$emit("close-panel",{});
			this.setStepper(1);
		},
		/**
		 * Hoangnd : 10/4/2020
		 * Hàm upload avatar user 
		 */
		//chon avatar -> preview
		onFileChange(e) {
			let thisCpn = this;
			const file = e.target.files[0];
			var formData = new FormData();
			var type = file.type;
			var match = ["image/gif", "image/png", "image/jpg", "image/jpeg"];
			//kiểm tra kiểu file
			if (type == match[0] || type == match[1] || type == match[2] || type == match[3]) {
				formData.append('file', file);
				formData.append('userId', 0);
				userApi.uploadAvatar(formData).then(res => {
					if (res.Status == 1) {
						thisCpn.url = "https://kh.symper.vn/"+res.Data.path
					}
				})
				.catch(err => {
					console.log("error from upload avatar api!!!", err);
				})
				.always(() => {

				});
			}
		},
		triggerClickAddAvatar(){
			this.$refs.btnAddAvatar.click();
		},
		resizeOrgChartView(data){
			var h = $('.tree-orgchart-content').height();
			var pH = $('.v-tabs-items').height();
			$('.tree-orgchart-content').css({height:pH - data.height - 60});
		},
		beforeResizeOrgChartView(data){
			this.heighOrgchart = data.height;
		},
		afterResizeOrgChartView(data){
			var h = $('.tree-orgchart-content').height();
			var pH = $('.v-tabs-items').height();
			$('.tree-orgchart-content').css({height:pH - data.height - 60});
		},
		
	
  	}
}

</script>
<style scoped>
	.stepper-header{
		width: 230px;
		height: auto;
		display: block;
		border-right: 1px solid #eaeaea;
		box-shadow: none;
	}
	.stepper-items{
		width: calc(100% - 230px);
	}
	.stepper-items .row .col{
		padding: 0 12px;
	}
	.stepper-header .v-stepper__step{
		height: 30px;
		margin: 10px;
		padding: 20px;
	}
	.stepper-header .v-stepper__step--active{
		background: #f2f2f2;
		border-radius: 4px;
	}
	.v-stepper__content{
		height: 100%;
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
	/* .sym-stepper-content .v-stepper__wrapper .row .col{
		padding: 0 12px;
	}
	*/
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
		height: 80px;
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
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
		/* padding-bottom: 8px; */
	}
	.content-orgchart-resize{
		overflow: hidden;
		border-bottom: 2px solid #888;
		margin: 8px 0;
	}
	.tree-orgchart-content{
	    height: 100%;
	}
	.tree-orgchart-content .sym-small-size{
	    height: 100%;
		overflow: auto;
	}
	.label-root-org{
		font-size: 14px;
		color: #797979;
		font-weight: 600;
	}
	
</style>
