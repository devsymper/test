<template>
	<div class="w-100 h-100">
		<div class="d-flex w-100 mt-1">
			<span class="fs-15 font-weight-bold"> Chọn ứng dụng:</span>
			<ListItemSelector
				:listItem='allApp'
				@item-selected="handleItemSelected"
				@list-item-selected="handleListItemSelected"
				:values="listApp"
			 />
		</div>
		<div class="d-flex w-100 mr-2 children-application">
			<ObjectInApplication 
				:idApplication="selectedApplication"
				:tableDataDefinition="tableDataDefinition"
				:commonTableSetting="commonTableSetting"
				@app-detail-get="translateAppObjectIdToTableData"
			/>
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
import {uiConfigApi} from "@/api/uiConfig";
import ObjectInApplication from "./../actionPackPanel/ObjectInApplication"
export default {
	data(){
		return {
			active: "",
			selectedApplication: "",
			allApp:[],
			values:[],
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
	props:{
		listApp:{
			type: Array,
			default(){
				return []
			}
		},
		tableDataDefinition:{
		},
		commonTableSetting:{
		}
	},
	components:{
		ListItemSelector,
		OrgchartSelector,
		ObjectInApplication
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
		},
		translateAppObjectIdToTableData(data){
			this.$emit( 'app-detail-get', data)
		},
		handleListItemSelected(lists){
			this.$emit('list-item-selected' , lists)
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
	},
	watch:{
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