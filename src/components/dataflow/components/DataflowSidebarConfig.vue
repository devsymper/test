<template>
	<div class="ml-2 mr-2 h-100 d-flex flex-column">
		<FormTpl 
			:allInputs="allInputs"
		/>
		<div v-if="allInputs.saveAsDataset.value" class="ml-4 mr-4 d-flex flex-column">
			<FormTpl 
				:allInputs="formTplDataset"
			/>
			<div class="d-flex mt-2 align-center">
				<span class="fs-13 mr-2">
					Auto update period time 
				</span>
				<PeriodTimeConfig />
			</div>
		</div>
		<!-- <component 
			:is="nodeConfigTag"
			:nodeData="selectingNode">
		</component> -->
		<transposeTable 
			:nodeData="selectingNode"
			style="height: calc(100% - 150px)"
		/>
	</div>
</template>

<script>
import PeriodTimeConfig from '@/components/dataflow/components/PeriodTimeConfig'
import FormTpl from "@/components/common/FormTpl.vue";
import { autoLoadNodeClasses } from "@/components/dataflow/configPool/dataflowConfig.js";
import _cloneDeep from "lodash/cloneDeep";
import TransposeTable from './configs/TransposeTable.vue';


let mapTypeToNodeClass = autoLoadNodeClasses();
function autoImportDataflowNodeConfig() {
    var context = require.context('@/components/dataflow/components/configs', true, /\.(vue)$/);
    var comps = {};
    let filename = '';
    context.keys().forEach((filePath) => {
        filename = filePath.match(/[^\\/:*?"<>|\r\n]+$/)[0].replace('.vue', '');
        comps[filename] = context(filePath).default;
    });
    return comps;
}
var nodeConfigComps = autoImportDataflowNodeConfig();


export default {
	props: {
        instanceKey: {
            defaul: ''
        },
        action: {
            defaul: 'view'
        },
	},
	components:{
		...nodeConfigComps,

		FormTpl,
		PeriodTimeConfig,
		TransposeTable,
	},
	computed:{
		nodeConfigTag(){
			let currentNode = this.$store.state.dataflow.allDataflow[this.instanceKey].selectedWidget;
			let currentClassName = mapTypeToNodeClass[currentNode.type].name;
			return currentClassName;
		},
		selectingNode(){
			this.$store.state.dataflow.allDataflow[this.instanceKey].selectedWidget;
		}
	},
	data(){
		return {
			dashboardDatasetWorker: null,
			allDatasetColumn:{},
			allInputs:{
				name: {
					"title": this.$t('common.name'),
					"type": "text",
					"value": "",
					"info": "",
				},
				description: {
					"title": this.$t('common.description'),
					"type": 'text',
					"value": "",
					"info": "",
				},
				saveAsDataset:{
					"title": 'Save result as dataset',
					"type": 'checkbox',
					"value": false,
				}
			},
			formTplDataset:{
				name: {
					"title": this.$t('bi.dataset.title-add'),
					"type": "text",
					"value": "",
					"info": "",
				},
				
			}
		}	
	},
	methods:{
		
	}
}
</script>

<style>

</style>