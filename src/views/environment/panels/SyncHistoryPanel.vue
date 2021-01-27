<template>
  <div class="d-flex flex-column fs-13 sync-history-panel">
	  <div class="d-flex">
		  <span class="flex-grow-1">
			  Lịch sử đồng bộ
		  </span>
		  <v-icon class="mr-2">
			  mdi-close
		  </v-icon>
	  </div>
	  <div>
		  Các dữ liệu được đồng bộ
	  </div>
	  <div class="checkbox-modules" >
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
</template>

<script>
export default {

}
</script>

<style scoped>
.sync-history-panel >>> .checkbox-modules .v-input{
	margin: unset;
}
.sync-history-panel >>> .checkbox-modules .v-messages{
	display: none;
}
.sync-history-panel >>> .checkbox-modules .v-input__slot{
	background-color: unset !important;
	margin-bottom:unset;
}
.sync-history-panel >>> .v-label ,
.sync-history-panel >>> input {
	font: 13px roboto	!important;
}
</style>