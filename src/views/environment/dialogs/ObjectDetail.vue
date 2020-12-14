<template>
	<div style="position:relative" class="object-detail">
		<v-btn
			depressed
			small
			icon
			tile
			style="position:absolute; left:0; top:11px"
			@click="back"
			class="mr-2 ml-1"
		>
			<v-icon dark small>mdi-keyboard-backspace</v-icon>
		</v-btn>
		<span class="btn-header-popup">
			<v-btn 
				class="mr-2 font-normal fs-13"
				depressed
				tile
				v-if="showBtnAddCheckbox"
				small
				@click="addCheckBoxColumn"
			>
				Chọn
			</v-btn>
			<!-- <v-btn 
				class="mr-2 font-normal fs-13"
				depressed
				tile
				small
				:disabled="showBtnAddCheckbox"
				@click="handleCheckClick"
			>
				Kiểm tra
			</v-btn> -->
			<v-btn 
				class="mr-2 font-normal fs-13"
				depressed
				tile
				small
				:disabled="showBtnAddCheckbox"
				@click="handleSyncClick"
			>
				Đồng bộ
			</v-btn>
		</span>
		<ListItem 
			ref="listObject"
			:showExportButton="false"
			:containerHeight="tableHeight"
			:dialogMode="true"
			:getDataUrl="getListUrl"
			@close-popup="handleCloseEvent"
			style="margin-left:10px"
			:useDefaultContext="false"
			:tableContextMenu="tableContextMenu"
			:customAPIResult="customAPIResult"
			:isTablereadOnly="false"
			@after-selected-row="afterSelectedRow"
		/>
		<DialogsConfirmSync 
			:showDialog="showDialog"
			@cancel="showDialog = false"
			:listItemSelected="listItemSelected"
			:currentObjectType="currentObjectType"
		/>
		<DialogDataRelate 
			:showDialog="showDialogRelateData"
			@cancel="showDialogRelateData = false"
			:currentItem="dependencies"
		/>
	</div>

</template>

<script>
import DialogDataRelate from './DialogDataRelate'
import ListItem from "@/components/common/ListItems"
import DialogsConfirmSync from './DialogsConfirmSync'
export default {
	components:{
		ListItem,
		DialogsConfirmSync,
		DialogDataRelate
	},
	props:{
		tableHeight:{
			type: Number
		},
		getListUrl:{
			type: String
		},
		currentObjectType:{
			type: String
		},
	},
	data(){
		let self = this
		return{
			listItemSelected: {},
			showBtnAddCheckbox: true,
			showDialogRelateData: false,
			showList: false,
			dependencies: {},
			showDialog:false,
			tableContextMenu:{
				checkRelated: {
                    name: "checkRelated",
                    text:" Dữ liệu liên quan",
                    callback: (row, callback) => {
						self.handleCheckClick()
						self.dependencies = row.dependencies
                    }
                },
			},
			customAPIResult:{
				reformatData(res){
					self.$refs.listObject.rerenderTable();
					return{
						columns:res.data.columns ? res.data.columns : [],
						listObject:res.data.listObject ? res.data.listObject : [],
						total: res.data.listObject ? res.data.listObject.length : 0,
					}
				}
			}
		}
	},
	methods:{
		handleCloseEvent(){
			this.$emit('close-popup')
		},
		back(){
			this.$emit('back')
		},
		addCheckBoxColumn(){
			this.showBtnAddCheckbox = false
			this.$refs.listObject.addCheckBoxColumn()
		},
		afterSelectedRow(items){
			this.$set(this, 'listItemSelected', items)
		},
		handleSyncClick(){
			this.showDialog = true
		},
		handleCheckClick(){
			this.showDialogRelateData = true
		},
		refreshList(){
			this.$refs.listObject.refreshList()
		}
	},
	watch:{
		getListUrl(val){
			setTimeout((self) => {
				self.$refs.listObject.getData()
			}, 200,this);
			this.listItemSelected = {},
			this.showBtnAddCheckbox = true
		}
	}
}
</script>

<style scoped>
.symper-title{
	margin-left: 12px !important;
}
.btn-header-popup{
	position: absolute;
	top: 15px;
	right: 235px;
}
</style>