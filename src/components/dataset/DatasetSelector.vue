<template>
	<v-dialog
		v-model="showDialog"
		persistent
		content-class="bi-dataset-selector"
		class="h-100 w-100"
	>
		<ListItem 
			:showButtonAdd="false"
			:showExportButton="false"
			:showDisplayConfig="false"
			:containerHeight="tableHeight"
			:getDataUrl="getDataUrl"
			:customAPIResult="customAPIResult"
			:customHeaderBtn="customHeaderBtn"
			@custom-btn-cliced="handlerCustomBtnClick"
		/>
	</v-dialog>
</template>

<script>
import ListItem from "@/components/common/ListItems"
import { appConfigs } from "@/configs.js";

export default {
	components:{
		ListItem
	},
	props:{
	
		tableHeight:{
			type: Number,
			default: 0
		}
	},
	data(){
		return{
			showDialog: false,
			listDatasetSelected:[],
			getDataUrl: appConfigs.apiDomain.biService +"datasets/get-list",
			customAPIResult:{
				reformatData(res){
					res.data.columns.forEach(function(e){
						e.flex = 1
					})
					res.data.columns.unshift(
						{ 
							headerName: 'Chọn', 
							field: 'checkbox', 
							editable:true,
							cellRendererFramework : 'CheckBoxRendererListItems',
							width: 50
						}	
					)
					debugger
					return{
						columns:res.data.columns,
						listObject: res.data.listObject,
						total: res.data.total,
					}

				}
			},
			customHeaderBtn:{
				cancel:{
					title: this.$t('common.cancel'),
					icon: 'mdi-close'
				},
				select:{
					title: this.$t('common.ok'),
					icon: 'mdi-check'
				},
				
			}
		}
	},
	methods:{
		show(){
			this.showDialog = true
		},
		handlerCustomBtnClick(i){
			this.$set(this, 'showDialog', false)
			if(this[i]){
				this[i]()
			}
		},
		select(){
			this.$emit('list-dataset-selected' , this.listDatasetSelected)
		},
	},
	watch:{
		
	}
}
</script>

<style>
.bi-dataset-selector {
	background-color: #ffffff;
}
</style>