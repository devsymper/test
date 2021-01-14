<template>
	<div class="symper-report-type-selector h-100 d-flex flex-column">
		<div class="mt-2 mb-2 ml-1">
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
			<span class="mt-1" style="font-size: 18px !important">
				{{$t('bi.dashboard.title-visualization')}}
			</span>
		</div>
		<div>
			<span v-for="(item , i ) in chartConfigs" :key="i">
				<img 
					:title="i" 
					:src="'img/dashboard/report-builder/'+i+'.png'" 
					@click="selectCellType(i)"
					class="report-type-img" 
					height="32px" 
					width="32px" 
					alt=""
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
		<div>
			<ColumnConfig v-if="tabs == 0"/>
			<StyleConfig v-if="tabs == 1"/>
			<ConditionConfig v-if="tabs == 2"/>
		</div>
	</div>
</template>

<script>
import ColumnConfig from "@/components/dashboard/components/reportConfig/ColumnConfig"
import ConditionConfig from "@/components/dashboard/components/reportConfig/ConditionConfig"
import StyleConfig from "@/components/dashboard/components/reportConfig/StyleConfig"

export default {
	props:{
		showReportConfig:{
			type: Boolean,
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
			chartConfigs:{
				area:{},
				card:{},
				donut:{},
				editor:{},
				clusteredBar:{},
				clusteredColumn:{},
				filter:{},
				global:{},
				line:{},
				lineAndClusteredColumn:{},
				lineAndStackedColumn:{},
				pie:{},
				pivot:{},
				stackedArea:{},
				stackedBar:{},
				stackedBar100:{},
				stackedColumn:{},
				stackedColumn100:{},
				table:{},
				treeMap:{},
			}
		}
	},
	watch:{
		tabs(val){
		},
		showReportConfig(val){
			let value = val == true ? 0 : 1090
			debugger
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
	width: 190px;
	border-right: 1px solid lightgray;
	border-left: 1px solid lightgray;
}
.report-type-img{
	margin: 2px;
	padding: 6px;
}
.report-type-img:hover{
	border-radius: 2px;
	background-color: lightgray;
}
</style>