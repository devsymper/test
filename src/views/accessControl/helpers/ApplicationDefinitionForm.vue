<template>
	<div>
		<div class="d-flex">
			<span> Chọn ứng dụng:</span>
			<ListItemSelector />
		</div>
		<div class="d-flex children-application">
			<div 
				v-for="(item,i) in childrenTypeOfApp"  
				:key="i" 
				class="p-2 title-children-application"
				@click="handleChildTypeClick(item.value)" 
				:class="{'title-children-application-active': active == item.value}"
			>
				{{item.title}}
			</div>
		</div>
	</div>
  
</template>

<script>
import ListItemSelector from "./ListItemSelector.vue"

export default {
	data(){
		return {
			active: "",
			childrenTypeOfApp:[
				{
					title: "Chứng từ",
					value: "documentDocumentary"
				},
				{
					title: "Danh mục",
					value: "documentCatalog"
				},
				{
					title: "Báo cáo",
					value: "dashboard"
				},
				{
					title: "Quy trình",
					value: "workflow"
				},
				{
					title: "Orgchart",
					value: "orgchart"
				},

			]
		}
	},
	components:{
		ListItemSelector
	},
	methods:{
		handleChildTypeClick(value){
			this.active = value
		}
	}

}
</script>

<style scoped>
.children-application{
	border: 1px solid lightgray;
}
.title-children-application{
	cursor: pointer;
}
.title-children-application:hover{
	background-color: #f7f7f7;
}
.title-children-application-active{
	background-color: #D2D2D2;
}
</style>