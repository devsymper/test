<template>
	<div class="dialog-assign">
		<v-dialog
			v-model="showDialog"
			persistent
			max-width="400"
		>
			<v-card>
			<v-card-title class="fs-15">
				Giao lại việc
			</v-card-title>
			<v-card-text>
				<div class="content-assign-dialog d-flex flex-column ml-2 fs-13">
						
					<div class="text-wrap">
						Công việc sẽ được giao cho người khác thực hiện, người thực hiện có toàn quyền với công việc
					</div>
					<div class="text-wrap d-flex align-center">
						Trạng thái hiện tại 
						<v-chip
							small
							label
							class="ma-2"
							color="orange"
							text-color="white"
						>
							<span class="fs-13">
								Đã giao
							</span>
						</v-chip>
					</div>
					<div class="text-wrap font-weight-light">
						Công việc đã được giao cho 
						<span style="color:blue">
							 {{ originData.assigneeInfo ? originData.assigneeInfo.displayName : ""  }}
						</span>
					</div>
					<div class="text-wrap d-flex align-center mt-2">
						<div class="mb-4 mr-2">
							Người được giao việc
						</div>
						<div>
							<v-autocomplete
								solo
								v-model="userInforId"
								:items="$store.state.app.allUsers"
								item-text="displayName"
								item-value="id"
							></v-autocomplete>
						</div>
					</div>
					<div class="text-wrap mt-2">
						Người được giao việc sẽ có quyền xem và thực thi công việc
					</div>
					<div class="text-wrap d-flex align-center">
						Công việc sẽ được chuyển sang trạng thái 
						<v-chip
							small
							label
							class="ma-2"
							color="orange"
							text-color="white"
						>
							<span class="fs-13">
								Đã giao
							</span>
						</v-chip>
					</div>
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
				>
					Đồng ý
				</v-btn>
			</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
export default {
	props:{
		showDialog:{
			type: Boolean,
			default: false,
		},
		originData:{
			type: Object
		}
	},
	data(){
		return{
			userInforId: ""
		}
	},
	created(){
	},
	
	methods:{
		cancel(){
			this.$emit('cancel')
		},
		
	},
}
</script>

<style scoped>
.content-assign-dialog >>>  .v-text-field__details{
	display: none !important;
}
.content-assign-dialog >>> .v-input__slot{
	box-shadow: unset !important;
	min-height: unset !important;
	border: 1px solid lightgray;
}
.content-assign-dialog >>> input{
	font-size: 13px !important;
}
.content-assign-dialog >>> .v-menu{
	font-size: 13px !important;
}
</style>