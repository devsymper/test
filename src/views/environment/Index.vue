<template>
	<div class="d-flex flex-column w-100 h-100 environemt-management">
		<div class="d-flex align-center mt-2">
			<v-icon class="ml-2">
				mdi-earth
			</v-icon>
			<span class="flex-grow-1 ml-2">
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
		<div class="content-environment-management d-flex flex-column mt-2">
			<v-list-item
				v-for="i in 3"
				:key="i"
				class="mr-6 ml-6 pr-0 pl-0"
			>

				<v-list-item-content>
					<v-list-item-title>App-beta.symper.vn</v-list-item-title>

					<v-list-item-subtitle >
						<span>ID : ádhashdhsjd123214</span>
						<span class="ml-16">
							Loại môi trường development
						</span>
					</v-list-item-subtitle>
				</v-list-item-content>

				<v-list-item-action>
					<v-icon color="green lighten-1">mdi-chevron-down</v-icon>
				</v-list-item-action>
			</v-list-item>
		</div>
		<AddEnvironmentDialog 
			:showDialog="showDialogAddItem"
			@cancel="cancelAdd"
			 />
	</div>
</template>

<script>
import AddEnvironmentDialog from "./AddEnvironmentDialog"
export default {
	components:{
		AddEnvironmentDialog
	},
	data(){
		return {
			searchKey: "",
			showDialogAddItem: true
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

</style>