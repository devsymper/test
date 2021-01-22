<template>
	<div>
		{{action}}
	</div>
</template>

<script>
export default {
	props:{
		action:{
			type: String,
			default: "edit"
		}
	}
}
</script>

<style>

</style>