<template>
	<div>
		<v-dialog
			v-model="showDialog"
			persistent
			content-class="bi-dataset-selector d-flex flex-column"
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

	</div>
</template>

<script>
import ListItem from "@/components/common/ListItems"
import { appConfigs } from "@/configs.js";

export default {
	components:{
		ListItem
	},
	props:{
		showDialog:{
			type: Boolean,
			default: false,
		},
		tableHeight:{
			type: Number,
			default: 0
		}
	},
	data(){
		return{
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
							cellRendererFramework : 'CheckBoxRenderer',
							width: 50
						}	
					)
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
		cancel(){
			this.$emit('cancel')
		},
		selectDataset(){
			this.$emit('list-dataset-selected' , this.listDatasetSelected)
		},
		handlerCustomBtnClick(i){
			if(this[i]){
				this[i]()
			}
		},
		select(){
		},
	},
}
</script>

<style>
.bi-dataset-selector {
	background-color: #ffffff;
}
</style>