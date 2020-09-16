<template>
		<div style="display:flex;align-item:center">
				<p class="target-area-comment" v-html="content" style="margin-left:auto;margin-right:auto;margin-top:8px"></p>
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