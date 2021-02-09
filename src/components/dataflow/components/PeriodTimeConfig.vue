<template>
	<div class="d-flex period-time-config">
		<div class="period-time d-flex align-center">
			<v-btn icon tile small @click="changeValue(false)">
				<v-icon small>
					mdi-minus
				</v-icon>
			</v-btn>
			<span class="fs-13 ml-2 mr-2">
				{{periodTime}}
			</span>
			<v-btn icon small tile @click="changeValue(true)">
				<v-icon small>
					mdi-plus
				</v-icon>
			</v-btn>
		</div>
		<div class="ml-2" style="width:100px">
			<v-autocomplete
				v-model="unitValue"
				:items="unitItems"
				dense
				solo
			></v-autocomplete>
		</div>
	</div>
</template>

<script>
export default {
	data(){
		return{
			periodTime: 5,
			unitValue: "",
			unitItems:['minute','hour','day','week','month']
		}
	},
	methods:{
		changeValue(increase = false){
			if(increase){
				this.periodTime += 1
			}else{
				this.periodTime -= 1
			}
		}
	}
};
</script>

<style scoped>
.period-time-config >>> .period-time{
	border: 1px solid lightgray;
	border-radius: 4px;
}
.period-time-config >>> .v-input__control{
	min-height: 30px !important;
}
.period-time-config >>> .v-input__slot{
	box-shadow: unset !important;
	border: 1px solid lightgray;
	margin-bottom: unset;
}
.period-time-config >>> input{
	font-size: 13px ;
}
.period-time-config >>> .v-text-field__details{
	display: none;
}
</style>
