<template>
	<div>
		<v-dialog
			v-model="showDialog"
			persistent
			:class="{'h-100 w-100' : tab == 'tab-2', 'tab-obj-types':tab == 'tab-1' }"
		>
			<v-tabs
				v-model="tab"
				v-show="false"
			>
			</v-tabs>
			<v-tabs-items v-model="tab">
				<v-tab-item
				value='tab-1'
				>
					<div class="d-flex pt-2 pr-4 pl-4 " style="height:500px">
						<div class="dialog-object-in-service d-flex flex-column h-100 w-100" style="z-index:1000;background-color: #ffffff ; position: relative">
							<div>
								Danh sách các loại object có thể đồng bộ
							</div>
							<div 
								v-for="(item,i) in listObjectType"
								:key="i"
							>
								<span 
									class=" mt-10 ml-2 text-uppercase object-type-title"
									@click="handleObjectViewDetail(item)"
								>
									{{item}}
								</span>
							</div>	
							<!-- <div class="d-flex btn-header-popup" >
								<v-btn 
									class="mr-2 font-normal fs-13"
									depressed
									tile
									small
									@click="handletest"
								>
								Test cpn đồng bộ
								</v-btn>
								<v-btn 
									class="mr-2 font-normal fs-13"
									depressed
									tile
									small
									@click="handleObjectViewDetail"
								>
								Test
								</v-btn>
								<v-btn 
									class="mr-2 font-normal fs-13"
									depressed
									tile
									small
								>
								Chọn
								</v-btn>
								<v-btn 
									class="mr-2 font-normal fs-13"
									depressed
									tile
									small
									@click="handleClickCheck"
								>
								Kiểm tra
								</v-btn>
								<v-btn 
									class="mr-2 font-normal fs-13"
									depressed
									tile
									small
									@click="handleClickSync"
								>
								Đồng bộ
								</v-btn>
							</div>
							<ListItem 
								:showExportButton="false"
								:containerHeight="tableHeight"
								:dialogMode="true"
								@close-popup="handleCloseEvent"
								style="margin-left:10px"
							/> -->
							
						</div>
						<div>
							<v-btn
								icon
								tile
								@click="handleCloseEvent"
							>
								<v-icon>
									mdi-close
								</v-icon>
							</v-btn>
						</div>
					</div>	
				</v-tab-item>	
				<v-tab-item
					value='tab-2'
				>
					<div class="dialog-object-in-service" style="z-index:1000;background-color: #ffffff ; position: relative">
						<ObjectDetail 
							:tableHeight="tableHeight"
							@back="tab = 'tab-1'"
							@close-popup="handleCloseEvent"
							:getListUrl="getListUrls"
							:currentObjectType="currentObjectType"
						/>
					</div>
				</v-tab-item>	
			</v-tabs-items>	
		</v-dialog>
		<DialogsConfirmSync 
			:showDialog="showDialogSync"
			@cancel="showDialogSync = false"
		/>
	</div>
</template>

<script>
import ListItem from "@/components/common/ListItems"
import DialogsConfirmSync from './DialogsConfirmSync'
import { appConfigs } from "@/configs.js";
import ObjectDetail from './ObjectDetail'
import {environmentManagementApi} from "@/api/EnvironmentManagement"
export default {
	components:{
		ListItem,
		ObjectDetail,
		DialogsConfirmSync	
	},
	computed:{
		listObjectType(){
			let envStore = this.$store.state.environmentManagement
			return envStore.listObjectTypeInService[envStore.currentServiceType]
		}
	},
	props:{
		showDialog:{
			type: Boolean,
			default: false
		},
		tableHeight:{
			type: Number,
			default: 0
		}
	},
	data(){
		return{
			tab: 'tab-1',
			getListUrls: '',
			showDialogSync: false,
			currentObjectType: ""
		}
	},
	methods:{
		handleCloseEvent(){
			this.$emit('close-popup')
		},
		handleClickSync(){
			
		},
		handleObjectViewDetail(item){
			this.currentObjectType = item
			this.tab = 'tab-2'
			let type = this.$store.state.environmentManagement.currentServiceType
			this.getListUrls = appConfigs.envDomain[type]+'env/'+item+'s'
		},
		handletest(){
			this.showDialogSync = true 
		}
	}
	
}
</script>

<style scoped>

.dialog-object-in-service >>> .btn-header-popup {
	position: absolute;
	top: 15px;
	right: 235px;
}
.dialog-object-in-service >>> .object-type-title{
	cursor: pointer;
}
.dialog-object-in-service >>> .object-type-title:hover{
	border-bottom: 1px solid lightgray;
}
.dialog-object-in-service >>> .tab-obj-types{
	width: 300px;
	height: 300px;
}
</style>