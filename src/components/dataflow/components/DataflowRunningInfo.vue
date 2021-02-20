<template>
<div class="h-100 content-running-infor">
	<Preloader ref="preLoaderView"/>
	<v-tabs v-model="selectingTab">
		<v-tab v-for="(item, i) in runningInforTab" :key="i">
			<v-icon small class="mr-1">{{item.icon}}</v-icon>
			<span>{{item.title}}</span>
		</v-tab>
	</v-tabs>
	<div class="w-100 h-100">
		<v-tabs-items v-model="selectingTab">
		 	<v-tab-item :value="0">
				<OutputData ref="showlistData" @data-loaded="hidePreloader" :contentRunningHeight="contentRunningHeight" :instanceKey="instanceKey" />
			 </v-tab-item>
		 	<v-tab-item :value="1">
				<OutputColumn :contentRunningHeight="contentRunningHeight" :instanceKey="instanceKey"  />
			 </v-tab-item>
		 	<v-tab-item :value="2">
				<Message :instanceKey="instanceKey"  />
			 </v-tab-item>
		</v-tabs-items>
	</div>
</div>
</template>

<script>
import Message from "@/components/dataflow/components/runningInfo/Message" 
import OutputColumn from "@/components/dataflow/components/runningInfo/OutputColumn" 
import Preloader from '@/components/common/Preloader';
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
		OutputData,
		Preloader
	},
	data(){
		return {
			selectingTab:"outputData",
			containerHeight:0,
			contentRunningHeight: 0,
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
		this.hidePreloader()
	},
	created(){
		this.reCalcHeight()
	},
	methods:{
		showPreloader(){
			this.$refs.preLoaderView.show()
		},
		hidePreloader(){
			this.$refs.preLoaderView.hide()
		},
		reCalcHeight(){
			this.contentRunningHeight = $(document.getElementsByClassName('content-running-infor')).height()
		},
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