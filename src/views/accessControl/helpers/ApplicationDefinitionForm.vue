<template>
	<div class="w-100 h-100">
		<div class="d-flex w-100">
			<span> Chọn ứng dụng:</span>
			<ListItemSelector
				:listItem='allApp'
				@item-selected="handleItemSelected"

			 />
		</div>
		<div class="d-flex w-100 mr-2 children-application">
			<div 
				v-for="(item,i) in childrenTypeOfApp"  
				:key="i" 
				class="p-2 title-children-application fs-13 w-100"
				@click="handleChildTypeClick(item.value)" 
				:class="{'title-children-application-active': active == item.value}"
			>
				<span style="margin-left:auto;margin-right:auto">
					{{item.title}}
				</span>
			</div>
		</div>
		<div>
			<OrgchartSelector 
				v-if="active == 'orgchart'" 
				:checkboxes="checkboxes"
				:selectedApplication="selectedApplication"
				@permission-selected="handlePermissionSelected"
			/>
		</div>
	</div>
  
</template>

<script>
import OrgchartSelector from "./OrgchartSelector"
import ListItemSelector from "./ListItemSelector.vue"
import {accessControlApi} from '@/api/accessControl'
import {appManagementApi} from '@/api/AppManagement.js'
export default {
	data(){
		return {
			active: "",
			selectedApplication: "",
			allApp:[],
			checkboxes:[],
			childrenTypeOfApp:[
				{
					title: "Văn bản",
					value: "document"
				},
				{
					title: "Báo cáo",
					value: "dashboard"
				},
				{
					title: "Quy trình",
					value: "workflow"
				},
				{
					title: "Orgchart",
					value: "orgchart"
				},

			]
		}
	},
	components:{
		ListItemSelector,
		OrgchartSelector
	},
	created(){
		this.getActiveApp()
	},
	methods:{
		handleChildTypeClick(value){
			this.active = value
		},
		handleItemSelected(value){
			this.selectedApplication = value
			appManagementApi.getAppDetailBa(value).then(res=>{
			}).catch(err=>{
			})
			
		},
		handlePermissionSelected(value){
			this.checkboxes = value
		},
		getActiveApp(){
			let self = this
			accessControlApi.getAllApp().then(res=>{
				if(res.status == 200){
					self.allApp = res.data.listObject
				}else{
					self.$snotify({
						type: "error",
						title: " Không thể lấy dữ liệu"
					})
				}
			}).catch(err=>{
				
			})
		}
	}

}
</script>

<style scoped>
.children-application{
	border: 1px solid lightgray;
}
.title-children-application{
	cursor: pointer;
	margin-left: auto;
	margin-right: auto;
}
.title-children-application:hover{
	background-color: #f7f7f7;
}
.title-children-application-active{
	background-color: #D2D2D2;
}
</style>