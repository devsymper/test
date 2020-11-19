<template>
	<div class="d-flex flex-column w-100 h-100 environemt-management">
		<div class="d-flex align-center mt-2">
			<v-icon class="ml-2">
				mdi-earth
			</v-icon>
			<span class="flex-grow-1 ml-2 fs-16 font-weight-bold">
				Danh sách các môi trường 
			</span>
			<v-btn
				class="mr-2 font-normal fs-13" 
				depressed
				@click="showDialogAdd"
			>
				Thêm môi trường
			</v-btn>
			<v-btn 
				class="mr-2 font-normal fs-13"
				depressed
				@click="showSyncHistory"
			>
				Lịch sử đồng bộ
			</v-btn>
			 <v-text-field
				:label="$t('apps.search')"
				single-line
				solo
				dense
				class="mr-2 fs-13"
				append-icon="mdi-magnify"
				v-model="searchKey"
			></v-text-field>
		</div>
		<div class="content-environment-management d-flex flex-column mt-2 ml-8 mr-8">
				 <v-expansion-panels accordion >
					<v-expansion-panel
						v-for="(item,i) in 3"
						:key="i"
					>
						<v-expansion-panel-header>
							<div class="d-flex flex-column fs-13">
								<div>
									App-beta.symper.vn	
								</div>
								<div class="mt-2">
									<span>ID : hsdashdhsjd123214</span>
									<span class="ml-16">
										Loại môi trường development
									</span>
								</div>
							</div>
							<template v-slot:actions>
								<v-icon color="success">mdi-chevron-down</v-icon>
							</template>
						</v-expansion-panel-header>
						<v-expansion-panel-content class="fs-13">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
		</div>	
		<AddEnvironmentDialog 
			:showDialog="showDialogAddItem"
			@cancel="cancelAdd"
			 />
	</div>
</template>

<script>
import AddEnvironmentDialog from "./dialogs/AddEnvironmentDialog"
export default {
	components:{
		AddEnvironmentDialog,
	},
	data(){
		return {
			searchKey: "",
			showDialogAddItem: false
		}
	},
	methods:{
		showDialogAdd(){
			this.showDialogAddItem = true
		},
		cancelAdd(){
			this.showDialogAddItem = false
		},
		showSyncHistory(){
			this.$goToPage(
				"environment-sync-history", "Lịch sử đồng bộ"
			)
		}
	}
}
</script>

<style scoped>
.environemt-management >>> .v-text-field__slot,
.environemt-management >>> .v-text-field__slot label{
	font-size: 13px !important;
}
.environemt-management >>> .v-input__append-inner{
	font-size: 13px !important;
}
.environemt-management >>> .v-input__control{
	width: 30px !important;
	min-height: unset;
	height: 32px !important
}
.environemt-management >>> .v-input__slot{
	background-color: #f7f7f7 !important;
	box-shadow: unset !important;
}
.environemt-management >>> .v-text-field__details{
	display: none !important;
}
.environemt-management >>> .v-list-item__content{
	padding:2px
}
.environemt-management >>> .v-list-item{
	border-bottom: 1px solid lightgray
}
.environemt-management >>> .v-expansion-panel-header{
	padding: 8px !important;
}
.environemt-management >>> .v-expansion-panel,
.environemt-management >>> .v-expansion-panel::before{
	box-shadow: unset !important;
}
.environemt-management >>> .v-expansion-panel-header--active .v-icon{
	transform: unset !important;
}

</style>