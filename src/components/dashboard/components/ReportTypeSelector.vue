<template>
	<div class="symper-report-type-selector h-100 d-flex flex-column">
		<div class="mt-2 mb-2">
			<v-icon small>
				mdi-chevron-right
			</v-icon>
			<span>
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
					height="20px" 
					width="20px" 
					alt=""
				>
			</span>
		</div>
	</div>
</template>

<script>
export default {
	data(){
		return{
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
	}
}
</script>

<style>
.symper-report-type-selector{
	width: 190px;
	/* background-color: lightgray; */
}
.report-type-img{
	margin: 8px;
}
</style>