<template>
	<div class="action-pack-panel d-flex flex-column ml-2 fs-13" >
		<h3 class="text-uppercase">
			<span >{{action}}</span> action pack
		</h3>
		<div v-if="action == 'add'" class="d-flex flex-column">
			<span class="fs-13 mb-2 mt-1">
				Tạo mới action pack
			</span>
			<div class="d-flex flex-column ml-2" style="width: 300px">
				<v-text-field
					label="Nhập tên action pack"
					single-line
					class="fs-13"
					solo
				></v-text-field>
				<v-text-field
					label="Nhập mô tả action pack"
					single-line
					solo
					class="fs-13"
				></v-text-field>
			</div>
		</div>
		<div v-else>
			sửa nè ahihi
		</div>
		<div class="d-flex mt-2">
			<div class="d-flex flex-column" style="width:170px">
				<h4 class="mb-2">
					Đối tượng
				</h4>
				<div v-for="(item,i) in listObject" :key="i" :class="{'pt-1  pb-1 pl-2 fs-13 mr-2 action-pack-object':true,  'action-pack-object-active': objectActive == item.value} "  @click="handleObjClick(item)">
					<span class="pl-2">
						{{item.title}}
					</span>
				</div>
			</div>
			<div>
				<div v-if="objectActive == 'applicationDefinition'" class="d-flex flex-column">
					<div class="d-flex">
						<span> Chọn ứng dụng:</span>
						<ListItemSelector />
					</div>
				</div>
				<div v-else>
					{{objectActive}}
				</div>
			</div>
		</div>
	
  	</div>
</template>

<script>
import ListItemSelector from "./../helpers/ListItemSelector.vue"
export default {
	components:{
		ListItemSelector
	},
	props:{
		action:{
			type: String,
		}
	},
	data(){
		return {
			objectActive:'account',
			listObject:[
				{
					title: "Account",
					value: "account",
				},
				{
					title: "Application definition",
					value: "applicationDefinition",
				},
				{
					title: "Dataflow",
					value: "dataFlow",
				},
				{
					title: "File",
					value: "file",
				},
				{
					title: "Wiki",
					value: "wiki",
				},
				{
					title: "Operation",
					value: "Operation",
				},
				{
					title: "Syql",
					value: "Syql",
				},
				{
					title: "Time Sheet",
					value: "timeSheet",
				},
			]
		}
	},
	methods:{
		handleObjClick(item){
			this.objectActive = item.value
		}
	}
}
</script>

<style scoped>
.action-pack-panel >>> .v-text-field__details{
	display:none;
}
.action-pack-panel >>> .v-input__controv-text-field__slotzl{
	min-height: unset !important;
}
.action-pack-panel >>> .v-input__slot{
	background-color:#f7f7f7 !important;
	box-shadow: unset !important;	
	min-height: unset !important;
}
.action-pack-panel >>> .v-input__control{
	min-height: unset !important;
}
.action-pack-panel >>> .v-input__slot label,
.action-pack-panel >>> .v-input__slot input
{
	font-size: 13px !important;
}
.action-pack-panel .action-pack-object-active{
	background-color:#D2D2D2 !important;
	border-radius: 5px;
}
.action-pack-panel .action-pack-object{
	cursor: pointer;

}
</style>