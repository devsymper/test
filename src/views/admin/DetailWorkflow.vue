<template>
	<div class="detail-workflow w-100  h-100 d-flex flex-column">
		<div class="d-flex" style="height:50%">
			<div class="modeler-workflow">
				modeler-workflow
			</div>
			<div class="summary-workflow d-flex flex-column">
				<div class="d-flex pt-2">
					<span class="title-summary">
						ID
					</span>
					<span class="value-summary">
						value id
					</span>
				</div>
				<div class="d-flex pt-2">
					<span class="title-summary">
						Tên quy trình 
					</span>
					<span class="value-summary">
						value id2
					</span>
				</div>
				<div class="d-flex pt-2">
					<span class="title-summary">
						Tiêu đề quy trình
					</span>
					<span class="value-summary">
						value id3
					</span>
				</div>
				<div class="d-flex pt-2">
					<span class="title-summary">
						Ghi chú 
					</span>
					<span class="value-summary">
						value id34
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
						value id36
					</span>
				</div>
				<canvas id="canvas" width=200 height=200></canvas>
			</div>
		</div>
		<div class="list-workflow-instance">
			<ListItems 
				ref="listWorkFlow"
				:pageTitle="'Danh sách các quy trình con'"
				:showButtonAdd="false"
				:showExportButton="false"
				:showImportButton="false"
				:useDefaultContext="false"
				:containerHeight="containerHeight"
				:showImportHistoryBtn="false"
				:showActionPanelInDisplayConfig="false"
			/>
		</div>
	</div>
</template>

<script>
import ListItems from "@/components/common/ListItems.vue"
import { util } from "@/plugins/util.js";
export default {
	components:{
		ListItems
	},
	data(){
		return {
			containerHeight:null,
			colors:['blue','green','red'],
			values: [60,30,10],
			
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
		this.containerHeight = util.getComponentSize(this).h /2
		this.dmbChart(60,60,40,10,this.values,this.colors);
	},
	watch:{
		itemData:{
			deep:true,
            immediate:true,
            handler:function(obj){
            }
		}
	},
	methods:{
		dmbChart(cx,cy,radius,arcwidth,values,colors){
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
			ctx.textAlign='center';
			ctx.font="30px  roboto";
			ctx.fillText("3,5k",cx,cy+innerRadius*.9);
		}
	}
}
</script>

<style scoped>
.modeler-workflow{
	width: 650px;
}
.summary-workflow{
	width: 340px;
	margin-top:10px
}
.summary-workflow .title-summary{
	width:120px;
	font:13px;
	font-weight: 500;
}
.summary-workflow .value-summary-status{
	margin-top:-8px;
	margin-left:-8px;
}
/* canvas{
	height: 200px !important;
} */
</style>