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
				:customRenderForFilter="customRenderForFilter"
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
import AdminWorker from 'worker-loader!@/worker/admin/Admin.Worker.js';
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
			customRenderForFilter(columnName,items){
				if(columnName == 'status'){
					items.forEach(function(e){
						if(columnName == 'status'){
							items.forEach(function(e){
								if(e.value == "1"){
									e.label = "Đang chạy"
								}else if(e.value == '2'){
									e.label = "Tạm dừng"
								}else if(e.value == '3'){
									e.label = "Hoàn thành"
								}
							})
						}
					})
				}
				return items
			},
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
							{name: "startUserName", title: "startUserId", type: "text", noFilter: true},
							{name: "status", title: "status", type: "date",
								cellRenderer: function(params) {
									if(params.value == '1'){
										return  '<span style="color: blue">Đang chạy</span>'
									}
									if(params.value == '2'){
										return  '<span style="color: orange">Tạm dừng</span>'
									}
									if(params.value == '3'){
										return  '<span style="color: green">Hoàn thành</span>'
									}
								}
							},
							{name: "nameVersion", title: "nameVersion", type: "text", noFilter: true},
							{name: "startTime", title: "startTime", type: "text",
								cellRenderer: function(params) {
									let newValue = self.$moment(params.value).format('YYYY-MM-DD HH:mm:ss')
									return  '<span>'+ newValue +'</span>'
								}
							},
							{name: "endTime", title: "endTime", type: "text",
								cellRenderer: function(params) {
									let newValue = self.$moment(params.value).format('YYYY-MM-DD HH:mm:ss')
									return  '<span>'+ newValue +'</span>'
								}
							},
						 ],
						 listObject: res.data.listObject, 
					}
				}
			},
			containerHeight: null,
			adminWorker: null,
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
		this.containerHeight = util.getComponentSize(this).h 
		this.adminWorker = new AdminWorker();
		let self = this
        this.adminWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'endProcessInstance':
					self.notifyMessage(data.dataAfter," Tác vụ này đã hoàn thành", "Hoàn thành tác vụ thành công")
					break;
                case 'stopProcessInstance':
					self.notifyMessage(data.dataAfter," Tác vụ này đã hoàn thành", "Dừng tác vụ thành công")
					break;
                case 'activeProcessInstance':
					self.notifyMessage(data.dataAfter," Tác vụ này đã hoàn thành", "Chạy tác vụ thành công")
					break;
                case 'deleteProcessInstance':
					if(data.dataAfter.resDoc == 'notFound'){
						self.$snotify({
							type: "error",
							title: "Không tìm thấy bản ghi liên quan"
						})
					}else if(data.dataAfter.resDoc == 'done'){
						self.$snotify({
							type: "success",
							title: "Xóa bản ghi liên quan thành công"
						})
					}
					self.notifyMessage(data.dataAfter.newLists," Tác vụ này đã hoàn thành", "Xóa tác vụ thành công")
					break;
                default:
                    break;
            }
        });
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
		notifyMessage(data , titleError, titleSuccess){
			let self = this
				data.forEach(function(e){
				if(e == "isDone"){
					self.$snotify({
						type: "error",
						title: titleError
					})
				}else if(e == "done"){
					self.$snotify({
						type: "success",
						title: titleSuccess
					})
					
				}else if(e == "isStop"){
					self.$snotify({
						type: "error",
						title: 'Tác vụ này đã được dừng'
					})
				}else if(e == "isRunning"){
					self.$snotify({
						type: "error",
						title: 'Tác vụ này đang chạy'
					})
					
				}
			})
			self.showBtnAddCheckbox = true
			self.$refs.listWorkFlow.refreshList()
		},
		switchFullScreen(){
			let processKey = this.$store.state.admin.processKey
			this.$goToPage('/workflow/process-key/'+processKey+'/list-instances', this.$t('process.instance.listModelInstance')+processKey)
		},
		stopProcessInstance(){
			this.adminWorker.postMessage({
				action: 'stopProcessInstance',
				data:{
					listItemSelected: this.listItemSelected
				}
			});
		 },
		endProcessInstance(){
			this.adminWorker.postMessage({
				action: 'endProcessInstance',
				data:{
					listItemSelected: this.listItemSelected
				}
			});
		},
		activeProcessInstance(){
			this.adminWorker.postMessage({
				action: 'activeProcessInstance',
				data:{
					listItemSelected: this.listItemSelected
				}
			});
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
			this.adminWorker.postMessage({
				action: 'deleteProcessInstance',
				data:{
					listItemSelected: this.listItemSelected,
					isDeleteDoc: value
				}
			});
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