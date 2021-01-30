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
		/>
	</v-dialog>
</template>

<script>
import ListItem from "@/components/common/ListItems"
import { appConfigs } from "@/configs.js";
import { util } from '@/plugins/util';

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
	created(){
		this.setOriginValue(this.value);
	},
	
	data(){
		let self = this
		return{
			internalChange: false,
			showDialog: false,
			originDatasetIds:[],
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
					icon: 'mdi-close',
					callback(){
						self.showDialog = false
						self.$emit("cancel", self.originDatasetIds)
					}
				},
				select:{
					title: this.$t('common.ok'),
					icon: 'mdi-check',
					callback(){
						self.showDialog = false
						self.$emit('list-dataset-selected', self.value)
					}
				},
			},
			
		}
	},
	methods:{
		show(){
			this.showDialog = true
		},
		changeDatasetSelected(data){
			let arr = []
			data.forEach(function(e){
				arr.push(e.id)
			})
			this.internalChange = true;
			this.$emit('input', arr)
			setTimeout((self) => {
				self.internalChange = false;
			}, 0, this);
		},
		addCheckboxColumn(){
			setTimeout(self=>{
				self.$refs.listObject.addCheckBoxColumn()
			},200, this)
		},
		select(){
			this.$emit('list-dataset-selected' , this.listDatasetSelected)
		},
		setOriginValue(value){
			this.originDatasetIds = util.cloneDeep(value)
		}
	},
	watch:{
		value: {
			deep: true,
			handler(newValue){
				if(!this.internalChange){
					this.setOriginValue(newValue);
				}
			}
		}
	}
}
</script>

<style>
.bi-dataset-selector {
	background-color: #ffffff;
}
</style>