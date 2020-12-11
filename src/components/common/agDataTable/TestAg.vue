<template>
	<div class="h-100 w-100">
		<AgDataTable
			:tableHeight="'calc(100% - 100px)'"
			ref="displayTable" 
			:allColumns="allColumns"
			:editable="false"
		>
		</AgDataTable>
	</div>
</template>

<script>
import AgDataTable from './ListItems'

export default {
	data(){
		return {
			allColumns:[
				{
					colId: "code",
					field: "code",
					headerName: "Mã",
					resizable: true,
					width: 145.55555555555554
				},
				{
					colId: "managers",
					field: "managers",
					headerName: "Quản lý",
					resizable: true,
					width: 312,
				},
				{
					colId: "price",
					field: "price",
					headerName: "test",
					resizable: true,
					width: 312,
				},
				
			],
			
		}
	},
	components:{
		AgDataTable
	}
}
</script>

<style>

</style>