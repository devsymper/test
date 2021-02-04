<template>
	<div class="h-100 d-flex flex-column">
		<div ref="commonConfig" class="mx-2">
			<FormTpl 
				:titleSize="'normal'"
				:allInputs="commonInputs"
				@input-value-changed="handleValueChange"
			/>
			<div v-if="commonInputs.saveAsDataset.value" class="mt-1 pb-2 d-flex justify-space-between">
				<div class="fs-12 mr-2 h-100" style="line-height: 30px">
					Làm mới mỗi
				</div>
				<PeriodTimeConfig />
			</div>
		</div>

		<PerfectScrollbar :style="{height: nodeConfigHeight + 'px'}" class="px-2">
			<component 
				:height="nodeConfigHeight"
				:is="nodeConfigTag"
				:nodeData="selectingNode">
			</component>
		</PerfectScrollbar>
	</div>
</template>

<script>
import PeriodTimeConfig from '@/components/dataflow/components/PeriodTimeConfig'
import FormTpl from "@/components/common/FormTpl.vue";
import { autoLoadNodeClasses } from "@/components/dataflow/configPool/dataflowConfig.js";
import _cloneDeep from "lodash/cloneDeep";
import { util } from '../../../plugins/util';
import PerfectScrollbar from '@/components/common/PerfectScrollBar'


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
	watch: {
		selectingNode: {
			deep: true,
			handler(){
				this.setCommonValue();
			}
		}
	},
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
		PerfectScrollbar
	},
	mounted(){
		this.calcNodeConfigHeight();
	},
	created(){
	},
	computed:{
		nodeConfigTag(){
			let currentNode = this.$store.state.dataflow.allDataflow[this.instanceKey].selectedWidget;
			let currentClassName = mapTypeToNodeClass[currentNode.type].name;
			return currentClassName;
		},
		selectingNode(){
			return this.$store.state.dataflow.allDataflow[this.instanceKey].selectedWidget;
		}
	},
	data(){
		return {
			nodeConfigHeight: 200,
			allDatasetColumn: {},
			commonInputs: {
				wgName: {
					"title": this.$t('common.name'),
					"type": "text",
					"value": '',
				},
				wgDes: {
					"title": this.$t('common.description'),
					"type": 'text',
					"value": '',
				},
				saveAsDataset:{
					"title": 'Save result as dataset',
					"type": 'checkbox',
					"value": false,
				}
			}
		}	
	},
	methods:{
		handleValueChange(name, inputInfo, data){
			for(let key in this.commonInputs){
				this.selectingNode.configs[key] = this.commonInputs[key].value;
			}
			this.$emit('node-name-changed', {
				name,
				value: data
			});
			if(name == 'saveAsDataset'){
				if(data){
					this.selectingNode.configs.saveAs = ["Save result as Dataset"];
				}else{
					this.selectingNode.configs.saveAs = [];
				}
				this.toggleSaveAsDatasetConfig();
				setTimeout((self) => {
					self.calcNodeConfigHeight();
				}, 0, this);
			}
		},
		calcNodeConfigHeight(){
			this.nodeConfigHeight = util.getComponentSize(this).h - util.getComponentSize(this.$refs.commonConfig).h;
		},
		setCommonValue(){
			let node = this.$store.state.dataflow.allDataflow[this.instanceKey].selectedWidget;
			this.commonInputs.wgName.value = node.configs.wgName;
			this.commonInputs.wgDes.value = node.configs.wgDes;
			this.commonInputs.saveAsDataset.value = node.configs.saveAs.length ? true : false;
			this.toggleSaveAsDatasetConfig();
		},
		toggleSaveAsDatasetConfig(){
			if(this.commonInputs.saveAsDataset.value){
				this.$set(this.commonInputs, 'nameToSaveAs', {
					"title": this.$t('bi.dataset.title-add'),
					"type": "text",
					"value": this.selectingNode.configs.nameToSaveAs,
				});
			}else{
				this.$delete(this.commonInputs, 'nameToSaveAs')
			}
		}
	}
}
</script>

<style>

</style>