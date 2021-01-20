<template>
	<div class="w-100 h-100">
		<v-text-field
            v-on:input="onSearch($event)"
            class="d-inline-block pa-2 sym-small-size"
            single-line
            append-icon="mdi-magnify"
            outlined
            hide-details
            dense
            flat
            label="Search"
            :placeholder="$t('common.search')"
            style="width: inherit"
        ></v-text-field>
		<v-btn @click="testRenderChart">click</v-btn>
		<preloader 
			v-if="loadding"
			style="height:100px!important;width:185px"
			class="mx-auto"
		/>
		<VuePerfectScrollbar v-else style="height:calc(100% - 44px)">
			<template>
				<v-expansion-panels
					:multiple="true"
					:hover="true"
					:accordion="true"
					:focusable="true"
					:flat="true"
					v-model="openPanel"
					class="sym-small-size"
					style="overflow:hidden"
				>
					<v-expansion-panel
						v-for="(groupData, key) in styleConfig"
						:key="key"
						v-show="groupData.show"
					>
						<v-expansion-panel-header>{{groupData.label}}</v-expansion-panel-header>
						<v-expansion-panel-content>
							<form-tpl
								:allInputs="groupData.children"
							></form-tpl>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</template>
		</VuePerfectScrollbar>
	</div>
	
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import FormTpl from "@/components/common/FormTpl.vue";
import DashboardStyleConfig from 'worker-loader!@/worker/dashboard/dashboard/DashboardStyleConfig.Worker.js';
import Stackedbar from "@/components/dashboard/reports/StackedBar.chart.js";
export default {
	components:{
		VuePerfectScrollbar,
		FormTpl,
	},
	computed:{
	},
	data(){
		return{
			dashboardStyleConfig:null,
			openPanel:[],
			loadding:false,
			styleConfig:
				{"headerFormat":{"label":"Header Style","name":"headerFormat","show":true,"children":{"fontColor":{"title":"Font Corlor","type":"color","default":"#344750","value":"#344750","name":"fontColor"},"textSize":{"title":"Text Size","type":"number","default":"13","value":"13","name":"textSize"},"bgColor":{"title":"Background Corlor","type":"color","default":"#ffffff","value":"#ffffff","name":"bgColor"},"tableColumnWidthMode":{"title":"Column width mode","type":"select","default":"auto","options":[{"value":"auto","text":"Auto"},{"value":"fitData","text":"Fit data only"},{"value":"fitCell","text":"Fit cell width"},{"value":"fitDataAndHeader","text":"Fit data and header"}],"value":"fitDataAndHeader","name":"tableColumnWidthMode"},"alignment":{"title":"Alignment","type":"btnSelect","default":"left","options":[{"name":"left","icon":"mdi-align-horizontal-left","value":"left","text":""},{"name":"center","icon":"mdi-align-horizontal-center","value":"center","text":""},{"name":"right","icon":"mdi-align-horizontal-right","value":"right","text":""}],"value":"left","name":"alignment"},"borderWidth":{"title":"Border Width","type":"number","default":0,"value":0,"name":"borderWidth"},"borderColor":{"title":"Border Corlor","type":"color","default":"#000000","value":"#000000","name":"borderColor"}}},"cellFormat":{"label":"Row data Style","name":"cellFormat","show":true,"children":{"verticalLine":{"title":"Vertical line","type":"switch","default":false,"value":false,"name":"verticalLine"},"fontColor":{"title":"Font Corlor","type":"color","default":"#344750","value":"#344750","name":"fontColor"},"textSize":{"title":"Text Size","type":"number","default":"13","value":"13","name":"textSize"},"borderBottomWidth":{"title":"Border Width","type":"number","default":1,"value":1,"name":"borderBottomWidth"},"borderBottomColor":{"title":"Border Corlor","type":"color","default":"#ededed","value":"#ededed","name":"borderBottomColor"},"zeroValueDisplay":{"title":"Zero value display","type":"select","default":"-","options":[{"value":"original","text":"Original"},{"value":"-","text":"-"},{"value":"blank","text":"Blank"}],"value":"-","name":"zeroValueDisplay"},"tooltipDecimalNumber":{"title":"Decimal number","type":"number","default":2,"value":2,"name":"tooltipDecimalNumber"}}},"total":{"label":"Total","name":"total","show":true,"children":{"verticalLine":{"title":"Vertical line","type":"switch","default":false,"value":false,"name":"verticalLine"},"fontColor":{"title":"Font Corlor","type":"color","default":"#344750","value":"#344750","name":"fontColor"},"textSize":{"title":"Text Size","type":"number","default":"13","value":"13","name":"textSize"},"bgColor":{"title":"Background Corlor","type":"color","default":"#ffffff","value":"#dbdbdb","name":"bgColor"}}},"general":{"label":"General","name":"general","show":true,"children":{"fontFamily":{"title":"Font family","type":"select","default":"roboto","options":[{"value":"roboto","text":"Roboto"}],"value":"roboto","name":"fontFamily"},"bgColor":{"title":"Background Corlor","type":"color","default":"#ffffff","value":"#ffffff","name":"bgColor"},"borderWidth":{"title":"Border Width","type":"number","default":0,"value":1,"name":"borderWidth"},"borderColor":{"title":"Border Corlor","type":"color","default":"#000000","value":"#e5e5e5","name":"borderColor"},"colorPalette":{"title":"Color palette","type":"colorArray","default":[],"value":["#01B8AA","#374649","#FD625E","#F2C80F","#8AD4EB","#FE9666","#A66999 #73B761","#4A588A","#ECC846","#CD4C46","#71AFE2","#8D6FD1","#EE9E64","#95DABB #074650","#009292","#FE6DB6","#FEB5DA","#480091","#B66DFF","#B5DAFE","#6DB6FF"],"name":"colorPalette"}}}}
			,
			testRowconfig: {"setting":{"xAxis":{"name":"X Axis","slot":"n","selectedColums":[{"name":"nct","type":"date","dataset":"2833","agg":"first","edit":false,"as":"Ngày chứng từ","symper_id":"__vue_devtool_undefined__","cond":{"type":"isall","val":""},"origin_type":"date"}]},"legend":{"name":"Legend","slot":"1","selectedColums":[]},"tooltips":{"name":"Tooltips","slot":"n","hasAgg":true,"selectedColums":[]},"yAxis1":{"name":"Y Axis 1","slot":"1","hasAgg":true,"lastYaxis":1,"selectedColums":[{"name":"sl_ns","type":"number","dataset":"2833","agg":"sum","edit":false,"as":"Số người làm","symper_id":"__vue_devtool_undefined__","cond":{"type":"isall","val":""},"origin_type":"number","yAxisNum":0}]}},"style":[{"label":"Legend","name":"legend","show":true,"children":{"show":{"label":"Show","type":"switch","default":true,"value":true,"name":"show"},"name":{"label":"Name","type":"text","default":"","value":"","name":"name"},"legendPosition":{"label":"Position","type":"btnSelect","default":"vertical-bottom","options":[{"name":"Left","icon":"ms-Icon ms-Icon--AlignHorizontalLeft","value":"vertical-left","text":""},{"name":"Top","icon":"ms-Icon ms-Icon--AlignVerticalTop","value":"horizontal-top","text":""},{"name":"Right","icon":"ms-Icon ms-Icon--AlignHorizontalRight","value":"vertical-right","text":""},{"name":"Bottom","icon":"ms-Icon ms-Icon--AlignVerticalBottom","value":"horizontal-bottom","text":""}],"value":"horizontal-bottom","name":"legendPosition"},"fontColor":{"label":"Font Corlor","type":"color","default":"#344750","value":"#344750","name":"fontColor"},"textSize":{"label":"Text Size","type":"number","default":"13","value":12,"name":"textSize"},"showLegendTitle":{"label":"Show Legend Title","type":"switch","default":true,"value":false,"name":"showLegendTitle"},"titleText":{"label":"Title text","type":"text","default":"","value":"","name":"titleText"}}},{"label":"Data label","name":"dataLabel","show":true,"children":{"show":{"label":"Show","type":"switch","default":true,"value":false,"name":"show"},"fontColor":{"label":"Font Corlor","type":"color","default":"#344750","value":"#344750","name":"fontColor"},"textSize":{"label":"Text Size","type":"number","default":"13","value":11,"name":"textSize"},"bgColor":{"label":"Background Corlor","type":"color","default":"#ffffff","value":"#ffffff00","name":"bgColor"},"borderWidth":{"label":"Border Width","type":"number","default":0,"value":0,"name":"borderWidth"},"borderColor":{"label":"Border Corlor","type":"color","default":"#000000","value":"#ffffff00","name":"borderColor"},"tooltipDecimalNumber":{"label":"tooltip decimal number","type":"number","default":2,"value":2,"name":"tooltipDecimalNumber"}}},{"label":"X axis","name":"xAxis","show":true,"children":{"show":{"label":"Show","type":"switch","default":true,"value":true,"name":"show"},"axistitle":{"label":"Axis title","type":"switch","default":true,"value":false,"name":"axistitle"},"titleText":{"label":"Title text","type":"text","default":"","value":"","name":"titleText"},"textSize":{"label":"Text Size","type":"number","default":"13","value":11,"name":"textSize"},"alignment":{"label":"Alignment","type":"btnSelect","default":"left","options":[{"name":"left","icon":"ms-Icon ms-Icon--AlignHorizontalLeft","value":"left","text":""},{"name":"center","icon":"ms-Icon ms-Icon--AlignHorizontalCenter","value":"center","text":""},{"name":"right","icon":"ms-Icon ms-Icon--AlignHorizontalRight","value":"right","text":""}],"value":"center","name":"alignment"},"gridLine":{"label":"Show Gridline","type":"switch","default":true,"value":false,"name":"gridLine"},"gridLineWidth":{"label":"Gridline Width","type":"number","default":1,"value":1,"name":"gridLineWidth"},"gridLineColor":{"label":"Gridline Color","type":"color","default":"#e6e6e6","value":"#e6e6e6","name":"gridLineColor"},"gridLineType":{"label":"Gridline Type","type":"select","default":"LongDash","options":[{"value":"LongDash","text":"Dashed"},{"value":"Dot","text":"Dot"},{"value":"Solid","text":"Solid"}],"value":"LongDash","name":"gridLineType"},"unit":{"label":"Display Unit","type":"select","default":"auto","options":[{"value":"auto","text":"Auto"},{"value":"none","text":"None"},{"value":"thousands","text":"Thousands"},{"value":"milions","text":"Milions"},{"value":"bilions","text":"Bilions"},{"value":"trilions","text":"Trilions"}],"value":"none","name":"unit"}}},{"label":"Y Axis 1","name":"yAxis1","show":true,"children":{"show":{"label":"Show","type":"switch","default":true,"value":true,"name":"show"},"axistitle":{"label":"Axis title","type":"switch","default":true,"value":false,"name":"axistitle"},"titleText":{"label":"Title text","type":"text","default":"","value":"","name":"titleText"},"textSize":{"label":"Text Size","type":"number","default":"13","value":11,"name":"textSize"},"alignment":{"label":"Alignment","type":"btnSelect","default":"left","options":[{"name":"left","icon":"ms-Icon ms-Icon--AlignHorizontalLeft","value":"left","text":""},{"name":"right","icon":"ms-Icon ms-Icon--AlignHorizontalRight","value":"right","text":""}],"value":"left","name":"alignment"},"gridLine":{"label":"Show Gridline","type":"switch","default":true,"value":true,"name":"gridLine"},"gridLineWidth":{"label":"Gridline Width","type":"number","default":1,"value":1,"name":"gridLineWidth"},"gridLineColor":{"label":"Gridline Color","type":"color","default":"#e6e6e6","value":"#e6e6e6","name":"gridLineColor"},"gridLineType":{"label":"Gridline Type","type":"select","default":"LongDash","options":[{"value":"LongDash","text":"Dashed"},{"value":"Dot","text":"Dot"},{"value":"Solid","text":"Solid"}],"value":"LongDash","name":"gridLineType"},"unit":{"label":"Display Unit","type":"select","default":"auto","options":[{"value":"auto","text":"Auto"},{"value":"none","text":"None"},{"value":"thousands","text":"Thousands"},{"value":"milions","text":"Milions"},{"value":"bilions","text":"Bilions"},{"value":"trilions","text":"Trilions"}],"value":"auto","name":"unit"}}},{"label":"General","name":"general","show":true,"children":{"fontFamily":{"label":"Font family","type":"select","default":"roboto","options":[{"value":"roboto","text":"Roboto"}],"value":"roboto","name":"fontFamily"},"bgColor":{"label":"Background Corlor","type":"color","default":"#ffffff","value":"#ffffff","name":"bgColor"},"borderWidth":{"label":"Border Width","type":"number","default":0,"value":1,"name":"borderWidth"},"borderColor":{"label":"Border Corlor","type":"color","default":"#000000","value":"#e5e5e5","name":"borderColor"},"colorPalette":{"label":"Color palette","type":"colorArray","default":[],"value":["#01B8AA","#374649","#FD625E","#F2C80F","#5F6B6D","#8AD4EB","#FE9666","#A66999 #73B761","#4A588A","#ECC846","#CD4C46","#71AFE2","#8D6FD1","#EE9E64","#95DABB #074650","#009292","#FE6DB6","#FEB5DA","#480091","#B66DFF","#B5DAFE","#6DB6FF"],"name":"colorPalette"}}},{"label":"Title","name":"title","show":true,"children":{"show":{"label":"Show","type":"switch","default":true,"value":true,"name":"show"},"titleText":{"label":"Title text","type":"text","default":"","value":"","name":"titleText"},"fontColor":{"label":"Font Corlor","type":"color","default":"#344750","value":"#344750","name":"fontColor"},"textSize":{"label":"Text Size","type":"number","default":"13","value":14,"name":"textSize"},"alignment":{"label":"Alignment","type":"btnSelect","default":"left","options":[{"name":"left","icon":"ms-Icon ms-Icon--AlignHorizontalLeft","value":"left","text":""},{"name":"center","icon":"ms-Icon ms-Icon--AlignHorizontalCenter","value":"center","text":""},{"name":"right","icon":"ms-Icon ms-Icon--AlignHorizontalRight","value":"right","text":""}],"value":"center","name":"alignment"},"bgColor":{"label":"Background Corlor","type":"color","default":"#ffffff","value":"#ffffff","name":"bgColor"}}}],"condition":[]}
			,
			testData:[{"Ngày chứng từ":"2020-12-01","Số người làm":19},{"Ngày chứng từ":"2020-12-02","Số người làm":21},{"Ngày chứng từ":"2020-12-03","Số người làm":19},{"Ngày chứng từ":"2020-12-04","Số người làm":20},{"Ngày chứng từ":"2020-12-05","Số người làm":17},{"Ngày chứng từ":"2020-12-06","Số người làm":17},{"Ngày chứng từ":"2020-12-07","Số người làm":18},{"Ngày chứng từ":"2020-12-08","Số người làm":20},{"Ngày chứng từ":"2020-12-09","Số người làm":18},{"Ngày chứng từ":"2020-12-10","Số người làm":20},{"Ngày chứng từ":"2020-12-11","Số người làm":19},{"Ngày chứng từ":"2020-12-12","Số người làm":13},{"Ngày chứng từ":"2020-12-13","Số người làm":19},{"Ngày chứng từ":"2020-12-14","Số người làm":21},{"Ngày chứng từ":"2020-12-15","Số người làm":22},{"Ngày chứng từ":"2020-12-16","Số người làm":21},{"Ngày chứng từ":"2020-12-17","Số người làm":20},{"Ngày chứng từ":"2020-12-18","Số người làm":28},{"Ngày chứng từ":"2020-12-19","Số người làm":20},{"Ngày chứng từ":"2020-12-20","Số người làm":18},{"Ngày chứng từ":"2020-12-21","Số người làm":22},{"Ngày chứng từ":"2020-12-22","Số người làm":24},{"Ngày chứng từ":"2020-12-23","Số người làm":22},{"Ngày chứng từ":"2020-12-24","Số người làm":19},{"Ngày chứng từ":"2020-12-25","Số người làm":16},{"Ngày chứng từ":"2020-12-26","Số người làm":21},{"Ngày chứng từ":"2020-12-27","Số người làm":22}]
		}
	},
	methods:{
		testRenderChart(){
			debugger
			let stackedbar = new Stackedbar();
			stackedbar.translate(this.testRowconfig,this.testData);
		},
		onSearch(vl){
			if(this.delayTimer){
                clearTimeout(this.delayTimer);
            }
            this.delayTimer = setTimeout((self) => {
                this.loadding = true;
				if (!vl) {
					self.openPanel = [];
					self.loadding = false;
                }else{
					self.setOpenPanelStyleConfig();
				}
                self.dashboardStyleConfig.postMessage({
                    action: 'searchStyleConfig',
                    data:{
                        styleConfig: self.styleConfig,
                        vl:vl
                    }
                });
            }, 300,this);
		},   
		setOpenPanelStyleConfig(){
			this.openPanel = [];
			for (let i = 0; i < Object.keys(this.styleConfig).length; i++) {
				this.openPanel.push(i);
			}
			setTimeout((self) => {
				self.loadding = false;
			}, 100,this);
		},
		searchStyleConfigAfter(data){
			this.styleConfig = data.styleConfig;
		},
		listenFromWorker(){
            let self = this;
            this.dashboardStyleConfig.addEventListener("message", function (event) {
                let data = event.data;
                let action = data.action;
                if(self[action]){
                    self[action](data.data);
                } else {
                    console.error(` action ${action} not found `);
                }
            });
        },
	},
	created(){
        this.dashboardStyleConfig = new DashboardStyleConfig();
        this.listenFromWorker();
    }

}
</script>

<style>

</style>