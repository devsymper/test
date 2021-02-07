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
						<v-expansion-panel-header ><span class="fs-13 pl-1">{{groupData.label}}</span> </v-expansion-panel-header>
						<v-expansion-panel-content>
							<form-tpl
								class="s-style-config"
								:allInputs="groupData.children"
								@input-value-changed="getChangeInput"
							></form-tpl>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</template>
		</VuePerfectScrollbar>

		<v-dialog
			v-model="isShowDialog"
			max-width="700px"
			scrollable
		>
			<v-card>
			<v-card-title>
				<span class="fs-16">Config column conditional format</span>
			</v-card-title>
			<v-card-text>
				<div class="w-100 ">
					<TableConditionalFormatSetting ref="tableConditionalFormatSetting" :config="selectingConditionFormat"/>
				</div>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					color="blue darken-1"
					text
					class="btn-add"
					@click="applyConditionSetting"
				>
					Apply
				</v-btn>
				<v-btn
				color="red darken-1"
				text
				@click="isShowDialog = false"
				>
					Cancel
				</v-btn>
			
			</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
	
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import FormTpl from "@/components/common/FormTpl.vue";
import DashboardStyleConfig from 'worker-loader!@/worker/dashboard/dashboard/DashboardStyleConfig.Worker.js';
import TableConditionalFormatSetting from "@/components/dashboard/components/TableConditionalFormatSetting";
import { util } from '../../../../plugins/util';

export default {
	components:{
		VuePerfectScrollbar,
		FormTpl,
		TableConditionalFormatSetting,
	},
	props:{
		instanceKey:{
			default: null
		}
	},
	computed:{
		storeDashboard(){
			return this.$store.state.dashboard;
		},
		currentCellConfig(){
			return this.$store.state.dashboard.allDashboard[this.instanceKey].currentCellConfigs;
		},
		styleConfig(){
			return this.$store.state.dashboard.allDashboard[this.instanceKey].currentCellConfigs.rawConfigs.style;
		}
	},
	data(){
		return{
			dashboardStyleConfig:null,
			openPanel:[],
			loadding:false,
			isShowDialog:false,
            selectingConditionFormat: null,

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
		getChangeInput(name,input,data){
			if (name == 'conditionalFormatCondition') {
				let condItem = data.condItem;
				let condIndex = data.condIdx;
				let columns = this.currentCellConfig.rawConfigs.setting.value.selectedColums;
				for (let col of columns) {
					col.columnName = col.name;
					col.uid = col.name;
				}
				this.$set(condItem, 'listColumns', columns);
				this.selectingConditionFormat = null;
				this.selectingConditionFormat = util.cloneDeep(condItem);
				this.isShowDialog = true;
				this.condFormatTmpInfo = {
					condIndex,name:name
				};
				setTimeout((self) => {
					self.$refs.tableConditionalFormatSetting.initData();                
				}, 100, this);
			}else{
				this.$evtBus.$emit('bi-report-change-display', {
                    type: 'style',
                    id: this.currentCellConfig.sharedConfigs.cellId,
                    instanceKey: this.instanceKey
                });
			}
		},
		applyConditionSetting(){
			this.styleConfig.conditionalFormat.children[this.condFormatTmpInfo.name].value[this.condFormatTmpInfo.condIndex] = this.selectingConditionFormat;
			this.isShowDialog = false;
		},
		removeCondFormatItem(data){
			let condIndex = data.condIdx;
            this.styleConfig.conditionalFormat.children.conditionalFormatCondition.value.splice(condIndex, 1);
		}
	},
	created(){
		let self = this;
        this.dashboardStyleConfig = new DashboardStyleConfig();
		this.listenFromWorker();
		this.$evtBus.$on('dashboard-remove-conditional', (data) =>{
            self.removeCondFormatItem(data);
        })
    }

}
</script>

<style scoped>
.s-style-config >>> .v-input--switch .v-input__control {
	padding-left: 10px;
    padding-top: 4px;
}
.s-style-config >>> .v-input--switch .v-input__control .v-input__slot{
	background-color: white!important;
}
.s-style-config >>> .v-select .v-input__control{
	height: 28px;
}
.v-menu__content{
	font-size: 13px;
}
</style>