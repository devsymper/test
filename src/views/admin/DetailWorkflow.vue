<template>
	<div class="detail-workflow w-100  h-100 d-flex flex-column">
		<div class="d-flex" style="height:50%">
			<div class="modeler-workflow">
				<ModelerDetail />
			</div>
			<div class="summary-workflow d-flex flex-column">
				<div class="d-flex pt-2">
					<span class="title-summary">
						ID
					</span>
					<span class="value-summary">
						{{processDefination.id}}
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
							label
							text-color="white"
							>
							Hoạt động
						</v-chip>
					</span>
				</div>
				<div class="d-flex pt-2">
					<span class="title-summary">
						Phiên bản
					</span>
					<span class="value-summary">
						2
					</span>
				</div>
				<div class="d-flex" style="margin-top:16px">	
					<div style="width:150px; height:150px" >
						<canvas id="canvas" width=300 height=300></canvas>
					</div>
					<div class="description-summary d-flex flex-column">
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
						<div>
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
		<div class="list-workflow-instance d-flex flex-column">
			<div class="d-flex">
				<div class="ml-2 mt-2 " style="flex-grow:1">
					<h3>	
						Danh sách các quy trình con
					</h3>
				</div>
			
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
					depressed
					class="mr-2 white--text"
					small
					color="success"
					:disabled=" disableBtn"
					@click="finishProcessInstance"
				>
					Hoàn thành
				</v-btn>
				 <v-tooltip bottom>
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
				:showToolbar="false"
				:isTablereadOnly="false"
				@after-selected-row="afterSelectedRow"
				:showImportHistoryBtn="false"
				:showPagination="false"
				:showActionPanelInDisplayConfig="false"
			/>
		</div>
	</div>
</template>

<script>
import ListItems from "@/components/common/ListItems.vue"
import { util } from "@/plugins/util.js";
import {adminApi} from '@/api/Admin.js'
import { appConfigs } from "./../../configs.js";
import { reformatGetListInstances } from "@/components/process/reformatGetListData.js";
import ModelerDetail from "./ModelerDetail"
export default {
	components:{
		ListItems,
		ModelerDetail
	},
	data(){
		return {
			containerHeight:null,
			colors:['#1976D2','#53B257','#F44A3E'],
			listItemSelected:[],
			disableBtn: true,
			values: [60,30,10],
			customAPIResult:{
				reformatData(res){
					return{
                         columns: [
							{name: "checkbox_select_item",data:"checkbox_select_item",title:"selected",type:"checkbox", noFilter:true},
                            {name: "id", title: "id", type: "numeric", noFilter:true},
							{name: "name", title: "name", type: "text", noFilter:true},
							{name: "startUserId", title: "startUserId", type: "text", noFilter:true},
							{name: "startTime", title: "startTime", type: "date", noFilter:true},
						 ],
						 listObject: res.data,
					}
				}
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
		this.dmbChart(85,85,70,20,this.values,this.colors,0);
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
		}
	},
	
	methods:{
		dmbChart(cx,cy,radius,arcwidth,values,colors,selectedValue){
			var canvas = document.getElementById("canvas");
			var ctx = canvas.getContext("2d");
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
			ctx.fillText("3,5k",cx,cy+innerRadius*.9);
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

		},
		finishProcessInstance(){

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
	/* margin-top:10px */
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