<template>
	<v-dialog
		v-model="showDialog"
		persistent
		class="h-90 w-90"
	>
		<div class="dialog-object-in-service" style="z-index:1000;background-color: #ffffff ; position: relative">
			<div class="d-flex btn-header-popup" >
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
				>
				Kiểm tra
				</v-btn>
				<v-btn 
					class="mr-2 font-normal fs-13"
					depressed
					tile
					small
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
	</v-dialog>
</template>

<script>
import ListItem from "@/components/common/ListItems"

export default {
	components:{
		ListItem
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
			
		}
	},
	methods:{
		handleCloseEvent(){
			this.$emit('close-popup')
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