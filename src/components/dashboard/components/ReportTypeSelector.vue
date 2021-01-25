<template>
	<div class="symper-report-type-selector h-100 d-flex flex-column">
		<div class="mt-2 mb-2 ml-1 title-all-chart-types">
			<v-btn 
				icon
				tile
				small
				@click="collapse"
			>
				<v-icon >
					mdi-chevron-right
				</v-icon>
			</v-btn>
			<span class="mt-1 font-weight-bold" style="font-size: 13px !important">
				{{$t('bi.dashboard.title-visualization')}}
			</span>
		</div>
		<div class="all-chart-types">
			<span v-for="(item , i ) in chartConfigs" :key="i" >
				<img 
					:title="i" 
					:src="'img/dashboard/report-builder/'+i+'.png'" 
					@click="selectCellType(i)"
					class="report-type-img" 
					:class="{'selected-report-type':i == currentCellConfigsType }"
					height="32px" 
					width="32px" 
				>
			</span>
		</div>
		<div >
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
						<template v-slot:activator="{ on, attrs }">
							<v-icon
								v-bind="attrs"
								v-on="on"
								small 
								>
								{{item.icon}}
							</v-icon>
						</template>
						<span> {{item.title}} </span>
					</v-tooltip>
				</v-tab>
			</v-tabs>
		</div>
		<div style="height: calc(100% - 310px);">
			<ColumnConfig 
				v-if="tabs == 0"
				:instanceKey="instanceKey"
				:height="height"
			/>
			<StyleConfig 
				v-if="tabs == 1"
				:height="height"
				:instanceKey="instanceKey"
			/>
			<ConditionConfig 
				:instanceKey="instanceKey"
				v-if="tabs == 2"
				:height="height"
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
		}
	},
	components:{
		ColumnConfig,
		ConditionConfig,
		StyleConfig
	},
	data(){
		return{
			tabs: null,
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
		showReportConfig(val){
			let value = val == true ? 0 : 1090
			$('.symper-report-type-selector').css({transform:'translateX('+value+'px)','transition-duration': '1s'})
		}
	},
	methods:{
		selectCellType(type){
			this.$emit('selected-type' , type)
		},
		collapse(){
			this.$emit('collapse-report-config')
		}
	},
	mounted(){
		let titleHeight = $(document.getElementsByClassName('title-all-chart-types')).height()
		let allChartSelectorHeight = $(document.getElementsByClassName('all-chart-types')).height()
		this.height = util.getComponentSize(this).h - titleHeight - allChartSelectorHeight - 100;
	}
}
</script>

<style scoped>
.symper-report-type-selector >>> .v-tab{
	min-width: unset !important;
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