<template>
	<div class="detail-workflow w-100  h-100 d-flex flex-column">
		<div class="d-flex" style="height:50%">
			<div class="modeler-workflow mr-2 w-100 h-100">
				<TrackingProcessDefinition :procesDefId="processDefination.id"/>
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
						{{processDefination.key ? processDefination.key : ""}}
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
							<span>Đang chạy</span>
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
					</div>
				</div>
			</div>
		</div>
		<div class="list-workflow-instance d-flex flex-column h-100 mt-8" >
			<ListProcessInstance :showSwitchBtn="true" />
		</div>
	</div>
</template>

<script>
import ModelerDetail from "./ModelerDetail"
import ListProcessInstance from "./ListProcessInstance"
import TrackingProcessDefinition from '@/components/process/TrackingProcessDefinition'
export default {
	components:{
		ModelerDetail,
		ListProcessInstance,
		TrackingProcessDefinition
	},
	data(){
		let self = this
		return {
			colors:['#1976D2','#53B257'],
			showDialog:false,
			disableBtn: true,
			isShowDonutChart: false,
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
	},
	computed:{
		processDefination(){
			return this.$store.state.admin.processDefination
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
			if(canvas){
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
					accum += values[i];
				}
				var innerRadius = radius-arcwidth;
				ctx.beginPath();
				ctx.fillStyle = "black";
				ctx.font = "30px  roboto ";
				ctx.fillText(this.sAdmin.sumProcess,75,95);
			}
			
		},
	},
	watch:{
		processKey(val){
			this.tab = 'tab-1'
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
					if(canvas){
						var ctx = canvas.getContext("2d");
						ctx.clearRect(0, 0, canvas.width, canvas.height);
					}
					
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
	margin-top:45px;
	margin-left:16px;
}
.modeler-workflow{
	border: 1px solid lightgray;
}
.djs-visual{
	pointer-events: none !important;
}
</style>