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
		}
	},
	methods:{
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