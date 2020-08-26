<template>
		<div v-show="showTargetArea">
				<p v-html="content"></p>
		</div>
</template>
<script>
export default {
	props:{
		showTargetArea:{
			type: Boolean,
			default:false
		},
		content:{
			stype: String,
			default: '<span>targetarea ne</span>'
		}
	}
}
</script>

<style>

</style>