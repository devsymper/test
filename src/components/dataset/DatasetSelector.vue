<template>
	<v-dialog
		v-model="showDialog"
		persistent
		content-class="bi-dataset-selector"
		class="h-100 w-100"
	>
		<ListItem 
			ref="listObject"
			:showButtonAdd="false"
			:showExportButton="false"
			:showDisplayConfig="false"
			:containerHeight="tableHeight"
			:getDataUrl="getDataUrl"
			:customAPIResult="customAPIResult"
			@data-loaded="addCheckboxColumn"
			@after-selected-row="changeDatasetSelected"
			:checkedRows="checkedRows"
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
        value: {
            type: Array,
            default(){
                return []
            }
        },
		tableHeight:{
			type: Number,
			default: 0
		}
	},
	
	data(){
		let self = this
		return{
			showDialog: false,
			checkedRows: [],
			getDataUrl: appConfigs.apiDomain.biService +"datasets/get-list",
			customAPIResult:{
				reformatData(res){
					res.data.columns.forEach(function(e){
						e.flex = 1
					})
					res.data.listObject.forEach(function(e){
						if(self.value.includes(e.id)){
							e.checked = true
							self.checkedRows.push(e)
						}
					})
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
			},
			
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
		changeDatasetSelected(data){
			let arr = []
			data.forEach(function(e){
				arr.push(e.id)
			})
			this.$emit('input', arr)
		},
		addCheckboxColumn(){
			setTimeout(self=>{
				self.$refs.listObject.addCheckBoxColumn()
			},200, this)
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