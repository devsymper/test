<template>
	<div class="dialog-assign">
		<v-dialog
			v-model="showDialog"
			persistent
			max-width="400"
		>
			<v-card>
			<v-card-title class="fs-15">
				Complete task
			</v-card-title>
			<v-card-text>
				<div class="content-assign-dialog d-flex flex-column ml-2 fs-13">
					
					<div class="text-wrap">
						Nhấn Đồng ý để complete này
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
		currentInstance:{
			type: Object,
			default(){
				return {

				}
			},
		}
	},
	data(){
		return{
			selected:"",
			verId:""
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
}
.content-assign-dialog >>> input{
	font-size: 13px !important;
}
.content-assign-dialog >>> .v-menu{
	font-size: 13px !important;
}
</style>