<template>
		<div>
			<v-tooltip left>
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon @click="clickFull($event)" v-bind="attrs"
						v-on="on"> 
						<v-icon style="font-size:15px">mdi-comment-multiple</v-icon>
					</v-btn>
				</template>
				<span>test comment by id</span>
			</v-tooltip>
			<v-tooltip left>
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon @click="clickArea($event)" v-bind="attrs"
						v-on="on"> 
					<v-icon style="font-size:15px">mdi-comment-multiple-outline</v-icon>
				</v-btn>
				</template> 
				<span>test comment by uuid</span>
			</v-tooltip>
					<comment 
						:showComment="showComment" 
						:heightComment="heightComment" 
						:top="top" 
						:left="left"
						:objectIdentifier="idItem"
						:uuid="uuidArea"
						:targetArea="contentTargetArea"
						:objectType="objType"
					/>
		</div>
</template>

<script>
import comment from "@/components/common/comment/Comment.vue"
export default {
	components:{
		comment
	},
	methods:{
		clickFull(event){
			this.showComment = !this.showComment;
			this.heightComment = "800px"
			this.idItem = 1721
			this.objType = 'document'
			this.contentTargetArea = ''
			this.uuidArea = "0"
		},
		clickArea(event){
			this.showComment = !this.showComment;
			this.heightComment ='200px'
			this.idItem = 1721
			this.objType = 'document'
			this.contentTargetArea = '<span>ahihihi</span>'
			this.uuidArea = 'asdasdasdasd'
		},
	},
	 data: function() {
        return {
            isShowDialog: false,
			isShowDialogNotification: false,
			showComment: false,
			heightComment: '',
			top: null,
			left:null,
			idItem:null,
			uuidArea:'0',
			contentTargetArea:'',
			objType:'',
			commentTarget:{}
        };
    }
}
</script>

<style>

</style>