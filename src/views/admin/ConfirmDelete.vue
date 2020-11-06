<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="400"
    >
      <v-card>
        <v-card-title class="">
          Bạn có chắc chắn muốn xóa  không ?
        </v-card-title>
        <v-card-text>
				<span>
					1 vài mô tả right here
				</span>
				<v-checkbox
					v-model="selected"
					label="John"
					value="John"
				></v-checkbox>
			 </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="cancel"
          >
		  Huỷ
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="confirmDelete"
          >
            Xóa
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
	data(){
		return {}
	},
	props:{
		showDialog:{
			type: Boolean,
			default: false
		}
	},
	methods:{
		confirmDelete(){
			this.$emit('confirm')
		},	
		cancel(){
			this.$emit('cancel')
		}
	}
}
</script>

<style>

</style>