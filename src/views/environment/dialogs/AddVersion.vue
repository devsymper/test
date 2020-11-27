<template>
	<v-dialog
		v-model="showDialog"
		persistent
		max-width="290"
	>
		<v-card class="dialog-add-version">
		<v-card-title class="fs-15 ">
			Thêm version
		</v-card-title>
		<v-card-text>
			<FormTpl
				:labelWidth="'60px'"
				:allInputs="allInputs"
				:single-line="true"
			/>
			 <v-menu
				ref="menu"
				v-model="menu"
				:close-on-content-click="false"
				:return-value.sync="dates"
				transition="scale-transition"
				offset-y
				min-width="290px"
			>
				<template v-slot:activator="{ on, attrs }">
					<v-combobox
						v-model="dates"
						label="Release at"
						prepend-icon="mdi-calendar"
						readonly
						v-bind="attrs"
						v-on="on"
					>
					</v-combobox>
				</template>
			<v-date-picker
				v-model="dates"
				no-title
				scrollable
			>
				<v-spacer></v-spacer>
				<v-btn
					text
					color="primary"
					@click="menu = false"
				>
					Cancel
				</v-btn>
				<v-btn
					text
					color="primary"
					@click="$refs.menu.save(dates)"
				>
					OK
				</v-btn>
          </v-date-picker>
        </v-menu>
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
				@click="addVersion"
			>
				Thêm
			</v-btn>
		</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
import FormTpl from "@/components/common/FormTpl";
import {environmentManagementApi} from '@/api/EnvironmentManagement'
export default {
	components:{
		FormTpl
	},
	props:{
		showDialog:{
			type: Boolean,
			default: false
		}
	},
	watch:{
		showDialog(){
			for(let i in this.allInputs){
				this.allInputs[i].value = ""
			}
			this.dates = ""
		}
	},
	methods:{
		cancel(){
			this.$emit('cancel')
		},
		addVersion(){
			let self = this
			let serviceId = this.$store.state.environmentManagement.currentServiceId
			let formData = {
			}
			for(let i in this.allInputs){
				if(i == "status"){
					formData[i] = this.allInputs[i].value == false ? 0 : 1
				}else{
					formData[i] = this.allInputs[i].value
				}

			}
			formData.releaseAt = this.dates
			environmentManagementApi.addVersion({
				serviceId:serviceId,
				formData:formData
			}).then(res=>{
				if(res.status == 200){
					self.$snotify({
						type: "success",
						title: " Thêm version thành công"
					})
					self.$emit('add-success')
				}else{
					self.$snotify({
						type: "error",
						title: " Có lỗi xảy ra"
					})
				}
			}).catch(err=>{
					self.$snotify({
						type: "error",
						title: " Có lỗi xảy ra"
					})
			})
		}
	},
	data(){
		return{
			menu: false,
			dates: "",
			allInputs:{
				versionName: {
                    title: "Version",
                    type: "text",
                    value: "",
                    info: ""
                },
				git:{
                    title: "Git",
                    type: "text",
                    value: "",
                    info: ""
				},
				status: {
                    title: "Status",
                    type: "checkbox",
                    value: false,
                    info: ""
				},
			}
		}
	}
}
</script>

<style scoped>
.dialog-add-version >>> .v-select__slot label,
.dialog-add-version >>> .v-select__slot input{
	font-size: 13px !important;
}
.dialog-add-version >>> .v-input__prepend-outer .v-icon{
	font-size: 13px !important;
}
</style>