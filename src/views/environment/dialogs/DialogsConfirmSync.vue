<template>
	<v-dialog
		v-model="showDialog"
		persistent
		max-width="290"
	>
		<v-card>
		<v-card-title class="fs-13 ">
			Đồng bộ dữ liệu về domain hiện tại
		</v-card-title>
		<v-card-text>
			<div class="d-flex flex-column">
				<div>
					Đồng bộ dữ liệu qua domain
				</div>
				<div>
					Các dữ liệu liên quan sẽ được đồng bộ cùng dữ liệu chính
				</div>
				<div class="text-wrap">
					Nhấn OK để đồng bộ dữ liệu từ domain <span class="font-weight-bold">ba.app-beta.symper.vn</span> về domain  <span class="font-weight-bold">ba.app-beta.symper.vn</span> 
				</div>
				 <v-checkbox
					v-model="selected"
					label="John"
					value="overrideConfligData"
				></v-checkbox>
				<v-checkbox
					v-model="selected"
					label="Jacob"
					value="syncDataNotConflig"
				></v-checkbox>
			</div>

		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn
				color="red darken-1"
				text
				@click="cancel"
			>
				Hủy
			</v-btn>
				<v-btn
				color="green darken-1"
				text
				@click="syncData"
			>
				Thêm
			</v-btn>
		</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	props:{
		showDialog:{
			type: Boolean,
			default: false,
		}
	},
	data(){
		return{
			selected:""
		}
	},
	methods:{
		cancel(){
			this.$emit('cancel')
		},
		syncData(){
		}
	},
}
</script>

<style>

</style>