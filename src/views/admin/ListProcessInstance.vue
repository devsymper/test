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
					color="primary"
					small
					:disabled="disableBtn"
					@click="activeProcessInstance"
				>
				Chạy
				</v-btn>
				<v-btn
					:class="{'mr-2 white--text':true, 'mr-8':showSwitchBtn == false}"
					depressed
					color="success"
					small
					:disabled="disableBtn"
					@click="endProcessInstance"
				>
				Hoàn thành
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
			<ConfirmDelete 
				:showDialog="showDialog"
				v-if="showDialog"
				@cancel="cancel"
				@confirm="deleteProcessInstance"
			 />
			<ListItems 
				ref="listWorkFlow"
				:pageTitle="'Danh sách các quy trình con'"
				:showButtonAdd="false"
				:getDataUrl="apiUrl"
				:showExportButton="false"
				:showImportButton="false"
				:useDefaultContext="false"
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
					if(res.data.listObject.length > 0){
						let arr = []
						res.data.listObject.forEach(function(e){
							arr.push(e.id)
							let processDefId = e.processDefinitionId.split(':')
							e.nameVersion = processDefId[1]
						})
						let obj = res.data.listObject
						adminApi.getStartUserName(arr).then(resA=>{
							obj.forEach(function(e){
								resA.data.forEach(function(k){
									if(e.id == k.processInstanceId){
										let mapIdToUser = self.$store.getters['app/mapIdToUser'];
										let newName = k.value.split(':')[0]
										e.startUserName = mapIdToUser[newName].displayName
									}
								})
							})
							self.$refs.listWorkFlow.rerenderTable()
						}).catch(err=>{

						})
						res.data.listObject.sort(function(a,b){
							var c = new Date(a.startTime);
							var d = new Date(b.startTime);
							return d-c;
						})
					}
					return{
                         columns: [
                            {name: "id", title: "id", type: "numeric"},
							{name: "name", title: "name", type: "text"},
							{name: "startUserName", title: "startUserId", type: "text"},
							{name: "status", title: "status", type: "date",
								  renderer:  function(instance, td, row, col, prop, value, cellProperties) {
										Handsontable.dom.empty(td);
										let span;
										span = document.createElement('span');	
										
										if(value == '1'){
											$(span).text("Đang chạy")
											$(span).css('color', 'blue')
											td.appendChild(span);
											return td;
										}
										if(value == '2'){
											$(span).text("Tạm dừng")
											$(span).css('color', 'orange')
											td.appendChild(span);
											return td;
										}
										if(value == '3'){
											$(span).text("Hoàn thành")
											$(span).css('color', 'green')
											td.appendChild(span);
											return td;
										}
									},
							},
							{name: "nameVersion", title: "nameVersion", type: "text"},
							{name: "startTime", title: "startTime", type: "text",
								renderer:  function(instance, td, row, col, prop, value, cellProperties) {
									Handsontable.dom.empty(td);
									let span;
									span = document.createElement('span');	
									if(value != null){
										let data =  self.$moment(value).format('YYYY-MM-DD HH:mm:ss')
										$(span).text(data)
									}	
									td.appendChild(span);
									return td;
								},
							},
							{name: "endTime", title: "endTime", type: "text",
								renderer:  function(instance, td, row, col, prop, value, cellProperties) {
									Handsontable.dom.empty(td);
									let span;
									span = document.createElement('span');	
									if(value != null){
										let data =  self.$moment(value).format('YYYY-MM-DD HH:mm:ss')
										$(span).text(data)
									}	
									td.appendChild(span);
									return td;
								},
							},
						 ],
						 listObject: res.data.listObject, 
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
			return appConfigs.apiDomain.workflowExtend+processKey+'/process-instances';
		},
		processKey(){
			return this.$store.state.admin.processKey
		},
	},
	mounted(){
		this.containerHeight = util.getComponentSize(this).h - 50
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
				// this.showBtnAddCheckbox = true
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
				if(this.listItemSelected[i].status == "3"){
					self.$snotify(
						{
							type: "infor",
							title:" Tác vụ này đã hoàn thành"
						}
					)
				}else{
					adminApi.stopProcessInstances(this.listItemSelected[i].id).then(res=>{
						if(res.suspended == true){
							self.$snotify(
								{
									type: "success",
									title:" Dừng tác vụ thành công"
								}
							)
						}
						this.showBtnAddCheckbox = true
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
				
			}
		 },
		endProcessInstance(){
			let self = this
			for(let i in this.listItemSelected){
				if(this.listItemSelected[i].status == "3"){
					self.$snotify(
						{
							type: "infor",
							title:" Tác vụ này đã hoàn thành"
						}
					)
				}else{
					adminApi.deleteProcessInstances(this.listItemSelected[i].id).then(res=>{
						self.notifysuccess("Hoàn thành tác vụ thành công")
					}).catch(err=>{
						self.$snotify(
								{
									type: "error",
									title:"Đã có lỗi xảy ra"
								}
							)
					})
				}
				
			}
		},
		activeProcessInstance(){
			let self = this
			for(let i in this.listItemSelected){
				if(this.listItemSelected[i].status == "3"){
					self.$snotify(
						{
							type: "infor",
							title:" Tác vụ này đã hoàn thành"
						}
					)
				}else{
					adminApi.activeProcessInstances(this.listItemSelected[i].id).then(res=>{
						self.$snotify(
							{
								type: "success",
								title:" Chạy tác vụ thành công"
							}
						)
						this.showBtnAddCheckbox = true
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

				if(this.listItemSelected[i].status == '3'){
					adminApi.deleteTask(this.listItemSelected[i].id).then(res=>{
						self.notifysuccess()
					}).catch(err=>{})
				}else{
					adminApi.deleteProcessInstances(this.listItemSelected[i].id).then(res=>{
						adminApi.deleteTask(this.listItemSelected[i].id).then(res=>{
						}).catch(err=>{})
						self.notifysuccess()
					}).catch(err=>{
						self.$snotify(
								{
									type: "error",
									title:"Đã có lỗi xảy ra"
								}
							)
					})
				}
				
			}
			
		},
		notifysuccess(title = " Xóa tác vụ thành công"){
			this.$snotify(
				{
					type: "success",
					title: title
				}
			)
			this.showBtnAddCheckbox = true
			this.$refs.listWorkFlow.refreshList()
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