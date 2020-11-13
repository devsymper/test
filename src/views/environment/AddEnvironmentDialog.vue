<template>
	 <v-dialog
        v-model="showDialog"
        persistent
        max-width="600px"
      >
        <v-card class="dialog-add-environment fs-13">
          <v-card-title>
            <span class="fs-15" >Thêm môi trường</span>
          </v-card-title>
          <v-card-text class="d-flex flex-column">
			<div >
				<span class="font-weight-bold mb-2 fs-13">
					Domain của môi trường
				</span>
				 <v-text-field
					label="Domain của môi trường"
					single-line
					solo
					dense	
					class="mr-2 fs-13"
					v-model="domainName"
				></v-text-field>
			</div>
			<div>
				<span class="font-weight-bold fs-13">
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
				<span class="font-weight-bold fs-13">
					Lựa chọn các phiên bản dịch vụ hệ thống symper
				</span>
				<div class="checkbox-modules">
					<v-checkbox
						value="John"
						color="success"
					>
						<template v-slot:label>
							<div class="d-flex w-100 fs-13">
								<span class="flex-grow-1">
									File management
								</span>
								<span>ahihihi</span>
							</div>
						</template>
					</v-checkbox>
					<v-checkbox
						value="John"
						color="success"
					>
						<template v-slot:label>
							<div class="d-flex w-100 fs-13">
								<span class="flex-grow-1">
									Orgchart
								</span>
								<span>ahihihi</span>
							</div>
						</template>
					</v-checkbox>
					
				</div>
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
			domainName: "",
			environmentType:[
				"Devolopment",
				"Beta"
			],
			values: "Devolopment"
		}
	}

}
</script>

<style scoped>
.dialog-add-environment >>> .v-input__slot{
	box-shadow: unset !important;
	background-color: #f7f7f7 !important;
}
.dialog-add-environment >>> .v-text-field__details{
	display: none !important;
}
.dialog-add-environment >>> .checkbox-modules .v-input{
	margin: unset;
}
.dialog-add-environment >>> .checkbox-modules .v-messages{
	display: none;
}
.dialog-add-environment >>> .checkbox-modules .v-input__slot{
	background-color: unset !important;
	margin-bottom:unset;
}
.dialog-add-environment >>> .v-label ,
.dialog-add-environment >>> input {
	font: 13px roboto	!important;
}
</style>