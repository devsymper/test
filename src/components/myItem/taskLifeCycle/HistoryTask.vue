<template>
  <div class="d-flex flex-column mt-2">
	  <div class="d-flex flex-column mb-2 pt-1 mr-1 ml-1 " v-for="i in 3" :key="i">
		  <div class="d-flex align-center"> 
			  <v-icon small>mdi-account</v-icon>
			 <span class="flex-grow-1">
				  Nguyễn đình hoàng
			 </span>
			  <span>
				  17/11/2020
			  </span>
		  </div>
		  <div class="d-flex mt-1"> 
			 Thực hiển giao việc cho <span style="color: blue" class="ml-1"> Nguyễn văn A</span>
		  </div>
		  <div class="d-flex align-center">
			  Status 
			  <v-chip
				x-small
				label
				class="ma-2"
				color="orange"
				text-color="white"
			>
				<span class="fs-11">
					Đã giao
				</span>
			</v-chip>
			<span>
				->
			</span>
			<v-chip
					x-small
					label
					class="ma-2"
					color="primary"
					text-color="white"
				>
					<span class="fs-11">
						Chưa giao
					</span>
				</v-chip>
		  </div>
	  </div>
  </div>
</template>

<script>
export default {
	computed:{
		sTask(){
			return this.$store.state.task
		}
	}
}
</script>

<style>

</style>