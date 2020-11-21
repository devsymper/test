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
		</span>
		<ListItem 
			:showExportButton="false"
			:containerHeight="tableHeight"
			:dialogMode="true"
			@close-popup="handleCloseEvent"
			style="margin-left:10px"
		/>
	</div>

</template>

<script>
import ListItem from "@/components/common/ListItems"
export default {
	components:{
		ListItem
	},
	props:{
		tableHeight:{
			type: Number
		}
	},
	methods:{
		handleCloseEvent(){
			this.$emit('close-popup')
		},
		back(){
			this.$emit('back')
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