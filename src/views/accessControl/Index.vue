<template>
	<div class="d-flex h-100 w-100">
		<div class="d-flex flex-column h-100  tab-select fs-13">
			<div v-for="(item,i) in listType" :key="i" :class="{'tab-select-item d-flex flex-column ml-1 mr-1 pl-1 pr-1 mt-1 pt-2 pb-2': true, 'selected-item': active == item.action}" @click="handleTab(item)">
				<div>
					<v-icon small>
						mdi-circle-slice-8
					</v-icon>
					<span class="ml-2">{{item.title}}</span>
				</div>
				<span class="fs-11 font-weight-light mt-1"><v-icon x-small> mdi-information-outline</v-icon> {{item.subTitle}}</span>
			</div>
			<div class="ml-1 d-flex flex-column fs-13 ">
				<div class="mt-1 pl-6" :class="{'role-user-item': true, 'selected-item': active == 'userRole'}" @click="active = 'userRole'">
					+ Trong hệ thống
				</div>
				<div class="mt-1 pl-6" :class="{'role-user-item': true, 'selected-item': active == 'userRoleOrgchart'}" @click="active = 'userRoleOrgchart'">
					+ Trong orgchart
				</div>
			</div>
		</div>
		<div class="list-item flex-grow-1">
			ahuhu
		</div>

	</div>
</template>

<script>
export default {
	data(){
		return {
			active: "actionPack",
			listType:[
				{
					title: "Action pack",
					subTitle: "Action pack (gói thao tác) là tập hợp các hành động tương tác với các đối tượng trong hệ thống ",
					action: "actionPack"
				},
				{
					title: "Permission",
					subTitle: "Permission (quyền truy cập) là tập hợp các gói thao tác mà người dùng được phân quyền thực hiện",
					action: "permission"
				},
				{
					title: "Vai trò người dùng",
					subTitle: "Vai trò người dùng là tập hợp các quyền truy cập được phân cho role trong sơ đồ tổ chức hoặc vai trò hệ thống",
					action: "userRole"
				},
			]
		}
	},
	methods:{
		handleTab(item){
			this.active = item.action
		}
	}
}
</script>

<style scoped>
.tab-select{
	width: 250px;
	border-right: 1px solid lightgray;
}
.selected-item{
	background-color: #f7f7f7
}
.tab-select-item, .role-user-item {
	cursor: pointer;
}
</style>