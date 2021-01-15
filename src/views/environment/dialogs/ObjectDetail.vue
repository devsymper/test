<template>
	<div style="position:relative" class="object-detail">
		<v-btn
			depressed
			small
			icon
			tile
			style="position:absolute; left:0; top:6px"
			@click="back"
			class="mr-2 ml-1"
		>
			<v-icon dark small>mdi-keyboard-backspace</v-icon>
		</v-btn>
		<div class="btn-header-popup">
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
			<v-btn 
				class="font-normal fs-13 mr-2"
				depressed
				tile
				small
				@click="handleSyncAll"
			>
				Đồng bộ tất cả
			</v-btn>
		</div>
		<ListItem 
			ref="listObject"
			:showExportButton="false"
			:containerHeight="tableHeight"
			:dialogMode="true"
			:getDataUrl="getListUrl"
			@close-popup="handleCloseEvent"
			style="margin-left:10px"
			@data-loaded="showBtnAddCheckbox = true"
			:refreshListWhenChangeUrl="false"
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
			@success="handlerSuccess"
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
		tab:{
			type: String,
			default: ""
		}
	},
	data(){
		let self = this
		return{
			listItemSelected: [],
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
					return{
						columns:res.data.columns ? res.data.columns : [],
						listObject:res.data.listObject ? res.data.listObject : [],
						total: res.data.total,
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
		handlerSuccess(){
			this.showBtnAddCheckbox = true
			this.showDialog = false 
			this.$refs.listObject.refreshList()
		},
		afterSelectedRow(items){
			this.$set(this, 'listItemSelected', items)
		},
		handleSyncClick(){
			this.showDialog = true
		},
		handleSyncAll(){
			let items = this.$refs.listObject.getAllData()
			this.$set(this, 'listItemSelected', items)
			this.showDialog = true
		},
		handleCheckClick(){
			this.showDialogRelateData = true
		},
	
	},
	watch:{
		getListUrl(val){
			this.$refs.listObject.emptyShowList()
			setTimeout((self)=>{
				self.$refs.listObject.getData()
			},200,this)
			this.listItemSelected = [],
			this.showBtnAddCheckbox = true
		},
		tab(val){
			this.$refs.listObject.removeCheckBoxColumn()
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
	top: 6px; 
	right: 235px;
}
</style>