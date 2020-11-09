<template>
	<div class="detail-workflow w-100  h-100 d-flex flex-column">
		<div class="d-flex" style="height:50%">
			<div class="modeler-workflow mr-2 w-100 h-100">
				<ModelerDetail 
				/>
			</div>
			<div class="summary-workflow d-flex flex-column">
				<div class="d-flex pt-2">
					<span class="title-summary">
						ID
					</span>
					<span class="value-summary">
						{{processDefination.id  ? processDefination.id : "" }}
					</span>
				</div>
				<div class="d-flex pt-2">
					<span class="title-summary">
						Tên quy trình 
					</span>
					<span class="value-summary">
						{{processDefination.name ? processDefination.name : ""}}
					</span>
				</div>
				<div class="d-flex pt-2">
					<span class="title-summary">
						Tiêu đề quy trình
					</span>
					<span class="value-summary">
						{{processDefination.key ?processDefination.key : ""}}
					</span>
				</div>
				<div class="d-flex pt-2">
					<span class="title-summary">
						Ghi chú 
					</span>
					<span class="value-summary">
						{{processDefination.description ? processDefination.description  : ""}}
					</span>
				</div>
				<div class="d-flex pt-2">
					<span class="title-summary">
						Trạng thái
					</span>
					<span class="value-summary value-summary-status">
						<v-chip
							class="ma-2"
							x-small
							color="primary"
							v-if="processDefination.suspended == false"
							label
							text-color="white"	
							>
							Hoạt động
						</v-chip>
						<v-chip
							class="ma-2"
							x-small
							color="orange"
							v-else
							label
							text-color="white"
							>
							Tạm dừng
						</v-chip>
					</span>
				</div>
				<div class="d-flex pt-2">
					<span class="title-summary">
						Phiên bản
					</span>
					<span class="value-summary">
						{{processDefination.version ? processDefination.version  : ""}}
					</span>
				</div>
				<div  class="d-flex" style="margin-top:16px">	
					<div style="width:150px; height:150px" >
						<canvas  id="canvas" width=300 height=300></canvas>
					</div>
					<div v-if="isShowDonutChart" class="description-summary d-flex flex-column">
						<div>
							 <v-chip
								class="ma-2"
								small
								color="primary"
								text-color="white"
								>
								n
							</v-chip>
							<span>Chưa hoàn thành</span>
						</div>
						<div >
							 <v-chip
								class="ma-2"
								color="green"
								
								text-color="white"
								small
								>
								n
							</v-chip>
							<span>Hoàn thành</span>
						</div>
						<div>
							 <v-chip
								class="ma-2"
								color="red"
								text-color="white"
								small
								>
								n
							</v-chip>
							<span>Lỗi</span>
						</div>
					</div>
				</div>
				
			</div>
		</div>
		<div class="list-workflow-instance d-flex flex-column h-100 mt-8" >
			<ListProcessInstance :showSwitchBtn="true" />
		</div>
		<ConfirmDelete 
			:showDialog="showDialog"
			@cancel="cancel"
			@confirm="deleteProcessInstance"
			 />
	</div>
</template>

<script>
import ListItems from "@/components/common/ListItems.vue"
import { util } from "@/plugins/util.js";
import {adminApi} from '@/api/Admin.js'
import { appConfigs } from "./../../configs.js";
import { reformatGetListInstances } from "@/components/process/reformatGetListData.js";
import ModelerDetail from "./ModelerDetail"
import ConfirmDelete from "./ConfirmDelete"
import Handsontable from 'handsontable';
export default {
	components:{
		ListItems,
		ModelerDetail,
		ConfirmDelete
	},
	data(){
		let self = this
		return {
			containerHeight:null,
			colors:['#1976D2','#53B257'],
			showDialog:false,
			listItemSelected:[],
			disableBtn: true,
			isShowDonutChart: false,
			customAPIResult:{
				reformatData(res){
					return{
                         columns: [
							{name: "checkbox_select_item",data:"checkbox_select_item",title:"selected",type:"checkbox", noFilter:true},
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
	props:{
		itemData:{
			type: Object,
			default(){
				return {}
			}
		}
	},
	mounted(){
		this.containerHeight = util.getComponentSize(this).h /2 - 50
	},
	computed:{
		processDefination(){
			return this.$store.state.admin.processDefination
		},
		apiUrl(){
			let processKey = this.$store.state.admin.processKey
			return appConfigs.apiDomain.bpmne.instances+'?size=100&sort=startTime&order=desc&processDefinitionKey='+processKey;
		},
		processKey(){
			return this.$store.state.admin.processKey
		},
		sAdmin(){
			return this.$store.state.admin
		},
		values(){
			return this.$store.state.admin.currentAggregateWorkflow
		}
	},
	
	methods:{
		dmbChart(cx,cy,radius,arcwidth,values,colors,selectedValue){
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			var tot = 0;
			var accum = 0;
			var PI = Math.PI;
			var PI2 = PI*2;
			var offset = -PI/2;
			ctx.lineWidth = arcwidth;
			for(var i = 0; i < values.length; i++){
				tot += values[i]
			}
			for(var i = 0; i < values.length; i++){
				ctx.beginPath();
				ctx.arc(cx,cy,radius,
					offset+PI2*(accum/tot),
					offset+PI2*((accum+values[i])/tot)
				);
				ctx.strokeStyle=colors[i];
				ctx.stroke();
				accum+=values[i];
			}
			var innerRadius=radius-arcwidth;
			ctx.beginPath();
			ctx.fillStyle=colors[selectedValue];
			ctx.textAlign='center';
			ctx.font="30px  roboto";
			ctx.fillText(this.sAdmin.sumProcess,cx,cy+innerRadius*.9);
		},
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
			this.$goToPage('/workflow/process-key/'+processKey+'/instances', this.$t('process.instance.listModelInstance')+processKey)
		},
		stopProcessInstance(){
			let self = this
			for(let i in this.listItemSelected){
				adminApi.stopProcessInstances(this.listItemSelected[i].id).then(res=>{
					if(res.suspended == true){
						self.$snotify(
							{
								type: "success",
								title:" Thành công"
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
							title:" Thành công"
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
		deleteProcessInstance(){
			this.showDialog = false
			let self = this
			for(let i in this.listItemSelected){
				adminApi.deleteProcessInstances(this.listItemSelected[i].id).then(res=>{
					self.$snotify(
						{
							type: "success",
							title:" Thành công"
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
	},
	watch:{
		processKey(val){
			this.listItemSelected = []
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
		values:{
			deep: true,
            immediate: true,
            handler(arr){
				if(arr.length > 0){
					this.isShowDonutChart = true
					this.dmbChart(85,85,70,20,arr,this.colors,0)
				}else{
					this.isShowDonutChart = false
					var canvas = document.getElementById('canvas');
					var ctx = canvas.getContext("2d");
					ctx.clearRect(0, 0, canvas.width, canvas.height);
				}
            }
		}
	}
}
</script>

<style scoped>
.detail-workflow{
	font:13px roboto
}
.modeler-workflow{
	width: 650px;
}
.summary-workflow{
	width: 340px;
}
.summary-workflow .value-summary{
	white-space: nowrap;
  	overflow: hidden;
  	text-overflow: ellipsis;	
  	width: 200px;
}
.summary-workflow .title-summary{
	width:120px;
	font:13px;
	font-weight: 500;
}
.summary-workflow .value-summary-status{
	margin: -8px 
}
.description-summary{
	margin-top:24px;
	margin-left:16px;
}
/* canvas{
	height: 200px !important;
} */
</style>