<template>
	<div class="d-flex flex-column user-role-orgchart fs-13 h-90">
		<div>
			Chỉnh sửa vai trò người dùng trong Orgchart
		</div>
		<span class="fs-12 font-weight-light">
			Kích chọn vị trí để gán permission
		</span>
		<div class="d-flex mt-4">
			<div class="list-department-orgchart pr-2 mr-2 h-100">
				Danh sách phòng ban
				<OrgchartElement
					:idOrgchart="idOrgchart"
					:height="'calc(100vh - 150px)'"
				/>
			</div>
			<div >
				<div class="mb-2">
					Danh sách permission
				</div>
				<PermissionSelector 
					:height="'calc(100vh - 350px)'"
				/>
			</div>
			 
		</div>
		<v-btn
			small
			color="primary"
			class="btn-fixed-bottom update-btn"
		>
			<v-icon class="mr-2">mdi-content-save-outline</v-icon>
			Lưu
		</v-btn>
	</div>
</template>
<script>
import PermissionSelector from "@/components/permission/PermissionSelector"
import OrgchartElement from './../helpers/OrgchartElement'
export default {
	props:{
		idOrgchart:{
			type: String,
		}
	},
	components:{
		PermissionSelector,
		OrgchartElement
	}
}
</script>

<style scoped>
.user-role-orgchart .list-department-orgchart{
	width: 350px;
	border-right: 1px solid lightgray;
}
</style>