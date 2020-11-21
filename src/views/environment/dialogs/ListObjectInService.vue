<template>
	<div>
		<v-dialog
			v-model="showDialog"
			persistent
			class="h-90 w-90"
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
					<div class="dialog-object-in-service" style="z-index:1000;background-color: #ffffff ; position: relative">
						<div class="d-flex btn-header-popup" >
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
						/>
						
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
import ObjectDetail from './ObjectDetail'
export default {
	components:{
		ListItem,
		ObjectDetail,
		DialogsConfirmSync	
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
			showDialogSync: false,
		}
	},
	methods:{
		handleCloseEvent(){
			this.$emit('close-popup')
		},
		handleClickSync(){
			
		},
		handleClickCheck(){

		},
		handleObjectViewDetail(){
			this.tab = 'tab-2'
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
</style>