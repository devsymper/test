<template>
	 <v-dialog
		v-model="showDialog"
		persistent
		max-width="520"
		>
		<v-card>
			<v-card-title class="headline">
				Nội dung function
			</v-card-title>
			<v-card-text >
				<div class="ml-1 ">
					{{content}}
				</div>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					color="green darken-1"
					text
					@click="cancel"
				>
					Đóng
				</v-btn>
			</v-card-actions>
		</v-card>
    </v-dialog>
</template>

<script>
export default {
	props:{
		content:{
			type: String,
			default: ""
		},
		showDialog:{
			type: Boolean,
			default: false
		}
	},
	methods:{
		cancel(){
			this.$emit('cancel')
		}
	}
}
</script>

<style>

</style>