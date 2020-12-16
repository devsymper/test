<template>
	<v-snackbar
		v-model="showSnackbar"
		:timeout="5000"
		:value="true"
		outlined
		right
		top
		multi-line
	>
		<div class="snackbar-submit d-flex flex-column fs-13">
			<span style="color: green" class="fs-15 mb-2 ">Công việc submit thành công</span>
			<div class="d-flex " style="height:40px">
				<div  style="width:200px">
					Bạn có thể hoàn thành công việc bằng cách thực thi 
				</div>
				<ListActionMenu  
					:snackbarMode="true"
					@action-clicked="handlerActionClick"
				/>
			</div>
			<div class="d-flex">
				<div style="width:200px">
					Hãy cập nhật bản ghi bằng cách chọn 
				</div>
				<div>
					<v-btn
						tile
						small
						icon
						@click="handlerEditClick"
					>
						<v-icon small>
							mdi-pencil-circle-outline
						</v-icon>
					</v-btn>
				</div>
			</div>
		</div>
	</v-snackbar>
</template>

<script>
import ListActionMenu from './ListActionMenu'
export default {
	data(){
		return{ 
			showSnackbar: false
		}
	},
	components:{
		ListActionMenu
	},
	methods:{
		clickShowSnackbar(){
			this.showSnackbar = true
		},
		handlerEditClick(){
			this.showSnackbar = false
			this.$emit('edit-clicked')
		},
		handlerActionClick(action){
			this.showSnackbar = false
			this.$emit('action-clicked', action)
		}
	},
}
</script>

<style scoped>

</style>