<template>
	<div class="w-100 h-100 d-flex flex-column ">
		<div class="d-flex" style="height: calc(100vh - 70px)">
			<div class=" content-function  flex-grow-1">
				<div class="p-2">
					conttent
				</div>
			</div>
			<div class="comment-area">
				comment
			</div>
		</div>
		<div>
			<v-btn 
				class="float-right mr-2 mt-2"
                small
				v-if="action != 'view'"
                depressed
                color="primary"
                @click="debounceSaveActionPack"
			>
                <v-icon class="mr-2" primary>mdi-content-save</v-icon>
                {{action == 'add' ? $t('common.save') : $t('common.update')}}
			</v-btn>
		</div>
	</div>
</template>

<script>
export default {
	props:{
		action:{
			type: String, 
			default: ""
		}
	}
}
</script>

<style scoped>
.content-function{
	border: 1px solid lightgray;
}
.comment-area{
	width:300px;

}
</style>