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
			>
				Thêm môi trường
			</v-btn>
			<v-btn 
				class="mr-2 font-normal fs-13"
				depressed
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

	</div>
</template>

<script>
export default {
	data(){
		return {
			searchKey: "",
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

</style>