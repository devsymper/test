<template>
  <div :class="{'d-flex flex-column w-100 h-100': true , 'fullscreen-mode':showSwitchBtn == false}">
	  <div class="d-flex align-center">
				<div class="ml-2 mt-2 " style="flex-grow:1">
					<h3>	
						Danh sách các quy trình con
					</h3>
				</div>
			
				<v-btn
					class="mr-2 white--text"
					v-if="showBtnAddCheckbox"
					depressed
					color="primary"
					small
					@click="addCheckBoxColumn"
				>
					 Chọn
				</v-btn>
				<v-btn
					class="mr-2 white--text"
					depressed
					color="error"
					small
					:disabled="disableBtn"
					@click="confirmDelete"
				>
					Xóa
				</v-btn>
				<v-btn
					class="mr-2 white--text"
					depressed
					color="orange"
					small
					:disabled="disableBtn"
					@click="stopProcessInstance"
				>
					Tạm dừng
				</v-btn>
				<v-btn
					:class="{'mr-2 white--text':true, 'mr-8':showSwitchBtn == false}"
					depressed
					color="success"
					small
					:disabled="disableBtn"
					@click="activeProcessInstance"
				>
				Chạy
				</v-btn>
				
				 <v-tooltip bottom v-if="showSwitchBtn">
     				 <template v-slot:activator="{ on, attrs }">
						<v-btn 
							icon 
							tile  
							v-bind="attrs"
          					v-on="on"
							class="mr-3 white--text"
							color="primary"
							small
							@click="switchFullScreen"
							>
							<v-icon small>
								mdi-monitor-share
							</v-icon>
						</v-btn>
					</template>
					<span>Xem toàn màn hình</span>
				</v-tooltip>	
		</div>
			<ListItems 
				ref="listWorkFlow"
				:pageTitle="'Danh sách các quy trình con'"
				:showButtonAdd="false"
				:getDataUrl="apiUrl"
				:showExportButton="false"
				:showImportButton="false"
				:useDefaultContext="false"
				:useWorkFlowHeader="true"
				:customAPIResult="customAPIResult"
				:containerHeight="containerHeight"
				:headerPrefixKeypath="'admin.table'"
				:tableContextMenu="tableContextMenu"
				:showToolbar="false"
				:isTablereadOnly="false"
				@after-selected-row="afterSelectedRow"
				:showImportHistoryBtn="false"
				:showPagination="false"
				:showActionPanelInDisplayConfig="false"
			/>
		<ConfirmDelete 
			:showDialog="showDialog"
			@cancel="cancel"
			@confirm="deleteProcessInstance"
			 />
  </div>
</template>

<script>
import ConfirmDelete from "./ConfirmDelete"
import { util } from "@/plugins/util.js";
import { appConfigs } from "./../../configs.js";
import {adminApi} from '@/api/Admin.js'
import {documentApi} from '@/api/Document.js'
import ListItems from "@/components/common/ListItems.vue"
import Handsontable from 'handsontable';
export default {
	components:{
		ConfirmDelete,
		ListItems
	},
	props:{
		showSwitchBtn:{
			type:Boolean ,
			default: false
		}
	},	
	created(){
	
	},
	data(){
		let self = this
		return{
			showDialog:false,
			disableBtn: true,
			listItemSelected:[],
			showBtnAddCheckbox: true,
			customAPIResult:{
				reformatData(res){
					return{
                         columns: [
							// {name: "checkbox_select_item",data:"checkbox_select_item",title:"selected",type:"checkbox", noFilter:true},
                            {name: "id", title: "id", type: "numeric", noFilter:true},
							{name: "name", title: "name", type: "text", noFilter:true},
							{name: "startUserId", title: "startUserId", type: "text", noFilter:true},
							{name: "suspended", title: "suspended", type: "date", noFilter:true,
								  renderer:  function(instance, td, row, col, prop, value, cellProperties) {
										Handsontable.dom.empty(td);
										let span;
										span = document.createElement('span');	
										if(value === null || value == ""){
											$(span).text("Đang chạy")
											$(span).css('color', 'green')
											td.appendChild(span);
											return td;
										}
										if(value == true){
											$(span).text("Tạm dừng ")
											$(span).css('color', 'orange')
											td.appendChild(span);
											return td;
										}
									},
							},
							{name: "startTime", title: "startTime", type: "date", noFilter:true},
						 ],
						 listObject: res.data,
					}
				}
			},
			containerHeight: null,
			tableContextMenu: {
               viewDetails: {
                    name: "View details",
                    text: "Xem chi tiết",
                    callback: (obj, callback) => {
						self.$goToPage( "/work/"+obj.id,
                            " Chi tiết " + (obj.name ? obj.name : "")
                        );
                    },
                },
            },
		}
	},
	computed:{
		apiUrl(){
			let processKey = this.$store.state.admin.processKey
			return appConfigs.apiDomain.bpmne.instances+'?size=100&sort=startTime&order=desc&processDefinitionKey='+processKey;
		},
		processKey(){
			return this.$store.state.admin.processKey
		},
	},
	mounted(){
		this.containerHeight = util.getComponentSize(this).h 
		this.$refs.listWorkFlow.addCheckBoxColumn()
	},
	watch:{
		processKey(val){
			this.listItemSelected = []
			this.showBtnAddCheckbox = true
		},
		listItemSelected:{
			deep: true,
            immediate: true,
            handler(obj){
				this.showBtnAddCheckbox = true
				if(Object.keys(obj).length == 0){
					this.disableBtn = true
				}else{
					this.disableBtn = false
				}
            }
		},
	},
	methods:{
		afterSelectedRow(items){
			this.$set(this, 'listItemSelected', items)
			if(Object.keys(this.listItemSelected).length == 0){
					this.disableBtn = true
				}else{
					this.disableBtn = false
				}
		},
		switchFullScreen(){
			let processKey = this.$store.state.admin.processKey
			this.$goToPage('/workflow/process-key/'+processKey+'/list-instances', this.$t('process.instance.listModelInstance')+processKey)
		},
		stopProcessInstance(){
			let self = this
			for(let i in this.listItemSelected){
				adminApi.stopProcessInstances(this.listItemSelected[i].id).then(res=>{
					if(res.suspended == true){
						self.$snotify(
							{
								type: "success",
								title:" Dừng tác vụ thành công"
							}
						)
					}
				self.$refs.listWorkFlow.refreshList()

				}).catch(err=>{
					self.$snotify(
							{
								type: "error",
								title:"Tác vụ này đã được dừng"
							}
						)
				})
			}
 		},
		activeProcessInstance(){
			let self = this
			for(let i in this.listItemSelected){
				adminApi.activeProcessInstances(this.listItemSelected[i].id).then(res=>{
					self.$snotify(
						{
							type: "success",
							title:" Chạy tác vụ thành công"
						}
					)
					self.$refs.listWorkFlow.refreshList()
				}).catch(err=>{
					self.$snotify(
							{
								type: "error",
								title:"Tác vụ này đang chạy"
							}
						)
				})
			}
			
		},
		confirmDelete(){
			this.showDialog = true
		},
		addCheckBoxColumn(){
			this.showBtnAddCheckbox = false
			this.$refs.listWorkFlow.addCheckBoxColumn()
		},
		deleteProcessInstance(value){
			this.showDialog = false
			let self = this
			if(value == true){
				let arr = []
				for(let i in this.listItemSelected){
					arr.push(this.listItemSelected[i].id)
				}
				documentApi.deleteDocumentObject({workflowObjectIds:JSON.stringify(arr)}).then(res=>{
					if(res.status == 400){
						self.$snotify(
							{
								type: "error",
								title:" Không tìm thấy bản ghi liên quan"
							}
						)
					}else if(res.status = 200){
						self.$snotify(
							{
								type: "success",
								title:" Xóa bản ghi liên quan hành công"
							}
						)
					}
				}).catch(err=>{
					self.$snotify(
						{
							type: "error",
							title:" Xóa bản ghi liên quan thất bại"
						}
					)
				})
			}
			for(let i in this.listItemSelected){
				adminApi.deleteProcessInstances(this.listItemSelected[i].id).then(res=>{
					self.$snotify(
						{
							type: "success",
							title:" Xóa tác vụ thành công"
						}
					)
					self.$refs.listWorkFlow.refreshList()
				}).catch(err=>{
					self.$snotify(
							{
								type: "error",
								title:"Đã có lỗi xảy ra"
							}
						)
				})
			}
			
		},
		cancel(){
			this.showDialog = false
		}
	}
}
</script>

<style scoped>
.fullscreen-mode >>> button{
	margin-top:10px !important;
}

</style>