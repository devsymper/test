<template>
	<div class="d-flex flex-column user-role-orgchart fs-13 h-90">
		<div>
			Chỉnh sửa vai trò người dùng trong Orgchart
		</div>
		<span class="fs-12 font-weight-light">
			Kích chọn vị trí để gán permission
		</span>
		<div class="d-flex mt-4">
			<div class="list-department-orgchart pr-2 mr-2 h-100">
				Danh sách phòng ban
				<OrgchartElement
					:idOrgchart="idOrgchart"
					:height="'calc(100vh - 150px)'"
					@current-node="handleCurrentNodeClick"
				/>
			</div>
			<div >
				<div class="mb-2">
					Danh sách permission
				</div>
				<PermissionSelector
					:height="'calc(100vh - 350px)'"
					v-model="selectingNode.permissions"
					:disabled=" currentType =='department'"
				/>
			</div>
			 
		</div>
		<div>
			<v-btn
				small
				color="primary"
				@click="debounceSave"
				class="float-right mr-2"
			>
				<v-icon class="mr-2">mdi-content-save-outline</v-icon>
				Lưu
			</v-btn>
		</div>
	</div>
</template>
<script>
import PermissionSelector from "@/components/permission/PermissionSelector"
import OrgchartElement from './OrgchartElement'
import {accessControlApi} from "@/api/accessControl"
import { permissionApi } from '@/api/permissionPack';
import _debounce from "lodash/debounce";

export default {
	props:{
		idOrgchart:{
			type: String,
		}
	},
	components:{
		PermissionSelector,
		OrgchartElement
	},
	data(){
		return{
			selectingNode:[],
			currentType:"",
			listNode:{

			}
		}
	},
	methods:{
		handleCurrentNodeClick(id , type){
			let self = this
			self.currentType = type
			if(type == 'department'){
				self.selectingNode = {
					permissions:[]
				}
			}else{
				if(!self.listNode[id]){
					accessControlApi.getNodePermission(id).then(res=>{
						if(res.status == 200){
							let mapIdToPermission = this.$store.state.permission.allPermissionPack;
							let permissions = res.data.reduce((arr, el) => {
								if(mapIdToPermission[el.permissionPackId]){
									arr.push(mapIdToPermission[el.permissionPackId]);
								}
								return arr;
							}, []);
							let obj = {
								role_identifier:id,
								role_type:'orgchart',
								permissions: permissions,
								permission_id: []
							}
							self.listNode[id] = obj
							self.selectingNode = self.listNode[id]
						}
					}).catch(err=>{

					})
				}else{
					self.selectingNode = self.listNode[id]
				}
			}
			
		},
		debounceSave: _debounce(function(e){
			this.handleSaveClick()
		}, 300,this),
		handleSaveClick(){
			let permissions = []
			let self = this
			for(let i in this.listNode){
				self.listNode[i].permissions.forEach(function(e){
					self.listNode[i].permission_id.push(e.id)
				})
				delete self.listNode[i].permissions
				permissions.push(this.listNode[i])
			}
			let data = JSON.stringify(permissions)
			accessControlApi.savePermission(data).then(res=>{
				if(res.status == 200){
					self.$emit('close-form')
					self.$snotify({
						type: "success",
						title: "Gắn permissions thành công"
					})
				}else{
					self.$snotify({
						type: "error",
						title: "Có lỗi xảy ra"
					})
				}
			}).catch(err=>{
					self.$snotify({
						type: "error",
						title: err
					})
			})
		}
	},
	watch:{
		idOrgchart(val){
			this.listNode = []
			this.selectingNode = {
				permissions:[]
			}
			this.currentType = "department"
		}
	}
}
</script>

<style scoped>
.user-role-orgchart .list-department-orgchart{
	width: 350px;
	border-right: 1px solid lightgray;
}
</style>