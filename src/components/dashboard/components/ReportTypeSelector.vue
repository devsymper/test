<template>
	<div class="symper-report-type-selector h-100 d-flex flex-column">
		<v-expansion-panels class="report-type-select" v-model="panels">
			<v-expansion-panel>
				<v-expansion-panel-header>
					<div class="mt-2 mb-2 ml-1 title-all-chart-types">
						<span class="mt-1 font-weight-bold" style="font-size: 13px !important">
							{{$t('bi.dashboard.title-visualization')}}
						</span>
					</div>
				</v-expansion-panel-header>
				<v-expansion-panel-content>
					<div class="all-chart-types">
						<span v-for="(item , i ) in chartConfigs" :key="i" >
							<img 
								:title="$t('bi.chart.'+i)" 
								:src="'img/dashboard/report-builder/'+i+'.png'" 
								@click="selectCellType(i)"
								class="report-type-img" 
								:class="{'selected-report-type':i == currentCellConfigsType }"
								height="32px" 
								width="32px" 
							>
						</span>
					</div>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>
		<div>
			<v-tabs
				v-model="tabs"
				fixed-tabs
			>
				<v-tabs-slider></v-tabs-slider>
				<v-tab
					class="primary--text"
					v-for="(item, i ) in tabItems"
					:key="i"
				>
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<div class="h-100" v-on="on" style="width: 50px"> 
								<v-icon
									small
									class="mt-4"
								>
									{{item.icon}}
								</v-icon>
							</div>
						</template>
						<span> {{item.title}} </span>
					</v-tooltip>
				</v-tab>
			</v-tabs>
		</div>
		<div class="h-100 w-100">
			<ColumnConfig 
				v-if="tabs == 0"
				:instanceKey="instanceKey"
				:height="configHeight"
			/>
			<StyleConfig 
				v-if="tabs == 1"
				:configHeight="configHeight"
				:instanceKey="instanceKey"
			/>
			<ConditionConfig 
				:instanceKey="instanceKey"
				v-if="tabs == 2"
				:height="configHeight"
			/>
		</div>
	</div>
</template>

<script>
import ColumnConfig from "@/components/dashboard/components/reportConfig/ColumnConfig"
import ConditionConfig from "@/components/dashboard/components/reportConfig/ConditionConfig"
import StyleConfig from "@/components/dashboard/components/reportConfig/StyleConfig"
import { util } from '@/plugins/util.js';
import { autoLoadChartClasses } from "@/components/dashboard/configPool/reportConfig.js";
var mapTypeToClass = autoLoadChartClasses();

export default {
	props:{
		showReportConfig:{
			type: Boolean,
		},
		instanceKey:{
			type: Number,
			default: 0
		}

	},
	computed:{
		currentCellConfigsType(){
			let obj = this.$store.state.dashboard.allDashboard[this.instanceKey].currentCellConfigs
			if(Object.keys(obj).length){
				return obj.sharedConfigs.type
			}else{
				return ''
			}
		},
	
	},
	components:{
		ColumnConfig,
		ConditionConfig,
		StyleConfig
	},
	data(){
		return{
			tabs: null,
			configHeight: 0,
			panels: 0,
			tabItems:{
				columnConfig:{
					title: this.$t('bi.dashboard.column-config'),
					icon: 'mdi-table-column-width'
				},
				styleConfig:{
					title: this.$t('bi.dashboard.style-config'),
					icon: 'mdi-box-cutter'
				},
				conditionConfig:{
					title: this.$t('bi.dashboard.condition-config'),
					icon: 'mdi-checkbox-multiple-marked-outline'
				},

			},
			chartConfigs: mapTypeToClass
		}
	},
	watch:{
		tabs(val){
		},
		panels:{
			deep: true,
			immediate: true,
			handler(val){
				setTimeout((self) => {
					self.getConfigsHeight(val)
				}, 500, this);
			}
		},
		showReportConfig(val){
			let value = val == true ? 0 : 1090
			$('.symper-report-type-selector').css({transform:'translateX('+value+'px)','transition-duration': '1s'})
		}
	},
	methods:{
		getConfigsHeight(collapse){
			let titleHeight 
			if(collapse != 0){
				titleHeight = 40
			}else{
				titleHeight = $(document.getElementsByClassName('report-type-select')).height()
			}
			this.configHeight = util.getComponentSize(this).h - titleHeight - 60
		},
		selectCellType(type){
			this.$emit('selected-type' , type)
		},
		collapse(){
			this.$emit('collapse-report-config')
		}
	},
	mounted(){
		
	}
}
</script>

<style scoped>
.symper-report-type-selector >>> .v-expansion-panel::before{
	box-shadow: unset !important;
}
.symper-report-type-selector >>> .v-expansion-panel-header{
	padding: unset !important;
	background-color: #EFEFEF !important;
	min-height: unset !important;
	height: 40px;
}
.symper-report-type-selector >>> .v-expansion-panel-content__wrap{
	padding: unset !important;
	margin-left: 6px
}
.symper-report-type-selector >>> .v-expansion-panel--active > .v-expansion-panel-header {
	min-height: unset !important;
	height: 40px;
}
.symper-report-type-selector >>> .v-tab{
	min-width: unset !important;
	padding: unset !important;
}
.symper-report-type-selector >>> .v-slide-group__wrapper{
	background-color: #EFEFEF;
}
.symper-report-type-selector >>> .v-tab--active,
.symper-report-type-selector >>> .v-tabs-slider{
	color: orange !important;
}
</style>
<style>
.symper-report-type-selector{
	border-right: 1px solid lightgray;
	border-left: 1px solid lightgray;
}
.report-type-img{
	margin: 2px;
	padding: 6px;
	cursor: pointer;
}
.report-type-img:hover{
	border-radius: 2px;
	background-color: lightgray;
}
.selected-report-type{
	background-color: #FEEDE1;
	border: 1px solid orange;
}
</style>