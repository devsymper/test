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
			<v-btn 
				class="mr-2 font-normal fs-13"
				depressed
				tile
				small
				:disabled="showBtnAddCheckbox"
			>
				Kiểm tra
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
		</span>
		<ListItem 
			ref="listObject"
			:showExportButton="false"
			:containerHeight="tableHeight"
			:dialogMode="true"
			:getDataUrl="getListUrl"
			@close-popup="handleCloseEvent"
			style="margin-left:10px"
			:isTablereadOnly="false"
			@after-selected-row="afterSelectedRow"
		/>
		<DialogsConfirmSync 
			:showDialog="showDialog"
			@cancel="showDialog = false"
			:listItemSelected="listItemSelected"
			:currentObjectType="currentObjectType"
		/>
	</div>

</template>

<script>
import ListItem from "@/components/common/ListItems"
import DialogsConfirmSync from './DialogsConfirmSync'
export default {
	components:{
		ListItem,
		DialogsConfirmSync
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
		return{
			listItemSelected: [],
			showBtnAddCheckbox: true,
			showDialog:false
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
		}
	},
	watch:{
		getListUrl(val){
			this.listItemSelected = [],
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