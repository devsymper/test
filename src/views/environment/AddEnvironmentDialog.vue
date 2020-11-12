<template>
	 <v-dialog
        v-model="showDialog"
        persistent
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span>Thêm môi trường</span>
          </v-card-title>
          <v-card-text class="d-flex flex-column">
			<div>
				<span class="font-weight-bold">
					Domain của môi trường
				</span>
				 <v-text-field
					label="Domain của môi trường"
					single-line
					solo
					dense	
					class="mr-2 fs-13"
					v-model="searchKey"
				></v-text-field>
			</div>
			<div>
				<span class="font-weight-bold">
					Loại môi trường
				</span>
				<v-autocomplete
					dense
					filled
					solo
					v-model="values"
            		:items="environmentType"
				>
				</v-autocomplete>
			</div>
			<div>
				<span class="font-weight-bold">
					Lựa chọn các phiên bản dịch vụ hệ thống symper
				</span>
			</div>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              	color="blue darken-1"
              	text
				@click="cancel"
			
            >
              Hủy
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
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
			default: false
		}
	},
	methods:{
		cancel(){
			this.$emit('cancel')
		}
	},
	data(){
		return{
			environmentType:[
				"Devolopment",
				"Beta"
			],
			values: "Devolopment"
		}
	}

}
</script>

<style>

</style>