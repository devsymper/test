<template>
	<div class="d-flex flex-column user-role-orgchart fs-13">
		<div>
			Chỉnh sửa vai trò người dùng trong Orgchart
		</div>
		<span class="fs-12 font-weight-light">
			Kích chọn vị trí để gán permission
		</span>
		<div class="d-flex mt-4">
			<div class="list-department-orgchart">
				Danh sách phòng ban
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
	</div>


</template>
<script>
import PermissionSelector from "@/components/permission/PermissionSelector"

export default {
	components:{
		PermissionSelector
	}
}
</script>

<style scoped>
.user-role-orgchart .list-department-orgchart{
	width: 350px;
}
</style>