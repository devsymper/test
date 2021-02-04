<template>
<div>
	<v-tabs v-model="selectingTab">
		<v-tab v-for="(item, i) in runningInforTab" :key="i">
			<v-icon small class="mr-1">{{item.icon}}</v-icon>
			<span>{{item.title}}</span>
		</v-tab>
	</v-tabs>
	<div class="w-100 h-100 content-running-info">
		<Message :instanceKey="instanceKey" v-if="selectingTab == 2" />
		<OutputColumn :instanceKey="instanceKey" v-if="selectingTab == 1" />
		<OutputData ref="showlistData" :instanceKey="instanceKey" v-if="selectingTab == 0" />
	</div>
</div>
</template>

<script>
import Message from "@/components/dataflow/components/runningInfo/Message" 
import OutputColumn from "@/components/dataflow/components/runningInfo/OutputColumn" 
import OutputData from "@/components/dataflow/components/runningInfo/OutputData" 
import { util } from '@/plugins/util.js';

export default {
	props: {
        action: {
            default: 'create'
        },
        instanceKey: {
            default: ''
        },
	},
	components:{
		Message,
		OutputColumn,
		OutputData
	},
	data(){
		return {
			selectingTab:"outputData",
			containerHeight:0,
			runningInforTab:{
				outputData:{
					icon: 'mdi-table-large',
					title: "Output data"
				},
				outputColumns:{
					icon: 'mdi-view-column-outline',
					title: "Output columns"
				},
				message:{
					icon: 'mdi-message-outline',
					title: "Message"
				},
			}
		}
	},
	mounted(){
		this.calcContainerHeight()
	},
	methods:{
		calcContainerHeight(){
			this.containerHeight = util.getComponentSize(this).h;
		},
		getRunningData(idNode, info){
			this.$refs.showlistData.getData({
				idNode,
				info
			});
		}
	}
}
</script>

<style>

</style>