<template>
  <div class="d-flex fs-13">
	<span>
		{{$t('bi.runningInfo.run-success') }}
	</span>
	<span class="font-weight-bold ml-1 mr-1" >
		{{time}}s
	</span>
	<span>
		{{$t('bi.runningInfo.with')}}
	</span>
	<span class="font-weight-bold ml-1 mr-1">
		{{rows}}
	</span>
	<span>
		{{$t('bi.runningInfo.rows')}}
	</span>
  </div>
</template>

<script>
export default {
	props:{
		time:{
			type: Number,
			default: 5
		},
		rows:{
			type: Number,
			default: 500
		},
	}
}
</script>

<style>

</style>